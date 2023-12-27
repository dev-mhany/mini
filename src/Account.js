import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Pica from "pica";
import InputFileUpload from "./InputFileUpload"; // Import your custom component

const Account = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setProfilePic(currentUser.photoURL || "");
    }
  }, [currentUser]);

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const pica = Pica();

          canvas.width = 96;
          canvas.height = 96;
          pica
            .resize(img, canvas)
            .then((result) => pica.toBlob(result, "image/jpeg", 0.9))
            .then((blob) => resolve(blob))
            .catch((error) => reject(error));
        };
        img.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleProfilePicChange = async (event) => {
    if (event.target.files[0]) {
      setLoading(true);
      try {
        const resizedImageBlob = await resizeImage(event.target.files[0]);
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(storageRef, resizedImageBlob);
        const url = await getDownloadURL(storageRef);
        setProfilePic(url);
      } catch (error) {
        console.error("Error resizing or uploading file:", error);
      }
      setLoading(false);
    }
  };

  const updateAccount = () => {
    const auth = getAuth();
    const updatedUser = auth.currentUser; // Fetch the current user at this point

    updateProfile(updatedUser, {
      displayName: displayName,
      photoURL: profilePic,
    })
      .then(() => {
        console.log("Profile updated successfully");
        setCurrentUser({ ...updatedUser, displayName, photoURL: profilePic });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div>
      <h1>Account</h1>
      <TextField
        label="Username"
        value={displayName}
        onChange={handleNameChange}
      />
      <InputFileUpload onChange={handleProfilePicChange} loading={loading} />
      {profilePic && <img src={profilePic} alt="Profile" />}
      <Button onClick={updateAccount}>Update Account</Button>
    </div>
  );
};

export default Account;
