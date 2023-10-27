import {
  createParamDecorator,
  ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express-serve-static-core';
import { TsRestAppRouteMetadataKey, } from './constants';
import { Endpoint } from "@packages/rest-typed/lib";
import { validate } from "class-validator";

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

    async function validateClass(object: Record<any, any>, values: Record<any, any>) {
      for (const key in values) {
        object[key] = values[key]
      }
      return  await validate(object)
    }

    if (endpoint?.method !== "GET" && endpoint?.body) {
      const errors = await validateClass(new endpoint.body(), req.body)
      if (errors.length > 0) {
        console.log(`Validation failed by class-validator in req.body`, errors)
        throw new HttpException(errors, HttpStatus.BAD_REQUEST)
      }
    }

    if (endpoint.query) {
      const errors = await validateClass(new endpoint.query(), req.query)
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
