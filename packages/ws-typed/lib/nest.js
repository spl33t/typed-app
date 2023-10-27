"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedWsEvent = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const TypedWsEvent = (event) => {
    const decorators = [];
    decorators.push(...[
        (0, common_1.SetMetadata)(constants_1.TypedWsEventMetadataKey, event),
        (0, websockets_1.SubscribeMessage)(event.name),
    ]);
    return (0, common_1.applyDecorators)(...decorators);
};
exports.TypedWsEvent = TypedWsEvent;
//# sourceMappingURL=nest.js.map