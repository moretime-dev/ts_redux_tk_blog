import { SinglePost } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

import { Link } from "react-router-dom";

const PostExcerpt: React.FC<{ post: SinglePost }> = ({ post }) => {
  return (
    <article>
      <h3>{post.title}</h3>
      {<p className="excerpt">{post.body.substring(0, 75)}</p>}
      <Link to={`/${post.id}`}>
        <div className="postCredit">
          <PostAuthor userId={post.userId ? post.userId : 0} />
          <TimeAgo timestamp={post.date} />
          <ReactionButtons post={post} />
        </div>
      </Link>
    </article>
  );
};

export default PostExcerpt;
