import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAAb87LoI3b4cBmqdwjWoKDaya0SVwx8P8',
    authDomain: 'academe-116.firebaseapp.com',
    projectId: 'academe-116',
    storageBucket: 'academe-116.appspot.com',
    messagingSenderId: '123396535979',
    appId: '1:123396535979:web:1005e809761a310b6f29ee',
};

export const actionCodeSettings = {
    url: 'http://academe-116.web.app/login',
    handleCodeInApp: true,
};

const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);