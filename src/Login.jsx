import React from 'react';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user); // Store user info in state
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    alert('Logout successful!');
  };

  return (
    <div className="login-container">
      {auth.currentUser ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Login;
