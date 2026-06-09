"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { trpc } from "@/lib/trpc/client";

import { ProfileNavigation } from "@/components/users/profile-navigation";
import { ProfileHeader } from "@/components/users/profile-header";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [followersFollowingModal, setFollowersFollowingModal] = useState<{
    open: boolean;
    type: "followers" | "following";
  }>({
    open: false,
    type: "followers",
  });
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.usersRouter.getUserProfile.useQuery(
    {
      userId,
    },
  );

  const unfollowMutation = trpc.usersRouter.unfollow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getUserProfile.invalidate({ userId });
    },
  });

  const followMutation = trpc.usersRouter.follow.useMutation({
    onSuccess: () => {
      utils.usersRouter.getUserProfile.invalidate({ userId });
    },
  });

  const handleFollowToggle = () => {
    if (!profile) {
      return;
    }
    if (profile?.isFollowing) {
      unfollowMutation.mutate({ userId: profile.id });
    } else {
      followMutation.mutate({ userId: profile.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">User not found</h1>
          <p className="text-muted-foreground">This user doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <ProfileNavigation />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <ProfileHeader
          isOwnProfile={true} // TODO: replace with real check
          profile={profile}
          onFollowToggle={handleFollowToggle}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onOpenFollowers={() =>
            setFollowersFollowingModal({ open: true, type: "followers" })
          }
          onOpenFollowing={() =>
            setFollowersFollowingModal({ open: true, type: "following" })
          }
          isFollowLoading={
            followMutation.isPending || unfollowMutation.isPending
          }
        />
      </div>
    </div>
  );
}
