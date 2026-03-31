import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const normalizeValue = (value) => {
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeValue(nestedValue)]),
    );
  }

  return value;
};

const withWriteMeta = (userId, data, { includeCreatedAt }) => {
  const normalizedData = normalizeValue(data);

  return {
    ...normalizedData,
    userId,
    updatedAt: serverTimestamp(),
    ...(includeCreatedAt ? { createdAt: serverTimestamp() } : {}),
  };
};

export const createUserScopedDoc = async (collectionName, userId, data = {}) => {
  const payload = withWriteMeta(userId, data, { includeCreatedAt: true });
  const docRef = await addDoc(collection(db, collectionName), payload);
  return docRef.id;
};

export const listUserScopedDocs = async (collectionName, userId) => {
  const q = query(collection(db, collectionName), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getUserScopedDoc = async (collectionName, userId, docId) => {
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  if (data.userId !== userId) {
    return null;
  }

  return { id: snapshot.id, ...data };
};

export const updateUserScopedDoc = async (collectionName, userId, docId, data = {}) => {
  const existingDoc = await getUserScopedDoc(collectionName, userId, docId);

  if (!existingDoc) {
    throw new Error('Document not found or not authorized.');
  }

  const payload = withWriteMeta(userId, data, { includeCreatedAt: false });
  await updateDoc(doc(db, collectionName, docId), payload);
};

export const deleteUserScopedDoc = async (collectionName, userId, docId) => {
  const existingDoc = await getUserScopedDoc(collectionName, userId, docId);

  if (!existingDoc) {
    throw new Error('Document not found or not authorized.');
  }

  await deleteDoc(doc(db, collectionName, docId));
};
