
# 🌍 SAMMA - World Samma Organization Platform

**Live Site:** [worldsamma.org](https://www.worldsamma.org)  
**Production IP:** `137.184.233.104` (DigitalOcean Droplet)  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js) + Docker + NGINX  

---

## 📜 Overview

SAMMA is the official digital platform for the World Samma Organization, providing:

- Modern web presence for the organization's mission
- Secure content management and delivery
- Scalable infrastructure for future features
- Containerized deployment for reliability

---

## 🚀 Key Features

### Core Architecture
- **Full MERN Stack Implementation**
- **Microservices-ready Docker containers**
- **NGINX reverse proxy with HTTPS support**
- **Optimized React frontend with server-side build**

### Infrastructure
- **DigitalOcean droplet deployment**
- **Let's Encrypt SSL certificates**
- **Port configuration for web (80/443) and media (1935)**
- **Optional LiveKit integration for future media features**

### Development
- **Dockerized development environment**
- **Separate backend/frontend hot-reload support**
- **MongoDB Atlas or local database options**

---

## 🏗️ Project Structure

```bash
samma/
├── backend/               # Node.js + Express API
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middlewares/      # Auth and utilities
│   └── index.js          # Server entry point
│
├── frontend/             # React application
│   ├── public/           # Static assets
│   ├── src/              # React components
│   │   ├── assets/       # Images, fonts
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Route components
│   │   └── App.js        # Main component
│   └── Dockerfile        # Frontend build
│
├── docker-compose.yml    # Multi-container orchestration
├── Dockerfile.backend    # Backend container config
├── Dockerfile.nginx      # NGINX web server config
└── .env.example          # Environment template
```

---

## 🛠️ Installation & Deployment

### 🐳 Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# View running containers
docker ps

# View logs
docker-compose logs -f
```

### 💻 Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your variables
npm run dev           # Development mode with nodemon
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start             # Development server
```

### ⚙️ Environment Variables

Create `.env` files in both `backend/` and `frontend/` based on:

**Backend (.env)**
```env
PORT=8080
MONGODB_URI=mongodb://[username:password@]host:port/dbname
JWT_SECRET=your_secure_jwt_secret
# Add other service keys as needed
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GA_TRACKING_ID=UA-XXXXX-Y
```

---

## 🌐 Production Setup

### NGINX Configuration
```nginx
server {
    listen 80;
    server_name worldsamma.org;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
    }
}
```

### SSL Certificate
```bash
certbot certonly --nginx -d worldsamma.org
```

---

## 📜 License & Copyright

**Copyright © 2023 World Samma Organization**  
This project is publicly available under the name "SAMMA" and deployed at [worldsamma.org](https://www.worldsamma.org).

**Registration:**  
Prepared for copyright registration under:  
[nrr.copyright.go.ke](https://nrr.copyright.go.ke)

**Infrastructure:**  
Hosted on DigitalOcean droplet (`137.184.233.104`)

---

## 👥 Contributors

- **Maintainer:** [@jdtheefirst](https://github.com/jdtheefirst)
- **Organization:** [World Samma Organization](https://www.worldsamma.org)

---

## 🔮 Roadmap

- [ ] Implement user authentication system
- [ ] Add content management dashboard
- [ ] Integrate donation/payment processing
- [ ] Expand media streaming capabilities
- [ ] Internationalization support

```
