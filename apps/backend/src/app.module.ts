import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { TRPCModule } from 'nestjs-trpc-v2';
import { betterAuth } from 'better-auth';

import { AppContext } from './app.context';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './auth/users/users.module';
import { UploadModule } from './upload/upload.module';
import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
      basePath: '/api/trpc',
      context: AppContext,
    }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      inject: [DATABASE_CONNECTION, ConfigService],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, { provider: 'pg' }),
          trustedOrigins: [configService.getOrThrow('UI_URL')],
          emailAndPassword: { enabled: true },
        }),
      }),
    }),
    PostsModule,
    UsersModule,
    UploadModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    AppContext,
    AuthTrpcMiddleware,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
