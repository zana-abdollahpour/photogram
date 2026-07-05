"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, Trash2, User } from "lucide-react";

import { Post } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";
import { getImageUrl } from "@/lib/image";
import { authClient } from "@/lib/auth/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostModal({
  post: initialPost,
  open,
  onOpenChange,
}: PostModalProps) {
  const { data: allPosts } = trpc.postsRouter.findAll.useQuery({});
  const post = allPosts?.find((p) => p.id === initialPost.id) || initialPost;
  const [commentText, setCommentText] = useState("");
  const { data: comments = [] } = trpc.commentsRouter.findByPostId.useQuery({
    postId: post.id,
  });
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();
  const deleteCommentMutation = trpc.commentsRouter.delete.useMutation({
    onSuccess: () => {
      utils.commentsRouter.findByPostId.invalidate({ postId: post.id });
      utils.postsRouter.findAll.invalidate();
    },
  });

  const handleDeleteComment = async (commentId: number) => {
    await deleteCommentMutation.mutateAsync({ commentId });
  };

  const likePostMutation = trpc.postsRouter.likePost.useMutation({
    onSuccess: () => {
      utils.postsRouter.findAll.invalidate();
      utils.usersRouter.getUserProfile.invalidate();
    },
  });
  const createCommentMutation = trpc.commentsRouter.create.useMutation({
    onSuccess: (_, variables) => {
      utils.commentsRouter.findByPostId.invalidate({
        postId: variables.postId,
      });
      utils.postsRouter.findAll.invalidate();
      setCommentText("");
    },
  });

  const savePostMutation = () => {}; // TODO: implement save post mutation
  savePostMutation.isPending = false; // TODO: replace with actual loading state

  const handleSave = async () => {
    // TODO: implement save post functionality
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        text: commentText,
      });
    }
  };

  const handleLike = async () => {
    await likePostMutation.mutateAsync({ postId: post.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] w-full max-w-5xl! flex-col overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Post Modal</DialogTitle>
        </DialogHeader>

        <div className="grid h-full flex-1 overflow-hidden md:grid-cols-[1.5fr_1fr]">
          <div className="relative flex min-h-0 items-center justify-center bg-black">
            <div className="relative h-full w-full">
              <Image
                src={getImageUrl(post.image)}
                alt={post.caption}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="bg-background flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/users/${post.user.id}`)}
                className="flex h-auto items-center space-x-3 p-0"
              >
                {post.user.avatar ? (
                  <Image
                    src={getImageUrl(post.user.avatar)}
                    alt={post.user.username}
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
                <span className="font-semibold">{post.user.username}</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/users/${post.user.id}`)}
                  className="h-auto shrink-0 p-0 hover:bg-transparent hover:opacity-80"
                >
                  {post.user.avatar ? (
                    <Image
                      src={getImageUrl(post.user.avatar)}
                      alt={post.user.username}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-4 w-4" />
                    </div>
                  )}
                </Button>
                <div className="flex-1">
                  <div className="space-y-1">
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/users/${post.user.id}`)}
                        className="mr-2 h-auto p-0 font-semibold hover:bg-transparent hover:opacity-80"
                      >
                        {post.user.username}
                      </Button>
                      <span className="text-sm">{post.caption}</span>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/users/${comment.user.id}`)}
                      className="h-auto shrink-0 p-0 hover:bg-transparent hover:opacity-80"
                    >
                      {getImageUrl(comment.user.avatar) ? (
                        <Image
                          src={getImageUrl(comment.user.avatar)}
                          alt={comment.user.username}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                          <User className="text-muted-foreground h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              router.push(`/users/${comment.user.id}`)
                            }
                            className="h-auto p-0 text-sm font-semibold hover:bg-transparent hover:opacity-80"
                          >
                            {comment.user.username}
                          </Button>
                          <p className="text-sm wrap-break-word">
                            {comment.text}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {session?.user.id === comment.user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto shrink-0 p-1"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="text-muted-foreground h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-muted-foreground p-4 text-center text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    disabled={likePostMutation.isPending}
                    className="h-auto p-0"
                  >
                    <Heart
                      className={`h-6 w-6 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <div className="text-sm font-semibold">
                    {post.likes} likes
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={savePostMutation.isPending}
                  className="h-auto p-0"
                >
                  <Bookmark
                    className={`h-6 w-6 ${post.isSaved ? "fill-foreground" : ""}`}
                  />
                </Button>
              </div>

              <div className="border-t p-4">
                <form
                  onSubmit={handleAddComment}
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!commentText.trim()}>
                    Post
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
