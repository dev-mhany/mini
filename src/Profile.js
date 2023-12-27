import React, { useState, useEffect } from "react";
import {
  getFirestore,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Post from "./Post"; // Your Post component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Adjusted for react-router v6

  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login"); // Redirect to login page
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (user) {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("userId", "==", user.uid)
      );
      const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);
      });

      return () => unsubscribePosts();
    }
  }, [user, firestore]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <h2>{user?.displayName || "Anonymous"}</h2>
      </div>
      <div>
        <h2>My Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
