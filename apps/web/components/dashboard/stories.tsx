"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, User } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { authClient } from "@/lib/auth/client";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoryUpload } from "@/components/dashboard/story-upload";
import { StoryViewer } from "@/components/dashboard/story-viewer";

export function Stories() {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();

  const stories = trpc.storiesRouter.getStories.useQuery() || [];

  const ownStoryGroup = stories.data?.find(
    (group) => group.userId === session?.user.id,
  );
  const othersStoryGroups = stories.data?.filter(
    (group) => group.userId !== session?.user.id,
  );

  const createStory = trpc.storiesRouter.create.useMutation({
    onSuccess: () => {
      utils.storiesRouter.getStories.invalidate();
    },
  });

  const handleViewStory = (index: number) => {
    setSelectedGroupIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryUpdate = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    const { filename } = await uploadResponse.json();
    await createStory.mutateAsync({
      image: filename,
    });
  };

  return (
    <Card className="p-4">
      <div className="scrollbar-hide flex space-x-4 overflow-x-auto pb-2">
        <div className="flex shrink-0 flex-col items-center space-y-1">
          <div className="relative">
            <div
              className={cn(
                "rounded-full p-0.5",
                ownStoryGroup
                  ? "bg-linear-to-tr from-yellow-400 to-fuchsia-600"
                  : "bg-gray-200",
              )}
              onClick={() => {
                if (ownStoryGroup) {
                  handleViewStory(0);
                }
              }}
            >
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
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 bottom-0 size-5 rounded-full border-2 border-white"
              onClick={() => setShowCreateStory(true)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <span
            className="w-16 truncate text-center text-xs"
            title="Your story"
          >
            Your Story
          </span>
        </div>

        {othersStoryGroups?.map((storyGroup, index) => (
          <div
            key={storyGroup.userId}
            className="flex shrink-0 flex-col items-center space-y-1"
            onClick={() => handleViewStory(ownStoryGroup ? index + 1 : index)}
          >
            <div className="relative">
              <div className="rounded-full bg-gray-200 bg-linear-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
                {storyGroup.avatar ? (
                  <Image
                    src={getImageUrl(storyGroup.avatar)}
                    alt={storyGroup.username}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border-2 border-white object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="bg-muted flex size-16 items-center justify-center rounded-full border-2 border-white">
                    <User className="text-muted-foreground size-6" />
                  </div>
                )}
              </div>
            </div>

            <span
              className="w-16 truncate text-center text-xs"
              title={storyGroup.username}
            >
              {storyGroup.username}
            </span>
          </div>
        ))}
      </div>

      <StoryUpload
        open={showCreateStory}
        onOpenChange={setShowCreateStory}
        onSubmit={handleStoryUpdate}
      />

      <StoryViewer
        storyGroups={stories.data || []}
        initialGroupIndex={selectedGroupIndex}
        open={showStoryViewer}
        onOpenChange={setShowStoryViewer}
      />
    </Card>
  );
}
