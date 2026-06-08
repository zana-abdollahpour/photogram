import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DATABASE_CONNECTION } from 'src/database/database.connection';
import * as authSchema from 'src/auth/schema';
import * as postSchema from 'src/posts/schemas/schema';
import * as commentsSchema from 'src/comments/schemas/schema';
import * as storiesSchema from 'src/stories/schemas/schema';

export const schema = {
  ...authSchema,
  ...postSchema,
  ...commentsSchema,
  ...storiesSchema,
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
