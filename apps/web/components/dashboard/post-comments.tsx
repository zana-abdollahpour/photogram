import { trpc } from "@/lib/trpc/client";
import { Comments } from "./comments";

interface PostCommentsProps {
  postId: number;
}

export function PostComments({ postId }: PostCommentsProps) {
  const utils = trpc.useUtils();
  const { data: comments } = trpc.commentsRouter.findByPostId.useQuery({
    postId,
  });

  const handleAddComment = trpc.commentsRouter.create.useMutation({
    onSuccess: (_, variables) => {
      utils.commentsRouter.findByPostId.invalidate({
        postId: variables.postId,
      });

      utils.postsRouter.findAll.setData({}, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === variables.postId) {
            return { ...post, comments: post.comments + 1 };
          }
          return post;
        });
      });
    },
  });

  const handleDeleteComment = trpc.commentsRouter.delete.useMutation({
    onSuccess: () => {
      utils.commentsRouter.findByPostId.invalidate();
      utils.postsRouter.findAll.invalidate();
    },
  });

  const handleAddCommentSubmit = (text: string) => {
    handleAddComment.mutate({ postId, text });
  };

  const handleDeleteCommentSubmit = (commentId: number) => {
    handleDeleteComment.mutate({ commentId });
  };

  return (
    <Comments
      comments={comments || []}
      onAddComment={handleAddCommentSubmit}
      onDeleteComment={handleDeleteCommentSubmit}
    />
  );
}
