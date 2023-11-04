import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from "../users/users.module";
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, TokenService],
  controllers: [AuthController]
})
export class AuthModule {}
