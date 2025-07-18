# **UniStay** 🏠

A platform for students to list and find accommodations easily.

---

## **Features**

✔ Google OAuth login/signup
✔ Create, edit, and delete listings
✔ Upload multiple images per listing
✔ Bookmark favorite listings
✔ Mark listings as **Unavailable** when booked
✔ **I'm Interested** → Contact exchange between viewer & lister
✔ Click images to enlarge

---

## **Tech Stack**

* **Backend:** Node.js, Express
* **Frontend:** EJS, Bootstrap, FontAwesome
* **Database:** MongoDB (Mongoose)
* **Authentication:** Google OAuth 2.0
* **Image Hosting:** Cloudinary

---

## **Installation**

### **1. Clone the repository**

```bash
git clone https://github.com/RummanShuja/UniStay.git
cd unistay
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Create a `.env` file**

```ini
ATLASDB_URL=your_mongo_uri
SECRET_CODE=your_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

### **4. Run the app**

```bash
npm run dev   # development
npm start     # production
```

---

## **Deployment (Render)**

1. Push your project to **GitHub**.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your GitHub repo.
4. **Build Command:**

   ```bash
   npm install
   ```
5. **Start Command:**

   ```bash
   npm start
   ```
6. Add all **Environment Variables** from `.env` in Render Dashboard.
7. Click **Deploy**!

---

