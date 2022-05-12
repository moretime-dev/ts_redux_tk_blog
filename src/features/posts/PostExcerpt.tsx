import { SinglePost } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

import { Link } from "react-router-dom";

const PostExcerpt: React.FC<{ post: SinglePost }> = ({ post }) => {
  return (
    <article>
      <h2>{post.title}</h2>
      {<p className="excerpt">{post.body.substring(0, 75)}</p>}
      <div className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId ? post.userId : 0} />
        <TimeAgo timestamp={post.date} />
        <ReactionButtons post={post} />
      </div>
    </article>
  );
};

export default PostExcerpt;
