import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";

const usePosts = (firestore) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(firestore, "posts");
    const q = query(postsCollectionRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, [firestore]);

  return posts;
};

export default usePosts;
