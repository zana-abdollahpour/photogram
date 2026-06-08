import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, User } from "lucide-react";

import { Comment } from "@repo/trpc/schemas";
import { getImageUrl } from "@/lib/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export function Comments({
  comments,
  onAddComment,
  onDeleteComment,
}: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-64 space-y-3 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-2">
            <Button
              variant="ghost"
              className="p-0 pt-3"
              onClick={() => router.push(`/users/${comment.user.id}`)}
            >
              {getImageUrl(comment.user.avatar) ? (
                <Image
                  src={getImageUrl(comment.user.avatar)}
                  alt={comment.user.username}
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full"
                />
              ) : (
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <User className="text-muted-foreground h-4 w-4" />
                </div>
              )}
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/users/${comment.user.id}`)}
                    className="mt-1 p-0 text-sm font-semibold"
                  >
                    {comment.user.username}
                  </Button>
                  <p className="text-sm wrap-break-word">{comment.text}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto shrink-0 p-1"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <Trash2 className="text-muted-foreground h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
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
  );
}
