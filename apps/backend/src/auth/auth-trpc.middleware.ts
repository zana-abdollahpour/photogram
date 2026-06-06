import { Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc-v2';

import { auth } from 'src/auth/auth';
import { user } from 'src/auth/schema';

interface AppContextType {
  req: Request;
  res: Response;
  user?: typeof user.$inferInsert;
  session?: typeof auth.$Infer.Session;
}

@Injectable()
export class AuthTrpcMiddleware implements TRPCMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(opts: MiddlewareOptions<AppContextType>) {
    const { ctx, next } = opts;

    try {
      const session = await this.authService.api.getSession({
        headers: ctx.req.headers,
      });

      if (session?.user && session.session) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next({
          ctx: { ...ctx, user: session.user, session: session.session },
        });
      }

      throw new Error('Unauthorized');
    } catch (err) {
      console.error(err);
      throw new Error('Unauthorized');
    }
  }
}
