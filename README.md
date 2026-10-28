# Sociova

**Sociova** is a full-stack social media web application inspired by Instagram. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides a real-time social platform where users can share posts, upload 24-hour stories, follow others, interact in real-time, and send direct messages. The application is highly optimized for performance and features a bulletproof mobile-first responsive design.

---

## 🌐 Live Demo

🔗 [Visit Sociova](https://sociova.onrender.com)  

---

## 🚀 Features

- **24-Hour Stories:** Instagram-style stories with segmented progress bars, auto-advance, and tap-to-navigate UI. Supports both video and image uploads.
- **Smart Media Pipeline:** Automatically routes heavy videos through memory-efficient upload streams while aggressively compressing images to bypass cloud tier limits.
- **Real-Time Global Search:** Highly optimized, debounced user search using MongoDB Regex for partial, case-insensitive matching.
- **Real-Time Interactions:** Socket.io integration for instant direct messaging and live notification badges (likes/messages).
- **User Authentication:** Secure JWT-based registration, login, and logout.
- **Core Social Mechanics:** Create, Read, Delete Posts; Like and 💬 Comment on posts; Follow/Unfollow users.
- **Mobile-First UX:** Custom dynamic viewport (`100dvh`) styling and layout bumpers to prevent overlap from mobile browser address bars (Safari/Brave).

---

## 🧠 Key Technical Achievements

- **Advanced Media Handling (Cloudinary + Sharp + Multer):** Engineered a split upload pipeline. Images are intercepted as RAM buffers, compressed to WebP format, and resized via `sharp` to stay under 10MB limits. Videos bypass compression and utilize `upload_stream` for chunked cloud delivery up to 100MB without crashing server memory.
- **Database TTL Indexes:** Implemented MongoDB Time-To-Live (TTL) indexes (`expires: 86400`) to automatically purge expired Story documents directly at the database level.
- **Frontend API Optimization:** Implemented 300ms debouncing on the global search input to drastically reduce unnecessary API calls and database load during keystrokes.
- **Complex UI State Management:** Built custom `Dialog` portals and absolute-positioned mobile sidebars that escape hidden overflow containers while maintaining fluid native scrolling.

---

## 🛠️ Tech Stack

### Frontend:
- **React.js** (Functional Components, Hooks)
- **Redux Toolkit** (Global State Management)
- **React Router DOM**
- **Tailwind CSS** (Utility-first styling, Custom Scrollbars)
- **ShadCN UI / Lucide React** (Accessible components & Icons)

### Backend:
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Socket.io** (WebSockets for real-time chat & notifications)
- **JWT** (Stateless Authentication)
- **Cloudinary** (Cloud media storage)
- **Multer** (Multipart/form-data parsing via `memoryStorage`)
- **Sharp** (High-performance Node.js image processing)

---

## 📸 Screenshots (Overview)

<img width="1664" height="844" alt="Screenshot 2025-07-11 183418" src="https://github.com/user-attachments/assets/106f1186-6448-45c2-94fd-c5325d76b621" />
<img width="1394" height="810" alt="Screenshot 2025-07-11 183432" src="https://github.com/user-attachments/assets/e3b5813f-f39a-4013-ba38-5f6e64c88a02" />
<img width="1871" height="883" alt="Screenshot 2025-07-11 183504" src="https://github.com/user-attachments/assets/2be3a471-d64d-42d7-b014-18cfc78014ef" />
<img width="1886" height="870" alt="Screenshot 2025-07-11 183525" src="https://github.com/user-attachments/assets/40f0f71b-4045-487b-891e-d4458aa62985" />
<img width="1864" height="843" alt="Screenshot 2025-07-11 183559" src="https://github.com/user-attachments/assets/d75782c6-4ccd-4027-a150-e1bd2f24a008" />

## 📱 Mobile View
<img src="https://github.com/user-attachments/assets/2f67ef7d-14d8-4e89-970e-5f35398f4aae" width="300"/>
<img src="https://github.com/user-attachments/assets/6c60a088-1d27-4679-8533-d79ac1c36cf4" width="300"/>
<img src="https://github.com/user-attachments/assets/b040604a-8bae-4048-b57e-aa35d72776be" width="300"/>
<img src="https://github.com/user-attachments/assets/033f8303-55a3-419c-9f12-520ee62490e0" width="300"/>
