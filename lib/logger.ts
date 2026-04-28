import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

export const logSearch = async (query: string) => {
  if (!query.trim()) return;

  try {
    // Ensure user is signed in
    let user = auth.currentUser;
    if (!user) {
      const userCredential = await signInAnonymously(auth);
      user = userCredential.user;
    }

    if (user) {
      await addDoc(collection(db, "searches"), {
        query: query.trim(),
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error logging search:", error);
  }
};

// Initialize anonymous auth listener
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch(console.error);
    }
  });
}
