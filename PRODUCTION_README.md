# MedAssist AI — Full-Stack Production-Ready App

Complete pharmacy chatbot and order management system with **React frontend**, **Node/Express backend**, and **MongoDB database**.

## 📁 Project Structure

```
├── frontend/           # React + Vite SPA
│   ├── src/
│   │   ├── pages/     # Home, Catalog, Chat, Orders, About, Contact
│   │   ├── components/ # Navbar, shared components
│   │   └── api.js     # API client
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Node/Express API
│   ├── models/        # MongoDB schemas (Medicine, Order, Contact)
│   ├── routes/        # API endpoints (/medicines, /orders, /chat, /contacts)
│   ├── scripts/       # Database seeding
│   ├── server.js      # Express server
│   └── package.json
│
├── docker-compose.yml # Local dev stack (MongoDB, backend, frontend)
└── README.md

```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up

# Backend will run on http://localhost:5001
# Frontend will run on http://localhost:5173
# MongoDB on localhost:27017
```

Then visit **http://localhost:5173** in your browser.

### Option 2: Local Development (without Docker)

#### Prerequisites

- Node.js 18+
- MongoDB (running locally or cloud instance)

#### Backend Setup

```bash
cd backend

# Copy and configure env
cp .env.example .env
# Edit .env with your MongoDB URI

# Install dependencies
npm install

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5001`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Features

### Frontend (React)

- **🏠 Home**: Hero section, stats, featured products
- **📦 Catalog**: Searchable medicine browser with filters by category
- **💬 Chat**: AI chatbot for medicine inquiries
- **📋 Orders**: Full order form with cart management
- **ℹ️ About**: Company info and mission
- **📧 Contact**: Contact form with validation
- **🌙 Dark/Light Mode**: Built-in theme toggle
- **📱 Fully Responsive**: Mobile, tablet, desktop optimized

### Backend (Node/Express)

#### API Routes

**Medicines**
- `GET /api/medicines` — List all medicines (paginated, searchable)
- `GET /api/medicines/categories` — Get unique categories
- `GET /api/medicines/:id` — Get single medicine
- `GET /api/medicines/inventory/low-stock` — Get stock alerts

**Orders**
- `POST /api/orders` — Create a new order
- `GET /api/orders` — List orders (filterable by email/status)
- `GET /api/orders/:id` — Get order details
- `PATCH /api/orders/:id/status` — Update order status

**Chat**
- `POST /api/chat` — Send message to chatbot

**Contacts**
- `POST /api/contacts` — Submit contact form
- `GET /api/contacts` — List messages (admin)

**Health**
- `GET /api/health` — Server status check

### Database (MongoDB)

**Collections**:
- `medicines` — Product catalog
- `orders` — Customer orders with items and tracking
- `contacts` — Support inquiries

## 🔧 Configuration

### Backend `.env`

```env
MONGODB_URI=mongodb://localhost:27017/medassist
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### Frontend Vite Config

Proxy to backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  }
}
```

## 📦 Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
# Output: dist/
```

### Build Backend Docker Image

```bash
docker build -t medassist-backend:latest backend/
docker build -t medassist-frontend:latest frontend/
```

### Use Docker Compose for Production

```bash
docker-compose -f docker-compose.yml up -d
```

Or deploy to **Kubernetes** (AKS configs in `aks/` folder):
```bash
kubectl apply -f aks/namespace.yaml
kubectl apply -f aks/deployment.yaml
kubectl apply -f aks/service.yaml
kubectl apply -f aks/ingress.yaml
```

## 🌐 API Examples

### Get Medicines

```bash
curl http://localhost:5001/api/medicines?category=Antibiotic&limit=10
```

### Place Order

```bash
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9999999999",
    "items": [
      { "medicineId": "...", "quantity": 2 }
    ],
    "deliveryAddress": "123 Main St",
    "notes": "Fast delivery please"
  }'
```

### Chat

```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{ "message": "Do you have Paracetamol?" }'
```

## 🛠 Development

### Add a New Page

1. Create file in `frontend/src/pages/YourPage.jsx`
2. Import in `App.jsx`
3. Add route:
   ```jsx
   <Route path="/yourpage" element={<YourPage />} />
   ```
4. Add link in `Navbar.jsx`

### Add API Endpoint

1. Create route file in `backend/routes/yourroute.js`
2. Import in `server.js`:
   ```javascript
   import yourRouter from './routes/yourroute.js';
   app.use('/api/yourroute', yourRouter);
   ```

### Database

Seed fresh data:
```bash
cd backend
npm run seed
```

## 🔐 Security Notes

- Add authentication (JWT, OAuth) for order history
- Use HTTPS in production
- Validate all inputs on backend
- Rate-limit API endpoints
- Use environment variables for secrets
- Enable CORS properly (currently permissive for dev)

## 📞 Support

For issues or questions, use the **Contact** page in the app.

---

**Built with ❤️ by MedAssist Team**
