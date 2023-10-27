import { ParamsFromUrl } from "./paths"
import { Without } from "./type-utils";
import { IncomingHttpHeaders } from "node:http";
import { Type } from "@nestjs/common"

export type TypeOrNever<T extends Record<any, any> | undefined> = T extends Record<any, any> ? T["prototype"] : never

export type ServerInferRequest<T extends Endpoint> = Without<{
  params: ParamsFromUrl<T['path']>
  query: TypeOrNever<T["query"]>
  body: T extends EndpointMutation ? TypeOrNever<T["body"]> : never
  headers: IncomingHttpHeaders;
}, never>

export type ControllerRequests<T extends Controller> = {
  [K in keyof T["endpoints"]]: ServerInferRequest<T["endpoints"][K]>
}

export type EndpointCommon = {
  path: string,
  response: Type,
  query?: Type
}

type EndpointQuery = EndpointCommon & {
  method: 'GET';
};

type EndpointMutation = EndpointCommon & {
  method: 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  contentType?: 'application/json' | 'multipart/form-data';
  body: Type;
};

export type Endpoint = EndpointQuery | EndpointMutation;

export type Controller = {
  prefix: string,
  endpoints: Record<string, Endpoint>
}

type RecursivelyProcessController<T extends Controller | Record<any, Endpoint>> = {
  [K in keyof T]: T[K] extends Record<any, Endpoint> ? RecursivelyProcessController<T[K]> : T[K]
};

export function initController<T extends Controller>(controller: RecursivelyProcessController<T>) {
  return controller as T
}

export type GetResponsesData<T extends Endpoint> = T["response"]["prototype"]