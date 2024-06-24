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
  UserData,
} from "../interfaces";

export async function createFirestoreUser(user: User, username: string) {
  const docRef = doc(db, "users", user.uid);
  const defaultCharacterProperties: AvatarProperties = {
    gender: "man",
    backgroundColor: "rgb(164,222,247)",
    mouthColor: "rgb(224,134,114)",
    eyeColor: "rgb(102,78,39)",
    eyelidsColor: "rgb(12,10,9)",
    hairColor: "rgb(89,70,64)",
    skinColor: "rgb(255,225,189)",
    noseColor: "rgb(230,183,150)",
    dimensions: "175px",
    bowColor: "transparent",
  };
  const data = {
    id: user.uid,
    username: username,
    description: "",
    exp: 0,
    followers: [],
    following: [],
    posts: [],
    favorites: [],
    feed: [],
    activity: {},
    notifications: {},
    avatarProps: defaultCharacterProperties,
  } as UserData;
  setDoc(docRef, data)
    .then()
    .catch((error) => {
      console.log(error);
    });
}

export async function getAdminId() {
  const q = query(collection(db, "users"), where("username", "==", "admin"));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  return querySnapshot.docs[0].id;
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
    return docSnap.data() as UserData;
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

export async function getAllUsernames() {
  const collectionRef = collection(db, "users");
  const querySnapshot = await getDocs(collectionRef);
  const usernames = <string[]>[];
  querySnapshot.forEach((doc) => {
    usernames.push(doc.data().username);
  });
  return usernames;
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

export async function changeDimensions(
  avatarProps: AvatarProperties,
  size: string
) {
  avatarProps.dimensions = size;
  return avatarProps;
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

export async function getNextCategories(category: string) {
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
  const followers = await getFollowers(uid);
  followers.forEach(async (follower: string) => {
    const followerRef = doc(db, "users", follower);
    await updateDoc(followerRef, {
      feed: arrayUnion(SetId),
    });
  });
  const adminRef = await getAdminId();
  if (adminRef) {
    await updateDoc(doc(db, "users", adminRef), {
      check: arrayUnion(SetId),
    });
  }
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
    const activity = doc.data().activity;
    if (activity && setId in activity) {
      const updatedActivity = { ...activity };
      delete updatedActivity[setId];

      updateDoc(doc.ref, {
        favorites: arrayRemove(setId),
        activity: updatedActivity,
        feed: arrayRemove(setId),
      });
    } else {
      updateDoc(doc.ref, {
        favorites: arrayRemove(setId),
        feed: arrayRemove(setId),
      });
    }
  });
  const adminRef = await getAdminId();
  if (adminRef) {
    await updateDoc(doc(db, "users", adminRef), {
      check: arrayRemove(setId),
    });
  }
}

export async function deleteFromCheckAdmin(setId: string, adminId: string) {
  const docRef = doc(db, "users", adminId);
  await updateDoc(docRef, {
    check: arrayRemove(setId),
  });
}

export async function updateFlashcardSet(setId: string, data: any) {
  const docRef = doc(db, "flashcardSets", setId);
  await updateDoc(docRef, data);
}

export async function updateActivity(
  uid: string,
  flashcardSetId: string,
  score: number
) {
  const docRef = doc(db, "users", uid);

  const docSnap = await getDoc(docRef);
  const activityData = docSnap.data()?.activity || {};
  activityData[flashcardSetId] = activityData[flashcardSetId] || [];
  if (activityData[flashcardSetId].length == 10) {
    activityData[flashcardSetId].shift();
  }
  activityData[flashcardSetId].push(score);

  await updateDoc(docRef, {
    activity: activityData,
  });

  const exp = docSnap.data()?.exp || 0;
  await updateDoc(docRef, {
    exp: exp + score,
  });

  return activityData;
}

export async function getActivities(uid: string, flashcardSetId: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const activityData = docSnap.data()?.activity || {};
  return activityData[flashcardSetId] || [];
}

export async function updatePlayCount(flashcardSetId: string) {
  const docRef = doc(db, "flashcardSets", flashcardSetId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) {
    return;
  }
  await updateDoc(docRef, {
    playCount: data.playCount + 1,
  });
}

export async function getExp(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.exp || 0;
}

export async function updateProfile(
  uid: string,
  username: string,
  description: string,
  avatarProps: AvatarProperties
) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    username: username,
    description: description,
    avatarProps: avatarProps,
  });
}

export async function getFlashcardSetsIdsByCategory(category: string) {
  const collectionRef = collection(db, "flashcardSets");
  const q = query(collectionRef, where("category", "array-contains", category));
  const querySnapshot = await getDocs(q);
  const flashcardSetsIds = <string[]>[];
  querySnapshot.forEach((doc) => {
    flashcardSetsIds.push(doc.id);
  });
  return flashcardSetsIds;
}

export async function getAllFlashcardSetsIds() {
  const collectionRef = collection(db, "flashcardSets");
  const querySnapshot = await getDocs(collectionRef);
  const flashcardSetsIds = <string[]>[];
  querySnapshot.forEach((doc) => {
    flashcardSetsIds.push(doc.id);
  });
  return flashcardSetsIds;
}

export async function getFlashcardSetsIdsByTitle(
  title: string,
  category: string
) {
  const words = title.toLowerCase().split(" ");
  const collectionRef = collection(db, "flashcardSets");
  let querySnapshot = await getDocs(collectionRef);
  if (category) {
    querySnapshot = await getDocs(
      query(collectionRef, where("category", "array-contains", category))
    );
  }
  let flashcardSetsIds = <string[]>[];
  let TitleIdPairs = <{ [key: string]: string }>{};
  querySnapshot.forEach((doc) => {
    TitleIdPairs[doc.data().title.toLowerCase()] = doc.id;
  });
  for (let key in TitleIdPairs) {
    for (let word of words) {
      if (key.includes(word)) {
        flashcardSetsIds.push(TitleIdPairs[key]);
        break;
      }
    }
  }

  return flashcardSetsIds;
}

