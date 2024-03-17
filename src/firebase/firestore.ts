import "firebase/compat/firestore";
import { db } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  deleteDoc,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { User } from "../interfaces";
import { ErrorMessasge, AvatarProperties } from "../interfaces/interfaces";

export async function createUserCollection(user: User, username: string) {
  const docRef = doc(db, "users", user.uid);
  const data = {
    id: user.uid,
    username: username,
    photoURL: "",
    desription: "",
    level: 1,
    following: [],
    followers: [],
    followNotif: [],
    posts: [],
    favorites: [],
    feed: [],
  };
  setDoc(docRef, data)
    .then()
    .catch((error) => {
      console.log(error);
    });
}

export async function checkUsername(username: string) {
  const q = query(collection(db, "users"), where("username", "==", username));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return true;
  }
  return false;
}

export const formatErrorMessage = (err: ErrorMessasge): ErrorMessasge => {
  if (!err) {
    return null;
  }
  if (err === "Firebase: Error (auth/invalid-email).") {
    return "Email is invalid. Please enter a correct email.";
  }

  if (err === "Firebase: Error (auth/email-already-in-use).") {
    return "Email is already in use. Please try another email.";
  }

  if (err === "Firebase: Error (auth/user-not-found).") {
    return "There is no user using this email.\n Please create or new account or try another email.";
  }
  if (err === "Firebase: Error (auth/wrong-password).") {
    return "Wrong password.";
  }
  if (err.includes("(auth/too-many-requests).")) {
    return "Access to this account has been temporarily disabled due to many failed login attempts.";
  }
  if (err == "Firebase: Error (auth/invalid-credential).") {
    return "The username or password you entered is incorrect. Please double-check and try again.";
  }
  return err;
};

export async function getUserData(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

export async function getUsername(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().username;
  } else {
    console.log("No such document!");
  }
}

export async function addAvatarProps(
  uid: string,
  avatarProps: AvatarProperties
) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    avatarProps: avatarProps,
  });
}

export async function getAvatarProps(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().avatarProps as AvatarProperties;
  } else {
    console.log("No such document!");
  }
}
