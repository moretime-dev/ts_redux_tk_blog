import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { addNewPost } from "./postsSlice";

import { selectAllUsers } from "../users/usersSlice";

const AddPostForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [addRequestStatus, setAddRequestStatus] = useState<string>("idle");

  const users = useAppSelector(selectAllUsers);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onTitleChanged = (event: React.FormEvent<HTMLInputElement>) =>
    setTitle(event.currentTarget.value);

  const onContentChanged = (event: React.FormEvent<HTMLTextAreaElement>) =>
    setContent(event.currentTarget.value);

  const onAuthorChanged = (event: React.FormEvent<HTMLSelectElement>) =>
    setUserId(+event.currentTarget.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost({ title, body: content, userId })).unwrap();

        setTitle("");
        setContent("");
        setUserId(0);
        navigate("/");
      } catch (err) {
        console.error("Failed to save post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value="0">--select author--</option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
