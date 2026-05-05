# 🚨 ResQHub: Disaster Preparedness & Emergency Response Platform

ResQHub is a modular, web-based disaster preparedness platform that enables users to learn and respond to real-world emergencies through **interactive, scenario-based simulations**. It combines gamification, real-time data handling, and Progressive Web App (PWA) capabilities to enhance awareness and decision-making.

---

## 🌍 Overview

ResQHub focuses on **active learning** by simulating real-life disaster situations such as earthquakes, floods, wildfires, landslides, and first aid scenarios. Users engage in **decision-driven workflows**, helping them understand correct responses during emergencies.

---

## ✨ Features

- 🧠 **Scenario-Based Simulations**
  - Earthquake, flood, wildfire, landslide, and first-aid modules  
  - Decision-based interactive flows  

- 🎮 **Gamified Learning**
  - Engaging UI with interactive simulation logic  
  - Feedback-driven user experience  

- 🔐 **Authentication & User Management**
  - Firebase Authentication (login/signup)  
  - Secure user session handling  

- 📊 **Real-Time Data Handling**
  - Firestore database for storing user data and progress  
  - Dynamic rendering based on user actions  

- 📱 **Progressive Web App (PWA)**
  - Installable on devices  
  - Offline support using service workers  

- 🚑 **Additional Modules**
  - Emergency contacts  
  - Alerts and awareness content  
  - User profile system  

---

## 🏗️ Architecture

ResQHub follows a **modular architecture**, where each disaster scenario is an independent interactive module.
Frontend (HTML/CSS/JS)
↓
Simulation Engine (JS Logic + JSON Scenarios)
↓
Firebase Backend (Auth + Firestore)
↓
PWA Layer (Service Worker + Manifest)


---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  

### Backend
- Firebase Authentication  
- Firestore Database  

### Other
- Progressive Web App (PWA)  
- JSON-based scenario configuration  

---

## 🚀 How It Works

1. User logs in via Firebase Authentication  
2. Selects a disaster scenario  
3. Navigates through decision-based simulation  
4. Receives dynamic feedback based on choices  
5. Progress is stored in Firestore  

---

## 📦 Deployment

- Frontend: Netlify  
- Backend: Firebase  

---

## 🎯 Objectives

- Promote disaster awareness through interactive learning  
- Simulate real-world emergency decision-making  
- Provide an accessible and engaging training platform  

---

## 🔮 Future Improvements

- AI-based personalized recommendations  
- Performance analytics dashboard  
- Multi-language support  
- Integration with real-time emergency alert systems  

---


## 📄 License

This project is for educational and research purposes.
