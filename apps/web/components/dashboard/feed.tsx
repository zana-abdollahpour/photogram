"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

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

// TODO: replace with real data from backend
const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      username: "johndoe",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    caption: "Beautiful sunset at the beach 🌅",
    likes: 142,
    comments: 8,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      username: "janedoe",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop&crop=faces",
    },
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
    caption: "Coffee and code ☕️ #dev #coffee",
    likes: 89,
    comments: 12,
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    user: {
      username: "photographer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    caption: "Mountain adventures never get old 🏔️",
    likes: 256,
    comments: 23,
    timestamp: "6 hours ago",
  },
];

export function Feed() {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Image
                src={post.user.avatar}
                alt={post.user.username}
                width={64}
                height={64}
                className="h-8 w-8 rounded-full"
                unoptimized // TODO: remove later for real data
              />
              <span className="text-sm font-semibold">
                {post.user.username}
              </span>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              src={post.image}
              alt="Post"
              className="h-full w-full object-cover"
              width={600}
              height={600}
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
