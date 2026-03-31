import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBdj9PlMGJf3bao66mGdBDvX66UzdqR2bk',
  authDomain: 'projecthub-a6659.firebaseapp.com',
  projectId: 'projecthub-a6659',
  storageBucket: 'projecthub-a6659.firebasestorage.app',
  messagingSenderId: '119058414301',
  appId: '1:119058414301:web:b351dc5dfa0285f230b934',
  measurementId: 'G-6QZBBDY0FM',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const analyticsPromise =
  typeof window !== 'undefined'
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)
    : Promise.resolve(null);

export { app, auth, db, analyticsPromise };
