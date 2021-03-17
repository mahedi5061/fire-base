import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const FbProvider = new firebase.auth.FacebookAuthProvider();
  const [newUser, setnewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photoURL: '',
    error: '',
    success: false
  })

  const handler = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then((res) => {
        const { displayName, email, photoURL } = res.user;
        const SignedIn = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(SignedIn)
      })

  }
  const fbHandler = () => {
    firebase.auth().signInWithPopup(FbProvider)
      .then((res) => {
       
        const user = res.user;
        console.log(user)
 
      })
      .catch((error) => {
        
        var errorCode = error.code;
        var errorMessage = error.message;
        
        var email = error.email;
         
        var credential = error.credential;

        
      });
  }
  const signOutHandler = () => {
    firebase.auth().signOut()
      .then((res) => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photoURL: ''
        }
        setUser(signOutUser)
      })

  }

  const handleBlur = (e) => {
    let checkValidate = true;
    if (e.target.name === 'email') {
      checkValidate = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const passwordValidation = e.target.value.length > 6;
      const passwordValidationNumber = /\d{1}/.test(e.target.value);
      checkValidate = passwordValidation && passwordValidationNumber
    }
    if (checkValidate) {
      const userInfo = { ...user };
      userInfo[e.target.name] = e.target.value;
      setUser(userInfo)
    }
  }
  const submitHandler = (e) => {

    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userInfo = { ...user };
          userInfo.error = '';
          userInfo.success = true;
          setUser(userInfo);
        })
        .catch((error) => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          setUser(userInfo)

        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userInfo = { ...user };
          userInfo.error = '';
          userInfo.success = true;
          setUser(userInfo);
        })
        .catch((error) => {
          const userInfo = { ...user };
          userInfo.error = error.message;
          setUser(userInfo)

        });
    }
    e.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button className="btn btn-primary" onClick={signOutHandler}>Sign out</button> : <button className="btn btn-primary" onClick={handler}>Sign in</button>
      }
      <br></br><button onClick={fbHandler} className="btn btn-mt-2 btn btn-primary">Log In With Facebook</button>
      {
        user.isSignedIn && <div> <p>Welcome {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>

      }

      <form onSubmit={submitHandler} action="" className="mt-5">
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" required></input>}<br></br>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email" required></input>
        <br></br>
        <input className="mt-2" type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required></input>
        <br></br>
        <input type="checkBox" onChange={() => setnewUser(!newUser)} name="newUser" id=""></input>
        <label htmlFor="newUser">New User Registration</label><br></br>
        <input className="mt-2" type="submit" value={newUser ? 'Sign Up' : 'Sign In'}></input>
      </form>


      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>Succefully {newUser ? 'Created' : 'log in'}.</p>
      }


    </div>
  );
}

export default App;
