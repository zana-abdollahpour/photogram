import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc } from 'drizzle-orm';

import { DATABASE_CONNECTION } from 'src/database/database.connection';
import { schema } from 'src/database/database.module';
import { post } from 'src/posts/schemas/schema';
import { UsersService } from 'src/auth/users/users.service';
import type { Post, CreatePostInput } from 'src/posts/schemas/trpc.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly userService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    const [newPost] = await this.database
      .insert(post)
      .values({
        userId: userId,
        caption: createPostInput.caption,
        image: createPostInput.image,
        likes: 0,
        createdAt: new Date(),
      })
      .returning();

    return this.formatPostResponse(newPost, userId);
  }

  async findAll() {
    const posts = await this.database.query.post.findMany({
      with: { user: true },
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((p) => ({
      id: p.id,
      user: { username: p.user.name, avatar: '' }, // TODO: add real avatar later
      caption: p.caption,
      image: p.image,
      likes: p.likes,
      timestamp: p.createdAt.toISOString(),
      comments: 0, //TODO: add via comments table
    }));
  }

  private async formatPostResponse(
    savedPost: typeof post.$inferSelect,
    userId: string,
  ): Promise<Post> {
    const userInfo = await this.userService.findById(userId);

    return {
      id: savedPost.id,
      user: { username: userInfo.name, avatar: '' }, // TODO: add real avatar later
      caption: savedPost.caption,
      image: savedPost.image,
      likes: savedPost.likes,
      timestamp: savedPost.createdAt.toISOString(),
      comments: 0, //TODO: add via comments table
    };
  }
}
