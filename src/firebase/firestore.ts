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
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import {
  User,
  ErrorMessasge,
  AvatarProperties,
  FlashcardSet,
} from "../interfaces";


export async function createUserCollection(user: User, username: string) {
  const docRef = doc(db, "users", user.uid);
  const data = {
    id: user.uid,
    username: username,
    desription: "",
    level: 1,
    following: [],
    posts: [],
    favorites: [],
    activity: {},
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

export async function getCategories() {
  const q = query(collection(db, "categories"));
  const querySnapshot = await getDocs(q);
  const categories = <string[]>[];
  querySnapshot.forEach((doc) => {
    categories.push(doc.id);
  });
  return categories;
}

export async function getSecondCategories(category: string) {
  const docRef = doc(db, "categories", category);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data as string[][];
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

export async function createFlashcardSet(
  flashcardSet: FlashcardSet,
  uid: string
) {
  const docRef = await addDoc(collection(db, "flashcardSets"), flashcardSet);
  const SetId = docRef.id;
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    posts: arrayUnion(SetId),
  });
  return SetId;
}

export async function getFlashcardSet(setId: string) {
  const docRef = doc(db, "flashcardSets", setId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as FlashcardSet;
  } else {
    console.log("No such document!");
  }
}


export async function getFlashcardSetsOfUser(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().posts;
  } else {
    console.log("No such document!");
  }
}

export async function addToFavorites(uid: string, setId: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    favorites: arrayUnion(setId),
  });
}

export async function removeFromFavorites(uid: string, setId: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    favorites: arrayRemove(setId),
  });
}

export async function getFavorites(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().favorites as string[];
  } else {
    console.log("No such document!");
  }
}

export async function deleteFlashcardSet(setId: string, uid: string) {
  const docRef = doc(db, "flashcardSets", setId);
  await deleteDoc(docRef);
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    posts: arrayRemove(setId),
  });
  const usersRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersRef);
  usersSnapshot.forEach((doc) => {
    updateDoc(doc.ref, {
      favorites: arrayRemove(setId),
    });
  });
}

export async function updateFlashcardSet(setId: string, data: any) {
  const docRef = doc(db, "flashcardSets", setId);
  await updateDoc(docRef, data);
}

export async function updateActivity(uid: string, flashcardSetId: string, score: number) {
  const docRef = doc(db, "users", uid);

  const docSnap = await getDoc(docRef);
  const activityData = docSnap.data()?.activity || {};
  activityData[flashcardSetId] = activityData[flashcardSetId] || [];
  activityData[flashcardSetId].push(score);

  await updateDoc(docRef, {
    activity: activityData,
  });

  return activityData;
}
