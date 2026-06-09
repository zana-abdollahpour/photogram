import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import z from 'zod';

import {
  createStorySchema,
  storyGroupSchema,
  type CreateStoryInput,
} from '@repo/trpc/schemas';

import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';
import { StoriesService } from 'src/stories/stories.service';
import type { AppContext } from 'src/app-context.interface';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({ input: createStorySchema })
  create(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() context: AppContext,
  ) {
    return this.storiesService.create(createStoryInput, context.user!.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  getStories(@Ctx() context: AppContext) {
    return this.storiesService.getStories(context.user!.id);
  }
}
