"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { getImageUrl } from "@/lib/image";
import { authClient } from "@/lib/auth/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AvatarUpload } from "@/components/dashboard/avatar-upload";

interface SuggestedUser {
  id: string;
  username: string;
  avatar: string;
  followedBy: string;
}

// TODO: replace with real data
const mockSuggestions: SuggestedUser[] = [
  {
    id: "1",
    username: "alexsmith",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    followedBy: "johndoe",
  },
  {
    id: "2",
    username: "sarahwilson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    followedBy: "janedoe",
  },
  {
    id: "3",
    username: "mikejohnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    followedBy: "photographer",
  },
  {
    id: "4",
    username: "emilydavis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    followedBy: "photographer",
  },
  {
    id: "5",
    username: "davidbrown",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face",
    followedBy: "traveler",
  },
];

export function Sidebar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="mb-4 flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="ghost"
              className="h-auto w-full p-0 text-left transition-opacity hover:bg-transparent hover:opacity-80"
              onClick={() => router.push(`/users/${session?.user.id}`)}
            >
              {session?.user.image ? (
                <Image
                  src={getImageUrl(session?.user.image)}
                  alt="Your Profile"
                  width={60}
                  height={60}
                  className="size-14 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                  <User className="text-muted-foreground size-4" />
                </div>
              )}
            </Button>

            <AvatarUpload />
          </div>

          <div className="min-w-0 flex-1">
            <Button
              variant="ghost"
              className="h-auto w-full p-0 text-left transition-opacity hover:bg-transparent hover:opacity-80"
              onClick={() => router.push(`/users/${session?.user.id}`)}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">
                  {session?.user.email}
                </div>
                <div className="text-muted-foreground truncate text-sm">
                  {session?.user.name}
                </div>
              </div>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              title="Sign Out"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-muted-foreground font-semibold">
            Suggested for you
          </h3>
        </div>

        <div className="space-y-3">
          {mockSuggestions.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Image
                src={user.avatar}
                alt={user.username}
                className="size-8 rounded-full"
                width={40}
                height={40}
                unoptimized
              />

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{user.username}</div>
                {user.followedBy && (
                  <div className="text-muted-foreground text-xs">
                    Followed by {user.followedBy}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 text-xs"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
