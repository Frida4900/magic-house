import { formatDate } from "../lib/format";

export default function CommentList({ comments }) {
  if (!comments.length) {
    return <div className="empty-card">还没有人留言，欢迎成为第一个写短评的人。</div>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article key={comment.id} className="comment-card">
          <div className="comment-head">
            <strong>{comment.user.username}</strong>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <p>{comment.content}</p>
        </article>
      ))}
    </div>
  );
}
