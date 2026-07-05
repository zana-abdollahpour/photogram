import { trpc } from "@/lib/trpc/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import { User } from "lucide-react";
import { authClient } from "@/lib/auth/client";

interface FollowersFollowingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
}

export function FollowersFollowingModal({
  open,
  onOpenChange,
  userId,
  type,
}: FollowersFollowingModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();
  const { data: followers = [] } = trpc.usersRouter.getFollowers.useQuery(
    {
      userId,
    },
    {
      enabled: open && type === "followers",
    },
  );
  const { data: following = [] } = trpc.usersRouter.getFollowing.useQuery(
    {
      userId,
    },
    {
      enabled: open && type === "following",
    },
  );
  const followMutation = trpc.usersRouter.follow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getFollowers.invalidate({ userId });
      utils.usersRouter.getFollowing.invalidate({ userId });
      utils.usersRouter.getUserProfile.invalidate({ userId });
    },
  });

  const unfollowMutation = trpc.usersRouter.unfollow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getFollowers.invalidate({ userId });
      utils.usersRouter.getFollowing.invalidate({ userId });
      utils.usersRouter.getUserProfile.invalidate({ userId });
    },
  });

  const users = type === "followers" ? followers : following;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No {type === "followers" ? "followers" : "following"} yet
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push(`/users/${user.id}`);
                      onOpenChange(false);
                    }}
                    className="flex h-auto flex-1 items-center justify-start space-x-3 p-0"
                  >
                    {user.image ? (
                      <Image
                        src={getImageUrl(user.image)}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="text-muted-foreground h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-semibold">
                        {user.name}
                      </div>
                      {user.bio && (
                        <div className="text-muted-foreground truncate text-xs">
                          {user.bio}
                        </div>
                      )}
                    </div>
                  </Button>
                  {session?.user.id !== user.id && (
                    <Button
                      variant={user.isFollowing ? "outline" : "default"}
                      size={"sm"}
                      onClick={() => {
                        if (user.isFollowing) {
                          unfollowMutation.mutate({ userId: user.id });
                        } else {
                          followMutation.mutate({ userId: user.id });
                        }
                      }}
                      disabled={
                        followMutation.isPending || unfollowMutation.isPaused
                      }
                      className="shrink-0"
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
