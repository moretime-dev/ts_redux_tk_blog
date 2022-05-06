import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";

const PostAuthor: React.FC<{ userId: number }> = ({ userId }) => {
  const users = useAppSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;
