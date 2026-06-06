import { Request, Response } from 'express';
import { session, user } from 'src/auth/schema';

export interface AppContext {
  req: Request;
  res: Response;
  user?: typeof user.$inferInsert;
  session?: typeof session.$inferSelect;
}
