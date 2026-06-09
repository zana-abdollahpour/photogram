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
  updateProfileSchema,
  userIdSchema,
  userProfileSchema,
  type UserIdInput,
  type UpdateProfileInput,
} from '@repo/trpc/schemas';

import { UsersService } from './users.service';
import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';
import type { AppContext } from 'src/app-context.interface';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({ input: updateProfileSchema })
  updateProfile(
    @Input() input: UpdateProfileInput,
    @Ctx() context: AppContext,
  ) {
    return this.usersService.updateProfile(context.user!.id, input);
  }

  @Mutation({ input: userIdSchema })
  follow(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.follow(context.user!.id, input.userId);
  }

  @Mutation({ input: userIdSchema })
  unfollow(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.unfollow(context.user!.id, input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userProfileSchema) })
  getFollowers(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.getFollowers(input.userId, context.user!.id);
  }

  @Query({ input: userIdSchema, output: z.array(userProfileSchema) })
  getFollowing(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.getFollowing(input.userId, context.user!.id);
  }

  @Query({ output: z.array(userProfileSchema) })
  getSuggestedUsers(@Ctx() context: AppContext) {
    return this.usersService.getSuggestedUsers(context.user!.id);
  }

  @Query({ input: userIdSchema, output: userProfileSchema })
  getUserProfile(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.getUserProfile(input.userId, context.user!.id);
  }
}
