// import React, { useState, useEffect } from "react";
// import {
//   getFirestore,
//   query,
//   where,
//   collection,
//   onSnapshot,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
// import { useHistory } from "react-router-dom";
// import Post from "./Post"; // Your Post component

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [displayName, setDisplayName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const history = useHistory(); // If you're using react-router

//   const firestore = getFirestore();
//   const auth = getAuth();

//   useEffect(() => {
//     // This correctly imports and uses onAuthStateChanged
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (!firebaseUser) {
//         // User is not signed in. Redirect to login page.
//         history.push("/login"); // Using react-router for redirection
//       } else {
//         setUser(firebaseUser);
//         setDisplayName(firebaseUser.displayName || "");
//         setLoading(false); // Set loading to false here
//       }
//     });

//     return () => unsubscribe(); // Unsubscribe when the component is unmounted
//   }, [auth, history]);

//   useEffect(() => {
//     if (user) {
//       // Query for the current user's posts
//       const postsQuery = query(
//         collection(firestore, "posts"),
//         where("userId", "==", user.uid)
//       );
//       const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
//         const posts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUserPosts(posts);
//       });

//       return () => unsubscribePosts();
//     }
//   }, [user, firestore]);

//   const handleUpdateProfile = () => {
//     if (user) {
//       updateProfile(user, {
//         displayName: displayName,
//         // You can also update photoURL here if needed
//       })
//         .then(() => {
//           // Profile updated successfully
//           // You might want to do something here like show a success message
//         })
//         .catch((error) => {
//           // An error occurred
//           console.error(error);
//         });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <div>
//         <input
//           type="text"
//           value={displayName}
//           onChange={(e) => setDisplayName(e.target.value)}
//         />
//         <button onClick={handleUpdateProfile}>Update Profile</button>
//       </div>
//       <div>
//         <h2>My Posts</h2>
//         {userPosts.map((post) => (
//           <Post key={post.id} post={post} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;
