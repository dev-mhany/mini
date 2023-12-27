import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AppBar from "./ResponsiveAppBar";
import Home from "./Home";
import SignIn from "./SignIn";
import Register from "./Register";
import Profile from "./Profile";
import Account from "./Account"; // Import the Account component

// Use environment variables from the .env file
const firebaseConfig = {
  apiKey: "AIzaSyA2_mqN9xKmjoPLOHxkZ3-L8wmKwbOigq8",
  authDomain: "mini-social-media-react.firebaseapp.com",
  projectId: "mini-social-media-react",
  storageBucket: "mini-social-media-react.appspot.com",
  messagingSenderId: "39863816024",
  appId: "1:39863816024:web:f3408ea2d9f627739fdf2d",
  measurementId: "G-PT332JDQZ5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar />
        <Routes>
          <Route path="/" element={<Home db={db} />} />
          <Route path="/signin" element={<SignIn db={db} />} />
          <Route path="/register" element={<Register db={db} />} />
          <Route path="/profile" element={<Profile db={db} />} />
          <Route path="/account" element={<Account />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
