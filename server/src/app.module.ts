import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from "./app.gateway";
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from "./auth/jwt.guard";
import { UsersService } from "./users/users.service";
import { TokenService } from "./auth/token.service";

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
      //useValue: [UsersService, TokenService]
    },],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule
  ],
})
export class AppModule {
}
