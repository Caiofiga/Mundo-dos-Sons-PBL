// firebaseService.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseconfig";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function addUserToDB(user: string[]) {
  try {
    await addDoc(collection(db, "users"), user);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addAnswersToDB(
  database: string,
  answers: string[] | number[] | any
) {
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

  const docs: any[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    docs.push(doc.data());
  });

  return docs;
}
export async function getUser(nome: string, sobrenome: string) {
  const userCollection = collection(db, "users");
  const q = query(
    userCollection,
    where("nome", "==", nome),
    where("sobrenome", "==", sobrenome)
  );
  console.log("q = ", q);

  const querySnapshot = await getDocs(q);
  console.log("query = ", querySnapshot);

  // Extract data from the snapshot
  const users = querySnapshot.docs.map((doc) => doc.data());
  console.log("users =", users);

  return users;
}
export async function getAllUsers() {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => doc.data());
  return users;
}

export async function DeleteData(nome: string, sobrenome: string) {
  const userCollection = collection(db, "users");
  const q = query(
    userCollection,
    where("nome", "==", nome),
    where("sobrenome", "==", sobrenome)
  );

  const querySnapshot = await getDocs(q);

  // If there's a user with the provided nome and sobrenome
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0]; // Get the first matching document
    const userRef = doc(db, "users", userDoc.id); // Get a reference to the document.
    await updateDoc(userRef, {
      nome: "NewName",
      sobrenome: "NewSurname",
      age: 25,
    });
  } else {
    console.log("No user found with the provided nome and sobrenome");
  }
}

export async function GetUserId(
  nome: string,
  sobrenome: string,
  idade: string
) {
  const userCollection = collection(db, "users");
  const q = query(
    userCollection,
    where("nome", "==", nome),
    where("sobrenome", "==", sobrenome),
    where("idade", "==", idade)
  );
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => ({ id: doc.id }));
  console.log(users);
  return users.length > 0 ? users[0].id : null;
}

export async function DelDocByID(documentId: string) {
  const docRef = doc(db, "users", documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { nome: "Pessoa", sobrenome: "Anonima", age: 25 });
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}
export async function GetCustomUId(
  nome: string,
  sobrenome: string,
  idade: string
) {
  const UCollection = collection(db, "users");
  const q = query(
    UCollection,
    where("nome", "==", nome),
    where("sobrenome", "==", sobrenome),
    where("idade", "==", idade)
  );
  const docSnap = await getDocs(q);
  if (!docSnap.empty) {
    const UserId = docSnap.docs[0].data().userId;
    return UserId;
  }
}

// Add other Firestore functions as needed
