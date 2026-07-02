import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const requiredFirebaseEnv = [
  'VITE_FIREBASE_APIKEY',
  'VITE_FIREBASE_AUTHDOMAIN',
  'VITE_FIREBASE_PROJECTID',
  'VITE_FIREBASE_STORAGEBUCKET',
  'VITE_FIREBASE_MESSAGINGSENDERID',
  'VITE_FIREBASE_APPID',
];

const missingFirebaseEnv = requiredFirebaseEnv.filter(
  (key) => !import.meta.env[key]
);

if (missingFirebaseEnv.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingFirebaseEnv.join(', ')}`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
