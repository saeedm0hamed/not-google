import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Cache to prevent duplicate logs in rapid succession (e.g., React Strict Mode)
const recentLogs = new Map<string, number>();
const CACHE_DURATION = 2000; // 2 seconds

export const logSearch = async (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return;

  const now = Date.now();
  const lastLogTime = recentLogs.get(normalizedQuery);

  if (lastLogTime && now - lastLogTime < CACHE_DURATION) {
    return;
  }

  // Update cache immediately to prevent concurrent calls
  recentLogs.set(normalizedQuery, now);

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
    // Remove from cache on error so it can be retried
    recentLogs.delete(normalizedQuery);
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
