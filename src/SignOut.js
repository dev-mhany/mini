import React from "react";
import { getAuth, signOut } from "firebase/auth";
import Button from "@mui/material/Button";

const SignOut = () => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage or any other state management you are using
      localStorage.removeItem("isLoggedIn");

      // Redirect to sign-in page or update state to reflect that user is no longer signed in
      // For example: this.props.history.push('/signin') in case of React Router
      // Or update the state in your context or global state if you're using Redux or Context API
      console.log("User signed out successfully");
    } catch (error) {
      // Handle any errors that occur during sign-out
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;
