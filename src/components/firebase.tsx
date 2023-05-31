// firebaseService.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxmVORAk4TDkQ02b33UL4h2ilsbyYcEw4",
  authDomain: "pbl-app-b3962.firebaseapp.com",
  projectId: "pbl-app-b3962",
  storageBucket: "pbl-app-b3962.appspot.com",
  messagingSenderId: "1070603645378",
  appId: "1:1070603645378:web:24a7cdc14cf31036f7265b",
  measurementId: "G-0CBT4CJ3DR",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function addUserToDB(user) {
  try {
    await addDoc(collection(db, "users"), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addAnswersToDB(database, answers) {
  try {
    await addDoc(collection(db, database), answers);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getDocsByUserId(collectionName, userId) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  let docs = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    docs.push(doc.data());
  });

  return docs;
}
// Add other Firestore functions as needed
