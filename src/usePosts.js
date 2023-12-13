// usePosts.js
import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

const usePosts = (firestore) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(firestore, "posts");
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      postsData.forEach((post, index) => {
        const commentsRef = collection(firestore, `posts/${post.id}/comments`);
        const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
        onSnapshot(commentsQuery, (commentsSnapshot) => {
          const commentsData = commentsSnapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          }));
          const updatedPost = { ...post, comments: commentsData };
          setPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === post.id ? updatedPost : p))
          );
        });
      });
    });

    return () => unsubscribe();
  }, [firestore]);

  return posts;
};

export default usePosts;
