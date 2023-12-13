import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    // Check if the user is already signed in
    const loggedIn = localStorage.getItem("isSignedIn") === "true";
    if (loggedIn) {
      // Handle logic if user is already signed in
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isSignedIn", "true");
      // Handle redirection or UI update after successful sign-in
    } catch (error) {
      console.error("Sign-in error", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem("isSignedIn", "true");
      // Handle redirection or UI update after successful sign-in
    } catch (error) {
      console.error("Sign-in error", error);
      setError(error.message);
    }
  };

  // Render your component UI
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <form onSubmit={handleSignIn}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Sign In
        </Button>
      </form>
      <Button variant="contained" onClick={handleGoogleSignIn}>
        Sign In with Google
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default SignIn;
