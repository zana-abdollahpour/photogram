import { Router, UseMiddlewares } from 'nestjs-trpc-v2';

import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {}
