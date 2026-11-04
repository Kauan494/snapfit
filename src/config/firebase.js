import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAJCFCc-8LNrGaYsA-LjI5_203cXM4reow",
  authDomain: "snapfit-ca757.firebaseapp.com",
  projectId: "snapfit-ca757",
  storageBucket: "snapfit-ca757.firebasestorage.app",
  messagingSenderId: "1039034331603",
  appId: "1:1039034331603:web:9a56f008d57d4eded1bf26",
};

// Inicia o Firebase com essas configurações
const app = initializeApp(firebaseConfig);

// Exporta a conexão com o Firestore para usar nas telas
export const db = getFirestore(app);