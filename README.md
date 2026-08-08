# ⚡ Production-Quality Electric Vehicle Marketplace (MERN)

A full-stack, commercial-grade Electric Vehicle (EV) discovery and commerce platform built with MongoDB, Express.js, React, Node.js, Tailwind CSS, Stripe, and Retrieval-Augmented AI recommendations.

---

## 🌟 Product Vision & Features

The **EV Marketplace** connects **Customers**, **Vendors/Sellers**, and **Marketplace Administrators** in a unified automotive commerce ecosystem.

### 🚗 Customer Capabilities
- **EV Discovery & Natural Language Search**: Filter by Brand, Model, Price, Range (km), Battery (kWh), Body Type, Condition, Location, and natural text prompts.
- **Side-by-Side EV Comparison**: Compare up to 4 vehicles with automated badges for *Best Price*, *Best Range*, *Fastest Charging*, *Best Rated*, and *Best Overall Value*.
- **Persisted Cart & Wishlist**: Real-time MongoDB synchronized shopping cart and saved wishlist with inventory stock protection.
- **Stripe Secure Checkout**: Server-side price calculation and payment verification flow with flatbed delivery fee calculation.
- **Order Tracking Timeline**: Interactive visual timeline tracking orders from `Order Placed` to `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, and `Delivered`.
- **Verified Buyer Reviews**: Only customers with verified paid purchases can submit 1-5 star ratings and reviews.
- **EV Calculators**: Range & consumption calculator, Home vs Fast DC charging cost estimator, and 5-Year Ownership TCO Savings vs Petrol/Diesel ICE cars.
- **Retrieval-Augmented AI Vehicle Recommender**: Candidate vehicles are retrieved from live MongoDB inventory and ranked with rationale explanations based on user commute and budget inputs.

### 🏪 Vendor Capabilities
- **Vendor Dashboard**: Real-time MongoDB metrics (Active listings, Revenue, Orders, Pending approvals, Rating) and Recharts sales revenue charts.
- **EV Listing Management**: Add EV listing with rich spec form & multi-image support (status set to `PENDING_APPROVAL`), edit, delete, or mark as `SOLD`.
- **Fulfillment Pipeline**: Manage customer orders and update status progression.

### 🛡️ Admin Capabilities
- **Marketplace Dashboard**: Aggregated platform metrics (Total Users, Total Vendors, Total Vehicles, Total Orders, Revenue, Pending approvals), Top EV brand charts, and body segment breakdown.
- **Listing Approval Workflow**: Review vendor EV submissions with one-click **Approve** or **Reject** with mandatory rejection reason and automated vendor notification.
- **User & Vendor Control**: Manage users, suspend/activate customer and vendor accounts.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router DOM v6, Tailwind CSS, Lucide React Icons, Recharts, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Morgan |
| **Database** | MongoDB, Mongoose ODM (Indexes on brand, model, price, range, status, bodyType) |
| **Payments** | Stripe SDK (Server-verified PaymentIntents & Checkout) |
| **Theme** | Light & Dark mode toggle with persistent state |

---

## 📂 Project Architecture

```
EV_MarketPlace/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Auth, Vehicle, Cart, Order, Payment, Vendor, Admin, AI, Calculator
│   │   ├── middleware/      # JWT Protect, Role Guard (authorize), Central Error Handler
│   │   ├── models/          # User, Vendor, Vehicle, Category, Cart, Wishlist, Order, Review, Notification, Payment
│   │   ├── routes/          # Versioned REST APIs (/api/v1/*)
│   │   ├── seeders/         # Realistic EV Database Seeder (seed.js)
│   │   ├── utils/           # API response helpers & JWT token generator
│   │   └── server.js        # Main Express server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, VehicleCard, RatingStars, Badge, Skeletons, EmptyState, ErrorState
│   │   ├── context/         # AuthContext, ThemeContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/           # Home, ExploreVehicles, VehicleDetails, Comparison, Wishlist, Cart, Checkout, OrderTracking, UserOrders, UserProfile, EVCalculators, AIRecommendations, Login, Register, Vendor & Admin Portals
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Router & Protected RBAC Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populate realistic EV catalog & demo accounts
npm run dev      # Server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Client starts on http://localhost:5173
```

---

## 🔐 Default Demo Credentials (Post-Seeding)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@evmarketplace.com` | `Password123` |
| **Vendor** | `vendor@apexev.com` | `Password123` |
| **Customer** | `customer@gmail.com` | `Password123` |

---

## 🔒 Security Measures
- **Password Hashing**: Salted bcrypt hashing with 10 rounds.
- **JWT Authorization**: Bearer tokens with role-based backend guards (`CUSTOMER`, `VENDOR`, `ADMIN`). Public registration strictly prevents admin account creation.
- **Input & SQL/Mongo Sanitization**: Strict schema validation & MongoDB query operators protection.
- **Server-Side Price Validation**: Order totals are calculated on Express backend; client-side price modification is impossible.
- **Stripe Secret Protection**: Secret keys never exposed to client; payment status verified server-side.

---

## 📜 License
MIT License. Created for Production-Quality Electric Mobility Marketplace.
