import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import useAuth from "./useAuth";
import Post from "./Post";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { submitPost, likePost, unlikePost, addComment } from "./PostActions";
import di from "./Colorful Illustrative Young Male Avatar.png";

const usePosts = (firestore) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(firestore, "posts");
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = {
            id: doc.id,
            ...doc.data(),
          };

          const commentsRef = collection(
            firestore,
            `posts/${postData.id}/comments`
          );
          const commentsQuery = query(
            commentsRef,
            orderBy("createdAt", "desc")
          );

          const commentsSnapshot = await getDocs(commentsQuery);
          postData.comments = commentsSnapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          }));

          return postData;
        })
      );

      setPosts(postsData);
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
      const userPhotoURL = user.photoURL || di; // This will now be the updated URL from Firebase Storage
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
      alert("Please sign in to create a post");
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
      const userPhotoURL = user.photoURL || di; // Use the latest profile picture URL from Firebase Authentication

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
