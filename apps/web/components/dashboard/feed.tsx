"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { getImageUrl } from "@/lib/image";
import type { Post } from "@repo/trpc/schemas";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostComments } from "@/components/dashboard/post-comments";

export function Feed() {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set(),
  );
  const router = useRouter();
  const utils = trpc.useUtils();
  const posts = trpc.postsRouter.findAll.useQuery({});
  const toggleLike = trpc.postsRouter.likePost.useMutation({
    onMutate: ({ postId }) => {
      utils.postsRouter.findAll.setData({}, (old) => {
        if (!old) {
          return old;
        }

        return old.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        });
      });
    },
  });

  const toggleComments = (postId: number) => {
    setExpandedComments((cur) => {
      const newSet = new Set(cur);

      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }

      return newSet;
    });
  };

  const handleToggleLike = (id: number) => {
    toggleLike.mutate({ postId: id });
  };

  return (
    <div className="space-y-6">
      {posts.data?.map((post: Post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="p-1"
                onClick={() => router.push(`/users/${post.user.id}`)}
              >
                {getImageUrl(post.user.avatar) ? (
                  <Image
                    src={getImageUrl(post.user.avatar)}
                    alt={post.user.username}
                    width={64}
                    height={64}
                    className="h-8 w-8 rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                    <User className="text-muted-foreground size-4" />
                  </div>
                )}

                <span className="text-sm font-semibold">
                  {post.user.username}
                </span>
              </Button>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              fill
              src={getImageUrl(post.image)}
              alt="Post"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleLike(+post.id)}
                  className="h-auto p-0"
                >
                  <Heart
                    className={cn(
                      "size-4",
                      post.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-foreground",
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="h-auto p-0"
                >
                  <MessageCircle
                    className={cn(
                      "size-4",
                      expandedComments.has(post.id)
                        ? "text-primary fill-primary"
                        : "text-foreground",
                    )}
                  />
                </Button>
              </div>
            </div>

            <div className="text-sm font-semibold">{post.likes} likes</div>

            <div className="text-sm">
              <Button
                variant="ghost"
                className="h-auto p-0 font-semibold hover:bg-transparent hover:opacity-80"
                onClick={() => router.push("/users/${post.user.id}")}
              >
                {post.user.username}
              </Button>{" "}
              {post.caption}
            </div>

            {post.comments > 0 && (
              <Button
                variant="ghost"
                className="text-muted-foreground h-auto p-0 text-sm hover:bg-transparent hover:opacity-80"
                onClick={() => toggleComments(post.id)}
              >
                View all {post.comments} comments
              </Button>
            )}

            <div className="text-muted-foreground text-xs uppercase">
              {new Date(post.timestamp).toLocaleDateString()}
            </div>

            {expandedComments.has(post.id) && (
              <div className="border-t pt-4">
                <PostComments postId={post.id} />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
