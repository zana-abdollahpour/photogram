import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import z from 'zod';

import { PostsService } from 'src/posts/posts.service';
import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';
import {
  postSchema,
  createPostSchema,
  type CreatePostInput,
} from 'src/posts/schemas/trpc.schema';

import type { AppContext } from 'src/app-context.interface';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema, output: postSchema })
  async create(
    @Input() createPostInput: CreatePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.create(createPostInput, context.user?.id || '');
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
