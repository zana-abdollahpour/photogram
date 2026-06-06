"use client";

import Image from "next/image";
import { Heart, MessageCircle, User } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { getImageUrl } from "@/lib/image";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export function Feed() {
  const posts = trpc.postsRouter.findAll.useQuery();

  return (
    <div className="space-y-6">
      {posts.data?.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {getImageUrl(post.user.avatar) ? (
                <Image
                  src={getImageUrl(post.user.avatar)}
                  alt={post.user.username}
                  width={64}
                  height={64}
                  className="h-8 w-8 rounded-full"
                  unoptimized // TODO: remove later for real data
                />
              ) : (
                <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                  <User className="text-muted-foreground size-4" />
                </div>
              )}

              <span className="text-sm font-semibold">
                {post.user.username}
              </span>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              fill
              src={getImageUrl(post.image)}
              alt="Post"
              className="object-cover"
              unoptimized // TODO: remove later for real data
            />
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {}}
                  className="h-auto p-0"
                >
                  <Heart className="text-foreground h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {}}
                  className="h-auto p-0"
                >
                  <MessageCircle className="text-foreground h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="text-sm font-semibold">{post.likes} likes</div>

            <div className="text-sm">
              <span className="font-semibold">{post.user.username} </span>
              {post.caption}
            </div>

            {post.comments > 0 && (
              <div className="text-muted-foreground text-sm">
                View all {post.comments} comments
              </div>
            )}

            <div className="text-muted-foreground text-xs uppercase">
              {post.timestamp}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
