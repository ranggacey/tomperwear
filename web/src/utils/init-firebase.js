// Firebase init yang tahan banting: kalau keys belum diisi (env kosong),
// auth = null dan app tetap jalan (login user nonaktif sampai keys diisi).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

let auth = null;
try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn('Firebase keys belum diisi — login user nonaktif.');
  }
} catch (e) {
  console.warn('Firebase init gagal — login user nonaktif.', e.message);
}

export { auth };
export const isAuthEnabled = !!auth;
