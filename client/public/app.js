console.log("APP.JS LOADED");

// ==========================
// FIREBASE SETUP
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyD-grwuz009WsEz_DuuGBmZ98PlxdhjVaA",
  authDomain: "visual-product-matcher-df267.firebaseapp.com",
  projectId: "visual-product-matcher-df267",
});

const db = getFirestore(firebaseApp);

// ==========================
// LOAD PRODUCTS
// ==========================
let allProducts = [];

async function loadProductsFromFirestore() {
  console.log("📦 Loading products from Firestore...");
  const snap = await getDocs(collection(db, "products"));
  allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log("✅ Products loaded:", allProducts.length);
}

// ==========================
// AI TAGGING
// ==========================
async function getImageTags(imageUrl) {
  const res = await fetch("http://localhost:3000/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  const data = await res.json();
  if (!data.result?.tags) return [];
  return data.result.tags.map(t => t.tag.en.toLowerCase());
}

// ==========================
// DOM READY
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  const fileInput = document.getElementById("file-input");
  const fileSearchBtn = document.getElementById("file-search-btn");
  const urlSearchBtn = document.getElementById("url-search-btn");
  const urlInput = document.getElementById("url-input");
  const previewImage = document.getElementById("preview-image");
  const resultsGrid = document.getElementById("results-grid");
  const resultsSection = document.getElementById("results-section");

  await loadProductsFromFirestore();

  // ==========================
  // URL SEARCH (FULL AI)
  // ==========================
  urlSearchBtn.onclick = async () => {
    const url = urlInput.value.trim();
    if (!url) return alert("Enter image URL");

    previewImage.src = url;
    const tags = await getImageTags(url);

    const matches = allProducts.filter(p =>
      p.tags?.some(t => tags.includes(t.toLowerCase()))
    );

    renderResults(matches);
  };

  // ==========================
  // FILE SEARCH (SAFE DEMO)
  // ==========================
  fileSearchBtn.onclick = () => {
    if (!fileInput.files[0]) {
      alert("Please select a file first");
      return;
    }

    alert(
      "File upload preview is supported.\n" +
      "For AI matching, please use Image URL.\n\n" +
      "This avoids large upload limits during demo."
    );
  };

  // Preview file
  fileInput.onchange = e => {
    const reader = new FileReader();
    reader.onload = () => (previewImage.src = reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  function renderResults(products) {
    resultsGrid.innerHTML = "";
    resultsSection.style.display = "block";

    if (!products.length) {
      resultsGrid.innerHTML = "<p>No similar products found.</p>";
      return;
    }

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${p.imageUrl}" class="product-image"/>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
        </div>`;
      resultsGrid.appendChild(div);
    });
  }
});


