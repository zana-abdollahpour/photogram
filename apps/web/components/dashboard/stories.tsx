"use client";

import Image from "next/image";
import { User } from "lucide-react";

import { authClient } from "@/lib/auth/client";

import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image";

interface Story {
  id: string;
  username: string;
  avatar: string;
}

// TODO: replace with actual data from backend
const mockStories: Story[] = [
  {
    id: "1",
    username: "johndoe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "2",
    username: "janedoe",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop&crop=faces",
  },
  {
    id: "3",
    username: "photographer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "4",
    username: "traveler",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
  },
  {
    id: "5",
    username: "foodie",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=60&h=60&fit=crop&crop=face",
  },
];

const mockMyStory = {
  id: "your_story",
  username: "Your Story",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face",
};

export function Stories() {
  const { data: session } = authClient.useSession();

  return (
    <Card className="p-4">
      <div className="scrollbar-hide flex space-x-4 overflow-x-auto pb-2">
        <div className="flex shrink-0 flex-col items-center space-y-1">
          <div className="relative">
            <div className="rounded-full bg-gray-200 bg-linear-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
              {session?.user.image ? (
                <Image
                  src={getImageUrl(session?.user.image)}
                  alt="Your profile picture"
                  width={60}
                  height={60}
                  className="size-16 rounded-full"
                  unoptimized // TODO: remove later for real data
                />
              ) : (
                <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                  <User className="text-muted-foreground size-6" />
                </div>
              )}
            </div>
          </div>

          <span
            className="w-16 truncate text-center text-xs"
            title="Your story"
          >
            {mockMyStory.username}
          </span>
        </div>

        {mockStories.map((story) => (
          <div
            key={story.id}
            className="flex shrink-0 flex-col items-center space-y-1"
          >
            <div className="relative">
              <div className="rounded-full bg-gray-200 bg-linear-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
                <Image
                  src={story.avatar}
                  alt={story.username}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border-2 border-white object-cover"
                  unoptimized // TODO: remove later for real data
                />
              </div>
            </div>

            <span
              className="w-16 truncate text-center text-xs"
              title={story.username}
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
