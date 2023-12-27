import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import "./Home.css";
import di from "./Colorful Illustrative Young Male Avatar.png";
import CustomizedMenus from "./CustomizedMenus";

const Post = ({ post, onLikePost, onCommentSubmit, currentUser }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const firestore = getFirestore();
  const editableContentRef = React.useRef();

  const currentUserId = currentUser?.uid;
  const handleEditPost = () => {
    setEditMode(true);
  };
  const handleLike = () => {
    const hasLiked = post.likes?.includes(currentUserId);
    onLikePost(post.id, hasLiked);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onCommentSubmit(post.id, commentText);
      setCommentText("");
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const handleSaveEdit = () => {
    // Check if the current user is the creator of the post
    if (currentUser?.uid === post.userId) {
      const updatedContent = editableContentRef.current.innerText;

      const postRef = doc(firestore, "posts", post.id);
      updateDoc(postRef, {
        content: updatedContent,
      })
        .then(() => {
          setEditMode(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("You are not authorized to edit this post.");
    }
  };

  const handleDeletePost = async () => {
    try {
      // Check if the current user is the creator of the post
      if (currentUser?.uid === post.userId) {
        const firestore = getFirestore();
        const postRef = doc(firestore, "posts", post.id);

        // Delete comments subcollection
        const commentsCollectionRef = collection(postRef, "comments");
        const commentsSnapshot = await getDocs(commentsCollectionRef);
        const commentsDeletions = commentsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(commentsDeletions);

        // Now delete the post
        await deleteDoc(postRef);
        console.log("Post and comments successfully deleted");
      } else {
        console.error("You are not authorized to delete this post.");
      }
    } catch (error) {
      console.error("Error removing document and comments: ", error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="menu-container">
          <CustomizedMenus
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </div>
        <img
          src={post.userPhotoURL}
          alt={post.username}
          className="post-avatar"
        />
        <div className="post-info">
          <h5 className="post-username">{post.username || "Anonymous"}</h5>
          <span className="post-timestamp">
            {post.createdAt &&
              new Date(post.createdAt.seconds * 1000).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="post-content-wrapper">
        <div
          className="post-content"
          ref={editableContentRef}
          contentEditable={editMode}
          suppressContentEditableWarning={true}
        >
          {post.content}
        </div>
        {editMode && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            className="save-button"
          >
            Save
          </Button>
        )}
      </div>{" "}
      <div className="post-actions">
        <button
          className={`like-button ${
            post.likes?.includes(currentUserId) ? "liked" : ""
          }`}
          onClick={handleLike}
        >
          Like
        </button>
        <TextField
          label="Write a comment..."
          variant="outlined"
          fullWidth
          multiline
          value={commentText}
          onChange={handleCommentChange}
        />
        <Button className="comment-submit-button" onClick={handleComment}>
          Comment
        </Button>
      </div>
      <div className="post-stats">
        <span className="like-count">{(post.likes || []).length} Likes</span>
        <span className="comment-count" onClick={toggleComments}>
          {post.commentCount || 0} Comments
        </span>
      </div>
      {showComments && (
        <div className="comments-container">
          {post.comments &&
            post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <img
                  src={comment.userPhotoURL || di}
                  alt={comment.username}
                  className="comment-avatar"
                />
                <div className="comment-body">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-text">{comment.text}</span>
                  <span className="comment-timestamp">
                    {comment.createdAt &&
                      new Date(
                        comment.createdAt.seconds * 1000
                      ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Post;
