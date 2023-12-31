import { ZodSchema } from "zod";
export type WsEvent = {
    name: string;
    data: ZodSchema;
    withResponse?: boolean;
};
export type WsGateway = {
    namespace: string;
    events: Record<any, WsEvent>;
};
type RecursivelyProcessController<T extends WsGateway | Record<any, WsEvent>> = {
    [K in keyof T]: T[K] extends Record<any, WsEvent> ? RecursivelyProcessController<T[K]> : T[K];
};
export declare function initGateway<T extends WsGateway>(gateway: RecursivelyProcessController<T>): T;
export {};
//# sourceMappingURL=index.d.ts.map