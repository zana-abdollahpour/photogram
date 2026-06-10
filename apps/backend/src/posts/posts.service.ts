import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq } from 'drizzle-orm';

import { DATABASE_CONNECTION } from 'src/database/database.connection';
import { schema } from 'src/database/database.module';
import { like, post } from 'src/posts/schemas/schema';
import { UsersService } from 'src/auth/users/users.service';
import type { CreatePostInput, Post } from '@repo/trpc/schemas';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly userService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    await this.database.insert(post).values({
      userId: userId,
      caption: createPostInput.caption,
      image: createPostInput.image,
      createdAt: new Date(),
    });
  }

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
      },
      where: postUserId ? eq(post.userId, postUserId) : undefined,
      orderBy: [desc(post.createdAt)],
    });
    return posts.map((savedPost) => ({
      id: savedPost.id,
      user: {
        username: savedPost.user.name,
        id: savedPost.user.id,
        avatar: savedPost.user.image || '',
      },
      image: savedPost.image,
      likes: savedPost.likes.length,
      caption: savedPost.caption,
      timestamp: savedPost.createdAt.toISOString(),
      comments: savedPost.comments.length,
      isLiked: savedPost.likes.some((like) => like.userId === userId),
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.database.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });

    if (existingLike) {
      await this.database.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.database.insert(like).values({ postId, userId });
    }
  }
}
