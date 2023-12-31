import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(dayjs("2022-02-22"));
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleSuccessfulAuthentication = (user) => {
    console.log("Authentication successful", user);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/"); // Redirect to the homepage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with", {
      firstName,
      surname,
      email,
      password,
      dateOfBirth,
      gender,
    });
    setError("");

    if (!firstName || !surname || !email || !password || !dateOfBirth) {
      console.log("Validation failed. Missing fields.");
      setError("Please fill in all fields.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${surname}`,
      });

      const firestoreDateOfBirth = Timestamp.fromDate(
        dayjs(dateOfBirth).toDate()
      );

      // Correctly use the Firestore instance to save the user data
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        surname,
        email,
        dateOfBirth: firestoreDateOfBirth,
        gender,
      });

      handleSuccessfulAuthentication(user);
    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message);
    }
  };
  const handleGoogleSignUp = async () => {
    console.log("Google sign up initiated");
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign up successful", result);
      const user = result.user;

      handleSuccessfulAuthentication(user);
    } catch (error) {
      console.error("Error during Google sign up:", error);
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        required
        id="outlined-required1"
        label="First Name"
        type="text"
        placeholder="Muhammad"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        required
        id="outlined-required2"
        label="Last Name"
        type="text"
        placeholder="Hany"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
      <TextField
        required
        id="outlined-required3"
        label="E-Mail"
        type="text"
        placeholder="Dev.mhany@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        type={showPassword ? "text" : "password"}
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date of birth"
          value={dateOfBirth}
          onChange={(newValue) => {
            setDateOfBirth(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <RadioGroup
        row
        aria-labelledby="gender-group-label"
        name="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <h4>Please select Gender</h4>
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
      </RadioGroup>
      <Button variant="contained" type="submit">
        Sign Up
      </Button>
      <Button variant="contained" onClick={handleGoogleSignUp}>
        Sign Up with Google
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default Register;
