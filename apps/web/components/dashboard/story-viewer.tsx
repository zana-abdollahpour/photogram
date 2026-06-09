import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, User, X } from "lucide-react";

import { StoryGroup } from "@repo/trpc/schemas";
import { getImageUrl } from "@/lib/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  open: boolean;
  initialGroupIndex: number;
  onOpenChange: (open: boolean) => void;
}

export function StoryViewer({
  storyGroups,
  open,
  onOpenChange,
  initialGroupIndex,
}: StoryViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const shouldAdvanceRef = useRef(false);
  const router = useRouter();

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  const handleNext = () => {
    if (!currentGroup) {
      return;
    }

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex((cur) => cur + 1);
      setProgress(0);
      return;
    }

    if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex((cur) => cur + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      return;
    }

    onOpenChange(false);
  };

  const handlePrevious = () => {
    if (!currentGroup) {
      return;
    }

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((cur) => cur - 1);
      setProgress(0);
      return;
    }

    if (currentGroupIndex > 0) {
      const prevGroup = storyGroups[currentGroupIndex - 1];
      if (!prevGroup) {
        return;
      }
      setCurrentGroupIndex((cur) => cur - 1);
      setCurrentStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentGroupIndex(initialGroupIndex);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  }, [open, initialGroupIndex]);

  useEffect(() => {
    if (!open || !currentStory) {
      return;
    }

    setProgress(0);
    shouldAdvanceRef.current = false;

    const interval = setInterval(() => {
      setProgress((cur) => {
        if (cur >= 100) {
          shouldAdvanceRef.current = true;
          return 0;
        }
        return cur + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStory?.id, open]);

  useEffect(() => {
    if (shouldAdvanceRef.current) {
      shouldAdvanceRef.current = false;
      handleNext();
    }
  });

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!currentGroup || !currentStory) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="h-[90vh] w-full max-w-md! overflow-hidden bg-black p-0"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{`${currentGroup.username}'s Story`}</DialogTitle>
        </DialogHeader>

        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute top-0 right-0 left-0 z-20 flex gap-1 p-2">
            {currentGroup.stories.map((_, index) => (
              <div
                key={index}
                className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      index < currentStoryIndex
                        ? "100%"
                        : index === currentStoryIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-4 right-0 left-0 z-20 flex items-center justify-between px-4 pt-2">
            <Button
              variant="ghost"
              className="flex h-auto items-center space-x-3 p-0 transition-opacity hover:bg-transparent hover:opacity-80"
              onClick={() => router.push(`/users/${currentGroup.userId}`)}
            >
              {currentGroup.avatar ? (
                <Image
                  src={getImageUrl(currentGroup.avatar)}
                  alt={currentGroup.username}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/20">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-white">
                  {currentGroup.username}
                </div>
              </div>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative h-full w-full">
            <Image
              src={getImageUrl(currentStory.image)}
              alt="Story"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {(currentGroupIndex > 0 || currentStoryIndex > 0) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="size-6" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
