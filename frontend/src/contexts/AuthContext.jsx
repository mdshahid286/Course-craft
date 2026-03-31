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
    console.log('AuthContext Debug - Setting up auth state listener');
    
    // Check if we're in development mode with mock Firebase config
    const isMockConfig = import.meta.env.VITE_FIREBASE_API_KEY?.includes('mock');
    
    if (isMockConfig) {
      console.log('AuthContext Debug - Using mock authentication for development');
      // For development with mock config, create a mock user
      const mockUser = {
        uid: 'dev-user-123',
        email: 'dev@example.com',
        displayName: 'Developer',
        photoURL: null,
        emailVerified: true
      };
      setCurrentUser(mockUser);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, user => {
      console.log('AuthContext Debug - Auth state changed:', user);
      setCurrentUser(user);
      setLoading(false);
    });

    // Safety timeout to prevent white screen if Firebase hangs
    const timeout = setTimeout(() => {
      console.log('AuthContext Debug - Safety timeout triggered');
      setLoading(false);
    }, 2000);

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
    const isMockConfig = import.meta.env.VITE_FIREBASE_API_KEY?.includes('mock');
    
    if (isMockConfig) {
      console.log('AuthContext Debug - Mock Google sign-in for development');
      const mockUser = {
        uid: 'dev-user-123',
        email: 'dev@example.com',
        displayName: 'Developer',
        photoURL: null,
        emailVerified: true
      };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }

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
    const isMockConfig = import.meta.env.VITE_FIREBASE_API_KEY?.includes('mock');
    
    if (isMockConfig) {
      console.log('AuthContext Debug - Mock signup for development');
      const mockUser = {
        uid: 'dev-user-123',
        email: email,
        displayName: displayName,
        photoURL: null,
        emailVerified: true
      };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await saveUserToFirestore(result.user, { displayName });
    } catch (e) {
      console.error("Non-blocking Firestore save error:", e);
    }
    return result;
  };

  const login = (email, password) => {
    const isMockConfig = import.meta.env.VITE_FIREBASE_API_KEY?.includes('mock');
    
    if (isMockConfig) {
      console.log('AuthContext Debug - Mock email/password login for development');
      const mockUser = {
        uid: 'dev-user-123',
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        emailVerified: true
      };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    const isMockConfig = import.meta.env.VITE_FIREBASE_API_KEY?.includes('mock');
    
    if (isMockConfig) {
      console.log('AuthContext Debug - Mock logout for development');
      setCurrentUser(null);
      return Promise.resolve();
    }

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
