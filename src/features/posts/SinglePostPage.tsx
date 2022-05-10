import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const SinglePostPage: React.FC<{ postId: string }> = ({ postId }) => {
  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not Found</h2>
      </section>
    );
  } else {
    return (
      <section>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </section>
    );
  }
};

export default SinglePostPage;
