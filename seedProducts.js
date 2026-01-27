import fs from "fs";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// 🔥 Firebase config (same project)
const firebaseConfig = {
  apiKey: "AIzaSyD-grwuz009WsEz_DuuGBmZ98PlxdhjVaA",
  authDomain: "visual-product-matcher-df267.firebaseapp.com",
  projectId: "visual-product-matcher-df267",
  storageBucket: "visual-product-matcher-df267.firebasestorage.app",
  messagingSenderId: "809671148619",
  appId: "1:809671148619:web:0f65e57bb4ac56fa7e79ce",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedProducts() {
  console.log("📦 Reading products.json...");

  const raw = fs.readFileSync("./products.json", "utf-8");
  const products = JSON.parse(raw);
  // Fetch existing product names to avoid duplicates
const existingSnap = await getDocs(collection(db, "products"));
const existingNames = new Set(
  existingSnap.docs.map(d => d.data().name.toLowerCase())
);




  console.log(`🚀 Uploading ${products.length} products...`);

  let count = 0;
 for (const product of products) {
  if (existingNames.has(product.name.toLowerCase())) {
    console.log(`⏭️ Skipped existing: ${product.name}`);
    continue;
  }

  await addDoc(collection(db, "products"), product);
  count++;
  console.log(`✅ Uploaded (${count}): ${product.name}`);
}


  console.log("🎉 ALL PRODUCTS UPLOADED SUCCESSFULLY");
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
