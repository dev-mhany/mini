import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { getFirestore } from "firebase/firestore";
// import Register from "./Register";
import { initializeApp } from "firebase/app";
// import SignIn from "./SignIn";
import Home from "./Home";

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
    <div className="App">
      <header className="App-header"></header>
      <Home db={db} />
    </div>
  );
}

export default App;
