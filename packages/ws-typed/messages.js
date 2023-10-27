"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
const zod_1 = require("zod");
const lib_1 = require("./lib");
const SendMessageSchema = zod_1.z.object({
    username: zod_1.z.string(),
    message: zod_1.z.string()
});
const DeleteMessageSchema = zod_1.z.object({
    messageId: zod_1.z.string(),
});
exports.messages = (0, lib_1.initGateway)({
    namespace: 'messages',
    events: {
        send: {
            name: "send",
            data: SendMessageSchema,
            withResponse: true
        },
        delete: {
            name: "delete",
            data: DeleteMessageSchema
        },
    }
});
//# sourceMappingURL=messages.js.map