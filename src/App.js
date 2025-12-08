import React, { useEffect, useState } from "react";
import AzureFiles from "./AzureFiles";
import "./App.css";

import { auth, googleProvider, db } from "./firebaseConfig";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

let timer;
let deleteFirstPhotoDelay;

function App() {
  const [breeds, setBreeds] = useState({});
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Debug slideshow images
  useEffect(() => {
    console.log("IMAGES STATE:", images);
  }, [images]);

  // Load breeds once
  useEffect(() => {
    async function loadBreeds() {
      const res = await fetch("https://dog.ceo/api/breeds/list/all");
      const data = await res.json();
      setBreeds(data.message);
    }
    loadBreeds();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(timer);
      clearTimeout(deleteFirstPhotoDelay);
    };
  }, []);

  // Listen for auth changes AND save user info to Firestore on login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        // Save / update this user in Firestore "users" collection
        try {
          await setDoc(
            doc(db, "users", u.uid),
            {
              uid: u.uid,
              name: u.displayName,
              email: u.email,
              photoURL: u.photoURL,
              lastLogin: serverTimestamp(),
            },
            { merge: true }
          );

          // After saving, reload the list of all users
          await loadAllUsers();
        } catch (err) {
          console.error("Error saving user to Firestore:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load all users who have logged in (from Firestore)
  const loadAllUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("lastLogin", "desc")
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAllUsers(list);
    } catch (err) {
      console.error("Error loading users from Firestore:", err);
    }
  };

  // Load images for selected breed
  async function loadByBreed(breed) {
    if (breed === "Choose a dog breed") return;

    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
    const data = await res.json();

    createSlideshow(data.message);
  }

  // Slideshow logic
  function createSlideshow(imgArray) {
    let index = 0;

    clearInterval(timer);
    clearTimeout(deleteFirstPhotoDelay);

    const initial = [];
    if (imgArray.length > 0) initial.push(imgArray[0]);
    if (imgArray.length > 1) initial.push(imgArray[1]);
    setImages(initial);

    index = initial.length;

    timer = setInterval(() => {
      if (!imgArray || imgArray.length === 0) return;
      if (index >= imgArray.length) index = 0;

      setImages((prev) => [...prev, imgArray[index]]);

      deleteFirstPhotoDelay = setTimeout(() => {
        setImages((prev) => prev.slice(1));
      }, 1000);

      index++;
      if (index >= imgArray.length) index = 0;
    }, 3000);
  }

  // Auth handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle Firestore saving + UI updates
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Sign-in failed. See console for details.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        {/* LEFT: title + breed selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <h1 style={{ margin: 0 }}>Infinite Dog App (React)</h1>
          <select onChange={(e) => loadByBreed(e.target.value)}>
            <option>Choose a dog breed</option>
            {Object.keys(breeds).map((breed) => (
              <option key={breed}>{breed}</option>
            ))}
          </select>
        </div>

        {/* RIGHT: auth UI */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%" }}
                />
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>
                  {user.displayName || user.email}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {user.email}
                </div>
              </div>
              <button onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          )}
        </div>
      </div>

      {/* SLIDESHOW */}
      <div className="slideshow">
        {images.map((url, i) =>
          url ? (
            <div
              key={i}
              className="slide"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          ) : null
        )}
      </div>

      {/* USERS PANEL (everyone who logged in) */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          marginTop: "20px",
        }}
      >
        <AzureFiles />
        <h2>Users who have logged in</h2>
        {allUsers.length === 0 && <p>No users stored yet.</p>}

        {allUsers.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            {u.photoURL && (
              <img
                src={u.photoURL}
                alt=""
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{u.name || u.email}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{u.email}</div>
              {u.lastLogin && u.lastLogin.toDate && (
                <div style={{ fontSize: 11, color: "#777" }}>
                  Last login: {u.lastLogin.toDate().toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
}

export default App;
