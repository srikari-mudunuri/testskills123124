import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your exact Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-DgWGE7ze7aA5UdvjZwhIy9-l4XgvHyo",
  authDomain: "yes1-62c92.firebaseapp.com",
  projectId: "yes1-62c92",
  storageBucket: "yes1-62c92.firebasestorage.app",
  messagingSenderId: "236674389890",
  appId: "1:236674389890:web:3bd35f25ff951663cd219b",
  measurementId: "G-H3X0CJS3KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Observer
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isAuthPage = path.endsWith("index.html") || path === "/" || path.endsWith("/");

  if (user) {
    if (isAuthPage) window.location.href = "dashboard.html";
  } else {
    if (!isAuthPage) window.location.href = "index.html";
  }
});

// Authentication Handlers
window.handleSignUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "profile.html";
  } catch (err) {
    alert(err.message);
  }
};

window.handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

window.handleLogout = () => signOut(auth);

// Profile Management
window.saveProfile = async (name, teach, learn, contact) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      teachSkill: teach,
      learnSkill: learn,
      contact
    }, { merge: true });
    alert("Profile saved successfully!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

// Requesting Swaps
window.sendSwapRequest = async (targetUserId, targetUserName, targetSkill) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await addDoc(collection(db, "requests"), {
      senderId: user.uid,
      senderEmail: user.email,
      receiverId: targetUserId,
      requestedSkill: targetSkill,
      status: "pending",
      timestamp: new Date()
    });
    alert(`Swap request sent to ${targetUserName}!`);
  } catch (err) {
    alert("Error sending request: " + err.message);
  }
};