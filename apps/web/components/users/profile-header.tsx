import Image from "next/image";
import { Edit, Globe, Settings, User } from "lucide-react";

import { getImageUrl } from "@/lib/image";
import { UserProfile } from "@repo/trpc/schemas";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowToggle: () => void;
  onEditProfile: () => void;
  onOpenFollowers: () => void;
  isOwnProfile: boolean;
  onOpenFollowing: () => void;
  isFollowLoading: boolean;
}

export function ProfileHeader({
  profile,
  onFollowToggle,
  isOwnProfile,
  onEditProfile,
  onOpenFollowers,
  onOpenFollowing,
  isFollowLoading,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <div className="shrink-0">
          {profile.image ? (
            <Image
              src={getImageUrl(profile.image)}
              alt={profile.name}
              width={150}
              height={150}
              className="h-32 w-32 rounded-full border-2 object-cover md:h-40 md:w-40"
            />
          ) : (
            <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-full border-2 md:h-40 md:w-40">
              <User className="text-muted-foreground h-16 w-16" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-normal">{profile.name}</h1>
            <div className="flex gap-2">
              {!isOwnProfile && (
                <Button
                  onClick={onFollowToggle}
                  disabled={isFollowLoading}
                  variant={profile.isFollowing ? "outline" : "default"}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              )}

              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEditProfile}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <span className="font-semibold">{profile.postCount}</span>{" "}
              <span className="text-muted-foreground">posts</span>
            </div>
            <Button
              variant="ghost"
              onClick={onOpenFollowers}
              className="h-auto p-0"
            >
              <span className="font-semibold">{profile.followerCount}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </Button>
            <Button
              variant="ghost"
              onClick={onOpenFollowing}
              className="h-auto p-0"
            >
              <span className="font-semibold">{profile.followingCount}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </Button>
          </div>

          <div className="space-y-1">
            {profile.bio && (
              <div className="text-sm whitespace-pre-wrap">{profile.bio}</div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                className="text-primary flex items-center gap-1 text-sm hover:underline"
              >
                <Globe className="h-3 w-3" />
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
