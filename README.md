# LinkSync ✨ - Premium Link-in-Bio Profile Builder

LinkSync is a modern, responsive full-stack "Link-in-Bio" web application inspired by Linktree and Bento. It enables users to register accounts, customize personal profiles (names, bios, custom avatars), create and re-order active links, track real-time click metrics, choose premium themes, and share clean public profile pages.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS v3, React Router v6, Axios, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js, Mongoose, MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT) with bcryptjs encryption
- **Deployment:** Frontend → Vercel | Backend → Render

---

## 📂 Project Structure

```text
project-i/
├── backend/
│   ├── src/
│   │   ├── config/db.js         # MongoDB connection setup
│   │   ├── middleware/auth.js   # JWT authentication validation middleware
│   │   ├── models/              # MongoDB Schemas (User, Link)
│   │   ├── routes/              # Express API Endpoint Handlers (auth, profile, links)
│   │   └── server.js            # Express server entry point
│   ├── .env.example             # Template for server configuration settings
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, LinkCard, Phone Mockup, etc.)
│   │   ├── context/AuthContext  # JWT auth state provider & profile updates
│   │   ├── pages/               # Views (Login, Signup, Dashboard, PublicProfile, NotFound)
│   │   ├── services/api.js      # Axios client with JWT request headers interceptor
│   │   ├── index.css            # Tailwind base, global scrollbars, theme classes
│   │   └── main.jsx
│   ├── tailwind.config.js       # Content path and custom font definitions
│   ├── vite.config.js           # Vite configurations & dev proxy server
│   └── package.json
└── README.md                    # Setup, API documentation, and deployment guides
```

---

## 🛠️ Local Installation & Setup

Follow these steps to run both the frontend and backend servers concurrently on your computer:

### 1. Prerequisites
- Install **Node.js** (v18 or higher recommended)
- A **MongoDB Atlas** account (or local MongoDB database installation)

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your environment variable file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Edit the newly created `.env` file and replace the placeholders:
   - Provide your **MongoDB Atlas** connection string in `MONGODB_URI`.
   - Choose a secret string for `JWT_SECRET`.
4. Install npm packages:
   ```bash
   npm install
   ```
5. Launch the backend API server in development mode (with hot reloading):
   ```bash
   npm run dev
   ```
   *The backend should run on [http://localhost:5000](http://localhost:5000).*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages (ignoring post-install compilation scripts to prevent Windows environment PATH collisions):
   ```bash
   npm install --ignore-scripts
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend should run on [http://localhost:3000](http://localhost:3000).*

---

## 📡 API Reference Map

All endpoints return standard JSON response formats: `{ success: true, ... }` or `{ success: false, message: "..." }`.

### 🔐 Authentication

| Method | Endpoint | Description | Request Body | Access |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Registers a user & seeds starter links | `{ name, username, email, password }` | Public |
| **POST** | `/api/auth/login` | Validates credentials & issues JWT token | `{ email, password }` | Public |

### 👤 Profile Management

| Method | Endpoint | Description | Request Body | Access |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/profile` | Returns current user profile | *None* | Private (JWT) |
| **PUT** | `/api/profile` | Edits user info & selections | `{ name, bio, avatar, accentColor, selectedTheme, username }` | Private (JWT) |
| **GET** | `/api/profile/public/:username` | Serves public profile details & active links | *None* | Public |

### 🔗 Link Operations

| Method | Endpoint | Description | Request Body | Access |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/links` | Returns all links for current user (ordered) | *None* | Private (JWT) |
| **POST** | `/api/links` | Adds a link (appends to bottom) | `{ title, url }` | Private (JWT) |
| **PUT** | `/api/links/:id` | Edits link details, toggle state, or order | `{ title, url, active, order }` | Private (JWT) |
| **DELETE** | `/api/links/:id` | Removes a link record | *None* | Private (JWT) |
| **PATCH** | `/api/links/:id/click` | Increments click counter by 1 | *None* | Public |

---

## 🎨 Theme Presets

LinkSync features a premium, responsive styling engine defined in `frontend/src/index.css` via class selectors:

1. **Minimal Clean (`theme-minimal`):** Bright slate gradients (`#f8fafc` to `#f1f5f9`), solid white card buttons with light borders, and text colored to match the accent picker.
2. **Premium Dark (`theme-dark`):** Sleek deep grey backdrops, glassmorphic semi-transparent links (`bg-white/5` with backdrop-blur), and glowing hover accent borders.
3. **Cyber Neon (`theme-neon`):** Cyberpunk dark purple backgrounds, cyan text buttons with magenta borders, and vibrant glowing fuchsia shadows.

*The Live Smartphone Mockup on the dashboard renders all updates, color changes, and theme switches instantly as the user clicks or types.*

---

## 🌐 Production Deployment Guide

Follow these steps to deploy your application for free:

### 1. Backend → Render (or railway)
1. Commit and push your code repository to **GitHub**.
2. Log in to the [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
3. Link your GitHub repository.
4. Set the following build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In the **Environment** tab, click **Add Environment Variable** and specify:
   - `PORT` = `5000` (Render handles routing automatically)
   - `MONGODB_URI` = *Your MongoDB Atlas production URI connection string*
   - `JWT_SECRET` = *A strong random hashing passphrase*
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service** and note down the service URL once it completes (e.g. `https://linksync-api.onrender.com`).

### 2. Frontend → Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository.
3. Configure the following project parameters:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Expand the **Environment Variables** section and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://linksync-api.onrender.com/api` (Replace with your actual deployed Render Web Service API URL)
5. Click **Deploy**. Vercel will bundle the Vite React files and host them on a fast, free CDN.

---

## 🎓 Senior Developer UI/UX Best Practices

1. **Optimistic UI Updates:** The dashboard updates links' toggle states and order swaps optimistically in the React UI immediately before receiving the API confirm payload. This eliminates server response lag.
2. **In-Browser Image Resizing:** Avatar uploads are scaled to `120x120px` and compressed in quality on a canvas before converting to base64. This makes profile saves lightning fast and keeps database storage size trivial.
3. **Fire-and-Forget Analytics:** When a user clicks a button on the public page, the click tracking PATCH API is called asynchronously in the background. The browser does not wait for the response to load before opening the target URL, optimizing redirection speeds.
4. **Mobile Tab Editor Toggle:** Standard mobile editors get too long if editor forms and previews are stacked. LinkSync uses a visual segmented tab bar (`Edit` | `Preview`) at the top on mobile screens, letting users switch tabs in one click.


