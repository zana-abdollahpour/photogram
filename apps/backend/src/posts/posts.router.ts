import { Input, Mutation, Query, Router } from 'nestjs-trpc-v2';
import z from 'zod';

import { PostsService } from 'src/posts/posts.service';
import {
  postSchema,
  createPostSchema,
  type CreatePostInput,
} from 'src/posts/schemas/trpc.schema';

@Router()
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema, output: postSchema })
  async create(@Input() createPostInput: CreatePostInput) {
    // TODO: use real userId
    return this.postsService.create(
      createPostInput,
      'P2Xcog2FIElsecdpWWfQ6CXaY95qNH99',
    );
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
