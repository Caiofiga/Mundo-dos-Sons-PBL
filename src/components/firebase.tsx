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
import firebaseConfig from "./firebaseconfig";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function addUserToDB(user:string[]) {
  try {
    await addDoc(collection(db, "users"), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addAnswersToDB(database: string, answers: string[] | number[] | any) {
  try {
    await addDoc(collection(db, database), answers);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getDocsByUserId(collectionName: string, userId: string) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const docs:any[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    docs.push(doc.data());
  });

  return docs;
}
export async function getUser(){
  
}

// Add other Firestore functions as needed
