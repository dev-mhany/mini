import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import useAuth from "./useAuth";
import Post from "./Post";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { submitPost, likePost, unlikePost, addComment } from "./PostActions";
import di from "./Colorful Illustrative Young Male Avatar.png";

const usePosts = (firestore) => {
  const [posts, setPosts] = useState([]);
  console.log(di);
  useEffect(() => {
    const postsCollectionRef = collection(firestore, "posts");
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedPosts = postsData.map((post) => {
        const commentsRef = collection(firestore, `posts/${post.id}/comments`);
        const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
        onSnapshot(commentsQuery, (commentsSnapshot) => {
          const commentsData = commentsSnapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          }));
          post.comments = commentsData;
          setPosts((prevPosts) => {
            return prevPosts.map((p) => (p.id === post.id ? post : p));
          });
        });
        return post;
      });

      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, [firestore]);

  return posts;
};

const Home = () => {
  const [postContent, setPostContent] = useState("");
  const firestore = getFirestore();
  const user = useAuth();
  const posts = usePosts(firestore);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const username = user.displayName || "Anonymous";
      const userPhotoURL = user.photoURL || di;
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
      // Check if the user object is not null
      const username = user.displayName || "Anonymous"; // Fallback to 'Anonymous' if no displayName
      const userPhotoURL = user.photoURL || di; // Fallback URL if no photoURL

      // Now you can pass them to your addComment function
      addComment(
        firestore,
        postId,
        user.uid,
        commentText,
        username,
        userPhotoURL
      );
    } else {
      // Handle the case where user information is not available yet
      console.error("User data is not loaded yet");
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
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLikePost={handleLikePost}
            onCommentSubmit={handleCommentSubmit}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
