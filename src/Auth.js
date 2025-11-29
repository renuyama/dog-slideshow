// src/Auth.js
import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Auth({ className }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will update state
    } catch (err) {
      console.error("Google sign-in failed:", err);
      alert("Sign-in failed — see console for details.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  if (user) {
    return (
      <div className={className} style={{display:"flex", alignItems:"center", gap:10}}>
        {user.photoURL && (
          <img src={user.photoURL} alt="avatar" style={{width:36, height:36, borderRadius:18}} />
        )}
        <div style={{fontSize:14}}>
          <div style={{fontWeight:600}}>{user.displayName}</div>
          <div style={{fontSize:12, color:"#666"}}>{user.email}</div>
        </div>
        <button onClick={handleSignOut} style={{marginLeft:8}}>Sign out</button>
      </div>
    );
  }

  return <button onClick={handleSignIn}>Sign in with Google</button>;
}
