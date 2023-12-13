import React, { useState } from "react";
import { getFirestore } from "firebase/firestore";
import useAuth from "./useAuth";
import usePosts from "./usePosts";
import Post from "./Post";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { submitPost, likePost, unlikePost, addComment } from "./PostActions";

const Home = () => {
  const [postContent, setPostContent] = useState("");
  const firestore = getFirestore();
  const user = useAuth();
  const posts = usePosts(firestore);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      // Assuming user object has displayName and photoURL properties
      const username = user.displayName || "Anonymous";
      const userPhotoURL = user.photoURL || "default-avatar-url"; // You should have a default avatar URL
      await submitPost(
        firestore,
        user.uid,
        postContent,
        username,
        userPhotoURL
      );
      setPostContent("");
    } else {
      console.log("No user signed in!");
    }
  };

  const handleLikePost = (postId, hasLiked) => {
    if (user) {
      if (hasLiked) {
        unlikePost(firestore, postId, user.uid);
      } else {
        likePost(firestore, postId, user.uid);
      }
    } else {
      console.log("No user signed in!");
    }
  };

  const handleCommentSubmit = (postId, commentText) => {
    if (user) {
      addComment(firestore, postId, user.uid, commentText);
    } else {
      console.log("No user signed in!");
    }
  };

  return (
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={handlePostSubmit}>
        <TextField
          label={
            user
              ? `What's on your mind, ${user.displayName}?`
              : "What's on your mind?"
          }
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Post
        </Button>
      </form>
      <div className="post-container">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLikePost={(postId) =>
              handleLikePost(postId, post.likes?.includes(user.uid))
            }
            onCommentSubmit={handleCommentSubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
