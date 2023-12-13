import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "./Home.css";
import di from "./Colorful Illustrative Young Male Avatar.png";
const Post = ({ post, onLikePost, onCommentSubmit, currentUser }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false); // To toggle comments visibility
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const firestore = getFirestore(); // This initializes the Firestore service

  // Assuming 'currentUser' is the object containing the current user's details.
  const currentUserId = currentUser?.uid; // Replace with actual user ID property

  const handleLike = () => {
    // Check if the current user has liked the post
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
    setShowComments(!showComments); // Toggle the visibility of comments
  };
  const handleSaveEdit = () => {
    // Update the Firestore document for the post
    const postRef = doc(firestore, "posts", post.id);
    updateDoc(postRef, {
      content: editedContent,
    })
      .then(() => {
        setEditMode(false);
        // Handle successful update
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };
  return (
    <div className="post">
      {editMode ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </>
      ) : (
        <>
          <p>{post.content}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
      <div className="post-header">
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
      <p className="post-content">{post.content}</p>
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
          {/* Map over and render comments */}
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
