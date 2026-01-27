# Visual Product Matcher
> AI-powered visual search system for discovering similar products using image recognition.

---

## 📖 Overview

**Visual Product Matcher** is a full-stack web application that allows users to find visually similar products by submitting an image URL.  
The system uses **Google Cloud Vision API** to extract meaningful labels from images and matches them against a curated product catalog stored in **Firebase Firestore**.

This project demonstrates practical use of **Artificial Intelligence**, **Cloud APIs**, and **modern web development** in a real-world scenario.

---

## 🚀 Features

- 🔗 Image URL–based product search  
- 🤖 AI-powered image labeling (Google Vision API)  
- 🧠 Smart product matching using semantic tags  
- 🗃️ Cloud-hosted product database (Firebase Firestore)  
- 🔐 Secure backend proxy for API key protection  
- 🎨 Modern, responsive user interface  

---

## 🧩 System Architecture

User (Browser)
↓
Frontend (HTML / CSS / JavaScript)
↓
Node.js + Express (API Proxy Server)
↓
Google Cloud Vision API
↓
Firebase Firestore (Product Database)


---

## 🛠️ Technology Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript (ES Modules)

### Backend
- Node.js  
- Express.js  

### Cloud Services
- Google Cloud Vision API  
- Firebase Firestore  

### Tools
- Git & GitHub  
- Render (Deployment)  
- dotenv (Environment Management)

---

## 📁 Project Structure

visual-product-matcher/
│
├── client/
│ └── public/
│ ├── index.html # Application UI
│ ├── styles.css # Styling
│ └── app.js # Frontend logic
│
├── server.js # Backend server & API proxy
├── products.json # Product dataset (50+ items)
├── package.json # Project dependencies
├── .env # Environment variables
└── README.md # Project documentation


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/visual-product-matcher.git
cd visual-product-matcher
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment Variables
Create a .env file in the project root:

GOOGLE_VISION_API_KEY=your_google_vision_api_key
4️⃣ Start the Server
npm start
5️⃣ Open the Application
http://localhost:3000


## 🧪 How It Works
User submits an image URL

Backend sends the image to Google Vision API

Vision API returns descriptive labels

Labels are matched with product tags in Firestore

Visually similar products are displayed

📊 Product Dataset
Contains 50+ unique products

Each product includes:

Name

Category

Image URL

AI-generated tags

🔐 Security Design
API keys are never exposed to the frontend

All AI requests are handled by a secure backend proxy

Environment variables are managed using .env

📈 Performance Considerations
Product data is loaded once from Firestore

Matching is done in-memory for fast response

Minimal frontend dependencies for speed

⚠️ Known Limitations
Only image URL input is supported

Similarity is tag-based (not vector embeddings)

Requires publicly accessible image URLs

🚧 Future Enhancements
Image file upload support

Similarity score filtering

Category-based filtering

User authentication

Vector-based image similarity (ML embeddings)

CDN-based production deployment

🎓 Academic Context
This project was developed as part of an academic submission and demonstrates:

AI API integration

Cloud-based application architecture

Full-stack web development

Secure system design practices

👤 Author
Your Name
Computer Science Student
Visual Product Matcher — Academic Project

📜 License
This project is intended for educational purposes only.

✅ Project Status
✔ Functional
✔ Tested
✔ Ready for Evaluation

