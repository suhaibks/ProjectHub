import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export const signup = async (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = async (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = async () => signOut(auth);
