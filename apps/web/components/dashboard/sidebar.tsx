"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { getImageUrl } from "@/lib/image";
import { authClient } from "@/lib/auth/client";
import { trpc } from "@/lib/trpc/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AvatarUpload } from "@/components/dashboard/avatar-upload";

export function Sidebar() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();
  const { data: suggestedUsers = [] } =
    trpc.usersRouter.getSuggestedUsers.useQuery();

  const followMutation = trpc.usersRouter.follow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getSuggestedUsers.invalidate();
    },
  });

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
          {suggestedUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No suggestions available
            </p>
          ) : (
            suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="flex h-auto items-center gap-3 p-0 hover:bg-transparent"
                >
                  {user.image ? (
                    <Image
                      src={getImageUrl(user.image)}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  ) : (
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-semibold">{user.name}</div>
                    {user.bio && (
                      <div className="text-muted-foreground truncate text-xs">
                        {user.bio}
                      </div>
                    )}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/90 text-xs"
                  onClick={() => followMutation.mutate({ userId: user.id })}
                  disabled={followMutation.isPending}
                >
                  Follow
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
