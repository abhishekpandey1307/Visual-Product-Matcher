import dotenv from "dotenv";
import fetch from "node-fetch";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

dotenv.config();

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-grwuz009WsEz_DuuGBmZ98PlxdhjVaA",
  authDomain: "visual-product-matcher-df267.firebaseapp.com",
  projectId: "visual-product-matcher-df267",
  storageBucket: "visual-product-matcher-df267.firebasestorage.app",
  messagingSenderId: "809671148619",
  appId: "1:809671148619:web:0f65e57bb4ac56fa7e79ce",
};

// 🔹 Imagga credentials
const IMAGGA_KEY = process.env.IMAGGA_API_KEY;
const IMAGGA_SECRET = process.env.IMAGGA_API_SECRET;

if (!IMAGGA_KEY || !IMAGGA_SECRET) {
  console.error("❌ Missing Imagga keys in .env");
  process.exit(1);
}

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Call Imagga
async function getImageTags(imageUrl) {
  const auth = Buffer.from(
    `${IMAGGA_KEY}:${IMAGGA_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Imagga API failed");
  }

  const data = await res.json();

  return data.result.tags.slice(0, 5).map((t) => t.tag.en.toLowerCase());
}

async function tagProducts() {
  console.log("🏷️ Starting AI tagging...");

  const snap = await getDocs(collection(db, "products"));
  let processed = 0;

  for (const d of snap.docs) {
    const product = d.data();

    if (product.tags && product.tags.length > 0) {
      console.log(`⏭️ Skipped (already tagged): ${product.name}`);
      continue;
    }

    if (!product.imageUrl) {
      console.log(`⚠️ No image URL: ${product.name}`);
      continue;
    }

    console.log(`🤖 Tagging: ${product.name}`);

    try {
      const tags = await getImageTags(product.imageUrl);

      await updateDoc(doc(db, "products", d.id), {
        tags,
      });

      console.log(`✅ Saved tags: ${tags.join(", ")}`);
      processed++;
    } catch (err) {
      console.error(`❌ Failed for ${product.name}:`, err.message);
    }
  }

  console.log(`🎉 DONE. Tagged ${processed} products.`);
  process.exit(0);
}

tagProducts();
