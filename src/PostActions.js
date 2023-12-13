import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot, // Import onSnapshot to listen to changes in the subcollection
} from "firebase/firestore";

// Function to submit a new post to Firestore
export async function submitPost(
  firestore,
  userId,
  content,
  username,
  userPhotoURL
) {
  try {
    await addDoc(collection(firestore, "posts"), {
      userId: userId,
      content: content,
      createdAt: serverTimestamp(),
      likes: [], // Initialize with an empty array
      username: username,
      userPhotoURL: userPhotoURL,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

// Function to handle the like action for a post
export async function likePost(firestore, postId, userId) {
  const postRef = doc(firestore, "posts", postId);

  try {
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error updating likes: ", error);
  }
}

// Function to unlike a post
export async function unlikePost(firestore, postId, userId) {
  const postRef = doc(firestore, "posts", postId);

  try {
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error updating likes: ", error);
  }
}

// Function to add a comment to a post and update the comment count using a snapshot
export function addComment(firestore, postId, userId, text) {
  const postRef = doc(firestore, "posts", postId);
  const commentsCollection = collection(postRef, "comments");

  try {
    // Add the comment to the comments subcollection
    addDoc(commentsCollection, {
      userId: userId,
      text: text,
      createdAt: serverTimestamp(),
    }).then(() => {
      // Listen to changes in the comments subcollection and update the comment count
      onSnapshot(commentsCollection, (snapshot) => {
        const commentCount = snapshot.size;
        updateDoc(postRef, {
          commentCount: commentCount,
        }).catch((error) => {
          console.error("Error updating comment count: ", error);
        });
      });
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
}