export async function FollowUser(uid: string, targetUid: string) {
  const userRef = doc(db, "users", uid);
  const targetUserRef = doc(db, "users", targetUid);
  await updateDoc(userRef, {
    following: arrayUnion(targetUid),
  });
  const targetUserDoc = await getDoc(targetUserRef);
  const targetPosts = targetUserDoc.data()?.posts || [];
  await updateDoc(userRef, {
    feed: arrayUnion(...targetPosts),
  });
  await updateDoc(targetUserRef, {
    followers: arrayUnion(uid),
    notifications: {
      ...((await getDoc(targetUserRef)).data()?.notifications || {}),
      [new Date().toISOString()]: [`${uid}`, "started following you", "unread"],
    },
  });
  return "Followed";
}

export async function addModifyNotification(setTitle: string, userID: string) {
  const userRef = doc(db, "users", userID);
  await updateDoc(userRef, {
    notifications: {
      ...((await getDoc(userRef)).data()?.notifications || {}),
      [new Date().toISOString()]: [
        `${setTitle}`,
        "Your flashcard set has been modified in order to comply with the policy.",
        "unread",
      ],
    },
  });
}

export async function addDeleteNotification(setTitle: string, userID: string) {
  const userRef = doc(db, "users", userID);
  await updateDoc(userRef, {
    notifications: {
      ...((await getDoc(userRef)).data()?.notifications || {}),
      [new Date().toISOString()]: [
        `${setTitle}`,
        "Your flashcard set has been removed due to policy violation.",
        "unread",
      ],
    },
  });
}

export async function UnfollowUser(uid: string, targetUid: string) {
  const userRef = doc(db, "users", uid);
  const targetUserRef = doc(db, "users", targetUid);
  await updateDoc(userRef, {
    following: arrayRemove(targetUid),
  });
  await updateDoc(targetUserRef, {
    followers: arrayRemove(uid),
  });
  const targetUserDoc = await getDoc(targetUserRef);
  const targetPosts = targetUserDoc.data()?.posts || [];
  await updateDoc(userRef, {
    feed: arrayRemove(...targetPosts),
  });
  const notifications = targetUserDoc.data()?.notifications || {};
  for (let key in notifications) {
    if (
      notifications[key].includes(`${uid}`) &&
      notifications[key].includes("started following you")
    ) {
      delete notifications[key];
      await updateDoc(targetUserRef, {
        notifications: notifications,
      });
      break;
    }
  }
  return "Unfollowed";
}

export async function getFollowers(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.followers || [];
}

export async function getFollowing(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.following || [];
}

export async function getNotifications(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.notifications || {};
}

export async function markNotificationAsRead(uid: string, timestamp: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const notifications = docSnap.data()?.notifications || {};
  notifications[timestamp][2] = "read";
  await updateDoc(docRef, {
    notifications: notifications,
  });
}

export async function markAllNotificationsAsRead(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const notifications = docSnap.data()?.notifications || {};
  for (let key in notifications) {
    notifications[key][2] = "read";
  }
  await updateDoc(docRef, {
    notifications: notifications,
  });
}

export async function getAllUsers() {
  const collectionRef = collection(db, "users");
  const querySnapshot = await getDocs(collectionRef);
  const users = <UserData[]>[];
  querySnapshot.forEach((doc) => {
    if (doc.data().username !== "admin") users.push(doc.data() as UserData);
  });
  return users;
}

export async function getFeedPostsIds(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const feed = docSnap.data()?.feed || [];
  return feed;
}

export async function getCheckPostsIds(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const check = docSnap.data()?.check || [];
  return check;
}

export async function getMostPlayedSetId() {
  const collectionRef = collection(db, "flashcardSets");
  const querySnapshot = await getDocs(collectionRef);
  let maxPlayCount = 0;
  let mostPlayedSetId = "";
  querySnapshot.forEach((doc) => {
    if (doc.data().playCount > maxPlayCount) {
      maxPlayCount = doc.data().playCount;
      mostPlayedSetId = doc.id;
    }
  });
  return mostPlayedSetId;
}

export async function getUserRanking() {
  const collectionRef = collection(db, "users");
  const querySnapshot = await getDocs(collectionRef);
  let users = <UserData[]>[];
  querySnapshot.forEach((doc) => {
    if (doc.data().username !== "admin" && doc.data().exp > 0)
      users.push(doc.data() as UserData);
  });
  users.sort((a, b) => b.exp - a.exp);
  return users as UserData[];
}

export async function doesUserHaveExp(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  return docSnap.data().exp > 0;
}

export async function isAllowed(uid: string, setId: string) {
  // set is created by the user
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.data()?.username === "admin") {
    return true;
  }
  const userPosts = userDoc.data()?.posts || [];
  if (userPosts.includes(setId)) {
    return true;
  } else {
    return false;
  }
}

export async function addForeignLanguages() {
  const collectionRef = collection(db, "categories");
  const docRef = doc(collectionRef, "Foreign Languages");
  const data = {
    Italian: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Spanish: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    French: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    German: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Japanese: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Korean: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Chinese: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Russian: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
    Romanian: [
      "Verbs",
      "Nouns",
      "Pronouns",
      "Adjectives",
      "Adverbs",
      "Tenses",
      "Articles",
      "Prepositions",
      "Vocabulary",
      "Other",
    ],
  };
  await setDoc(docRef, data);
}
