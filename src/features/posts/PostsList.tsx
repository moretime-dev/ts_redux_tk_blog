import { useAppSelector } from "../../app/hooks";
import { selectAllPosts } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

const PostsList: React.FC = () => {
  const posts = useAppSelector(selectAllPosts);

  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const renderedPosts = orderedPosts.map((post) => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
      <div className="postCredit">
        <PostAuthor userId={post.userId ? post.userId : ""} />
        <TimeAgo timestamp={post.date} />
        <ReactionButtons post={post} />
      </div>
    </article>
  ));

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
};

export default PostsList;
