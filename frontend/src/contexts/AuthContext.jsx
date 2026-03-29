/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Safety timeout to prevent white screen if Firebase hangs
    const timeout = setTimeout(() => setLoading(false), 2000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  const saveUserToFirestore = async (user, additionalData = {}) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      try {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || additionalData.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          ...additionalData
        });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      await saveUserToFirestore(result.user);
    } catch (e) {
      console.error("Non-blocking Firestore save error:", e);
    }
    return result;
  };

  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await saveUserToFirestore(result.user, { displayName });
    } catch (e) {
      console.error("Non-blocking Firestore save error:", e);
    }
    return result;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loginWithGoogle,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
