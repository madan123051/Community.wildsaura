'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, appleProvider } from '@/lib/firebase';
import type { CurrentUser } from '@/types/community';

export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'WildSaura User',
          email: fbUser.email || undefined,
          avatarUrl: fbUser.photoURL || undefined,
          avatarColor: '#4ECDC4',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithFacebook = () => signInWithPopup(auth, facebookProvider);
  const loginWithApple = () => signInWithPopup(auth, appleProvider);
  const logout = () => signOut(auth);

  return { user, firebaseUser, loading, loginWithGoogle, loginWithFacebook, loginWithApple, logout };
}
