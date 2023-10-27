import { z } from "zod";
export declare const messages: {
    namespace: "messages";
    events: {
        send: {
            name: "send";
            data: z.ZodObject<{
                username: z.ZodString;
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                username?: string;
                message?: string;
            }, {
                username?: string;
                message?: string;
            }>;
            withResponse: true;
        };
        delete: {
            name: "delete";
            data: z.ZodObject<{
                messageId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                messageId?: string;
            }, {
                messageId?: string;
            }>;
        };
    };
};
//# sourceMappingURL=messages.d.ts.map