import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { Socket } from "socket.io"
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import {  TypedWsEvent } from "@packages/ws-typed/lib/nest";
import { messages } from "@packages/ws-typed/messages";

@WebSocketGateway({ namespace: "test" })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    const socketId = socket.id;
    console.log(`New connecting... socket id:`, socketId);
    //ChatWebsocketGateway.participants.set(socketId, '');
  }

  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;
    console.log(`Disconnection... socket id:`, socketId);
    /*const roomId = ChatWebsocketGateway.participants.get(socketId);
    const room = ChatWebsocketGateway.rooms.get(roomId);
    if (room) {
      room.participants.get(socketId).connected = false;
      this.server.emit(
        `participants/${roomId}`,
        Array.from(room.participants.values()),
      );
    }*/
  }

  @TypedWsEvent(messages.events.send)
  send() {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('delete')
  async delete(@MessageBody() data: number) {
    console.log("22222222222")
    return "sadsad";
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket,
              data: unknown) {
    client.emit("test", "test response")
  }

  /*
    test() {
      const event = 'test';
      this.server.emit("delete", "sadsad")
    }*/
}