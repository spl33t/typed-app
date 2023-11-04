import {
  createParamDecorator,
  ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express-serve-static-core';
import { TsRestAppRouteMetadataKey, } from './constants';
import { Endpoint } from "@packages/rest-typed/lib";
import { validateClassByValues } from "@packages/utils/class-validator";
import { plainToInstance } from "class-transformer";

export const TypedRequest = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    const endpoint: Endpoint | undefined = Reflect.getMetadata(
      TsRestAppRouteMetadataKey,
      ctx.getHandler()
    );

    if (!endpoint) {
      // this will respond with a 500 error without revealing this error message in the response body
      throw new Error('Make sure your endpoint is decorated with @TsRest()');
    }

    if (endpoint?.method !== "GET" && endpoint?.body) {
      req.body = plainToInstance(endpoint.body, req.body)
      const errors = await validateClassByValues(new endpoint.body(), req.body)
      if (errors.length > 0) {
        console.log(`Validation failed by class-validator in req.body`, errors)
        throw new HttpException(errors, HttpStatus.BAD_REQUEST)
      }
    }

    if (endpoint.query) {
      req.query = plainToInstance(endpoint.query, req.query)
      const errors = await validateClassByValues(new endpoint.query(), req.query)
      if (errors.length > 0) {
        console.log(`Validation failed by class-validator in req.query`, errors)
        throw new HttpException(errors, HttpStatus.BAD_REQUEST)
      }
    }


    return {
      params: req.params,
      body: req.body,
      query: req.query,
      headers: req.headers
    };
  }
);
