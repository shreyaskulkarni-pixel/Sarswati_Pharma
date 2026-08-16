# MedAssist AI — Full-Stack Setup Guide

## ✅ What's Been Added

You now have a **complete production-ready full-stack app**:

### **Frontend (React + Vite + Tailwind)**
- ✅ Home page with stats & featured products
- ✅ Product Catalog with search & category filters
- ✅ AI Chatbot page
- ✅ Order placement with cart management
- ✅ About page
- ✅ Contact form
- ✅ Navigation bar (responsive, mobile menu)
- ✅ Dark/Light mode toggle
- ✅ Fully responsive design

### **Backend (Node.js + Express)**
- ✅ RESTful API for medicines, orders, chat, contacts
- ✅ MongoDB integration
- ✅ Error handling & logging
- ✅ CORS enabled
- ✅ Health check endpoint
- ✅ Database seeding script

### **Database (MongoDB)**
- ✅ Medicine catalog schema
- ✅ Order management schema
- ✅ Contact form schema
- ✅ 8 sample medicines pre-seeded

### **Deployment Ready**
- ✅ Docker Compose for local dev (all services)
- ✅ Dockerfile for backend & frontend
- ✅ Production docs & API examples

---

## 🚀 How to Run It Immediately

### **FASTEST: With Docker Compose**

1. Make sure Docker & Docker Compose are installed
2. In the project root:

```bash
docker-compose up
```

Wait 30 seconds for all services to start:
- MongoDB ✅ (port 27017)
- Backend API ✅ (http://localhost:5001)
- Frontend UI ✅ (http://localhost:5173)

Then **open http://localhost:5173** in your browser!

---

### **Alternative: Local Setup (No Docker)**

#### **1. Install MongoDB**

**Windows**:
```bash
# Download & install from https://www.mongodb.com/try/download/community
# Or via Chocolatey:
choco install mongodb-community
```

**Mac**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux**:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### **2. Start Backend**

```bash
cd backend

# Copy env template
cp .env.example .env

# Install dependencies
npm install

# Seed database with sample medicines
npm run seed

# Start dev server
npm run dev
```

Backend runs at **http://localhost:5001**

#### **3. Start Frontend** (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 📖 What You Can Do Now

### **🏠 Home Page**
- See stats (products, categories, support)
- Browse featured medicines
- Links to chat, catalog, orders

### **📦 Catalog**
- Search medicines by name
- Filter by category
- See stock levels & pricing
- Add to cart (functional)

### **💬 Chat**
- Ask questions: "Do you have Paracetamol?"
- Try: "Show antibiotics", "Stock summary", "Show offers"
- AI responds based on database

### **📋 Orders**
- Build a cart from medicine list
- Fill delivery form
- See order confirmation
- Get order number for tracking

### **📧 Contact**
- Submit inquiries
- Messages saved to database
- Responsive form validation

### **ℹ️ About**
- Company mission & values
- Features overview
- Meet the "team"

---

## 🔌 API Endpoints (All Working)

### **Medicines**
```bash
# Get all medicines (paginated)
curl http://localhost:5001/api/medicines?limit=10&page=1

# Get medicines by category
curl http://localhost:5001/api/medicines?category=Antibiotic

# Search medicines
curl http://localhost:5001/api/medicines?search=Paracetamol

# Get categories
curl http://localhost:5001/api/medicines/categories

# Get low stock items
curl http://localhost:5001/api/medicines/inventory/low-stock
```

### **Orders**
```bash
# Create order
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Your Name",
    "customerEmail": "your@email.com",
    "items": [{"medicineId": "...", "quantity": 2}],
    "deliveryAddress": "Your Address"
  }'

# Get orders by email
curl http://localhost:5001/api/orders?email=your@email.com
```

### **Chat**
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me antibiotics"}'
```

### **Contacts**
```bash
curl -X POST http://localhost:5001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "subject": "Inquiry",
    "message": "Your message"
  }'
```

### **Health Check**
```bash
curl http://localhost:5001/api/health
```

---

## 🛠 Next Steps / Customization

### **Change Medicine Data**
Edit `backend/scripts/seed.js` and run:
```bash
npm run seed
```

### **Customize Theme**
Colors are in `frontend/src/index.css` and Tailwind config

### **Add Authentication**
Implement JWT in backend routes (use `middleware/auth.js`)

### **Deploy to Cloud**
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, Render
- **Database**: MongoDB Atlas (free tier available)

### **Add More Features**
- Payment integration (Stripe, Razorpay)
- Email notifications
- Admin dashboard
- User accounts & order history
- SMS alerts

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main React app with routing |
| `backend/server.js` | Express server setup |
| `backend/models/` | MongoDB schemas |
| `backend/routes/` | API endpoint handlers |
| `docker-compose.yml` | Local dev stack definition |
| `PRODUCTION_README.md` | Detailed docs |

---

## ⚡ Common Issues & Fixes

### **"Cannot connect to MongoDB"**
- Make sure MongoDB is running: `mongod` (or `brew services start mongodb-community` on Mac)
- Check `.env` has correct `MONGODB_URI`

### **"Port 5173 already in use"**
- Kill process: `lsof -ti:5173 | xargs kill -9`
- Or change port in `frontend/vite.config.js`

### **"CORS errors in browser console"**
- Backend should allow FRONTEND_URL in `.env`
- Check `backend/server.js` CORS config

### **Frontend not loading after API calls**
- Check backend is running: `curl http://localhost:5001/api/health`
- Check network tab in browser devtools

---

## 🎉 That's It!

You have a **fully functional** pharmacy chatbot system. All pages work, all APIs respond, database is seeded with data.

**Ready to build and customize!**

For questions: check `PRODUCTION_README.md` or modify files as needed.

---

Built with ❤️ by your coding assistant
