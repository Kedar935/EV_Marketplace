# Implementation Plan - Production-Quality Electric Vehicle Marketplace (MERN)

Build a complete, production-ready, full-stack Electric Vehicle Marketplace using MongoDB, Express.js, React, Node.js, Tailwind CSS, Stripe, and AI recommendations.

## Technical Architecture & Design Principles

```
  +-----------------------------------------------------------------------+
  |                        React Frontend (Client)                         |
  |  - React Router DOM  - Tailwind CSS  - Lucide Icons  - Recharts Charts  |
  |  - Auth Context     - Theme Context - Toast / Skeletons / Dark Mode   |
  +-----------------------------------+-----------------------------------+
                                      | REST API (Axios / Bearer Token)
                                      v
  +-----------------------------------------------------------------------+
  |                         Express Node.js Backend                       |
  |  - Controllers & Routes    - JWT + Bcrypt Auth    - Security (Helmet)  |
  |  - Payment Verification    - AI Filter Engine     - Aggregations       |
  +-----------------------------------+-----------------------------------+
                                      | Mongoose ODM
                                      v
  +-----------------------------------------------------------------------+
  |                             MongoDB Database                           |
  |  - Users, Vendors, Vehicles, Categories, Orders, Cart, Wishlist       |
  |  - Reviews, Notifications, Payments                                   |
  +-----------------------------------------------------------------------+
```

---

## User Review Required

> [!IMPORTANT]
> - **Architecture**: Full MERN Stack with Express backend listening on port `5000` (or `PORT` env) and React Vite frontend on port `5173`.
> - **Stripe & AI**: Works seamlessly out-of-the-box with mock/fallback mode when API keys (`STRIPE_SECRET_KEY`, `AI_API_KEY`) are not provided, while supporting real API integration when keys are present in `.env`.
> - **Roles & Permissions**: Strict backend RBAC enforcing `CUSTOMER`, `VENDOR`, and `ADMIN` access. Admin creation is secured via seed script or explicit secret key.

---

## Proposed Implementation Phases

### Phase 1: Workspace Setup & Core Infrastructure
- Initialize `backend/` (`package.json`, Express, CORS, Helmet, dotenv, Mongoose, JWT, bcryptjs, Stripe).
- Initialize `frontend/` (Vite + React, Tailwind CSS, Lucide React, Recharts, Axios, React Router).
- Setup environment config files (`.env`, `.env.example`).

### Phase 2: MongoDB Schemas & Data Models (`backend/src/models/`)
- `User.js`: `name`, `email`, `password` (hashed), `phone`, `role` (`CUSTOMER`, `VENDOR`, `ADMIN`), `avatar`, `address`, `status`.
- `Vendor.js`: `userRef`, `businessName`, `description`, `logo`, `contactPhone`, `contactEmail`, `isVerified`, `rating`, `totalSales`.
- `Vehicle.js`: `title`, `brand`, `model`, `year`, `price`, `description`, `condition` (`NEW`, `USED`), `mileage`, `rangeKm`, `batteryCapacityKwh`, `chargingTimeHours`, `topSpeedKmh`, `seatingCapacity`, `bodyType`, `location`, `features` (array), `images` (array), `vendor` (ref), `status` (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `SOLD`), `rejectionReason`, `ratingsAverage`, `ratingsQuantity`.
- `Category.js`: `name`, `slug`, `description`, `icon`.
- `Cart.js`: `user` (ref), `items` (`vehicle` ref, `priceAtAddition`, `quantity`).
- `Wishlist.js`: `user` (ref), `vehicles` (array of `Vehicle` refs).
- `Order.js`: `orderNumber`, `customer` (ref), `items` (array of items with `vehicle`, `price`, `vendor`), `shippingAddress`, `paymentInfo` (`id`, `status`, `method`), `pricing` (`subtotal`, `tax`, `deliveryFee`, `totalPrice`), `orderStatus` (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`), `statusHistory`.
- `Review.js`: `vehicle` (ref), `user` (ref), `order` (ref), `rating` (1-5), `comment`, `createdAt`.
- `Notification.js`: `user` (ref), `title`, `message`, `type`, `read`, `link`.
- `Payment.js`: `order` (ref), `user` (ref), `stripePaymentIntentId`, `amount`, `currency`, `status`.

### Phase 3: Database Seeding & Mock Data (`backend/src/seeders/`)
- Seed database with realistic EVs: Tesla Model 3, Tesla Model Y, Tata Nexon EV, Tata Curvv EV, Mahindra XUV400, Hyundai Ioniq 5, MG ZS EV, Kia EV6, BMW iX1, Mercedes EQB.
- Seed customers, verified vendors, admin account, categories, and sample reviews.

### Phase 4: Backend API Controllers, Services & Routes (`backend/src/`)
- Auth: `/api/v1/auth/register`, `/login`, `/me`, `/profile`
- Vehicles: `/api/v1/vehicles` (Search, Filter, Sort, Pagination, Natural Language Filter, Details)
- Cart & Wishlist: `/api/v1/cart`, `/api/v1/wishlist`
- Checkout & Payments: `/api/v1/payments/create-intent`, `/verify-payment`, Stripe Webhooks
- Orders: `/api/v1/orders`, `/my-orders`, `/:id/track`, `/status-update`
- Vendor: `/api/v1/vendor/dashboard`, `/my-vehicles`, `/orders`, `/sales`
- Admin: `/api/v1/admin/dashboard`, `/users`, `/vendors`, `/vehicles/approvals`, `/analytics`
- Calculators & AI: `/api/v1/calculators`, `/api/v1/recommendations`
- Reviews & Notifications: `/api/v1/reviews`, `/api/v1/notifications`

### Phase 5: Frontend Design System & Theme Engine (`frontend/src/`)
- Dark & Light mode toggle with persistent state in `localStorage` & html class `dark`.
- Toast notification context & standard reusable UI components (`Button`, `Card`, `Badge`, `Modal`, `Input`, `Select`, `Skeleton`, `EmptyState`, `ErrorState`).

### Phase 6: Core Customer Application Pages
- **Homepage**: Hero, Featured EVs (live DB data), Category Grid, EV Benefits, Interactive Calculators teaser, AI recommendation widget.
- **Explore Marketplace (`/vehicles`)**: Multi-faceted filter sidebar (Price, Brand, Year, Range, Battery, Body type, Condition, Location), Search bar, Natural Language query parser, Sort options, Pagination.
- **Vehicle Details (`/vehicles/:id`)**: Gallery, spec sheet, range & battery breakdown, seller info, add to cart/wishlist/compare buttons, verified customer reviews.
- **Vehicle Comparison (`/compare`)**: Up to 4 EVs comparison table with automatic badge highlights for Best Price, Best Range, Fastest Charging, Best Rating, Best Overall Value.
- **Wishlist & Cart Pages (`/wishlist`, `/cart`)**: MongoDB backend synced cart & wishlist with stock validation & price calculations.
- **Checkout & Stripe Payment (`/checkout`)**: Multi-step checkout with live Stripe Element / Payment Intent backend verification.
- **Order Tracking (`/orders`, `/orders/:id/track`)**: Real-time visual timeline showing order progression from Placed to Delivered.

### Phase 7: EV Tools & AI Recommendation Engine
- **EV Range & Charging Cost Calculators (`/tools`)**: Real-time interactive calculations for daily usage, annual fuel savings vs ICE, charging costs.
- **AI Recommendation Engine (`/recommendations`)**: Natural language + structured criteria input. System queries MongoDB candidates, ranks them using AI prompt (or intelligent fallback rule engine), and returns personalized matched EVs with rationale.

### Phase 8: Vendor Portal (`/vendor/*`)
- **Vendor Dashboard**: MongoDB live metrics (Active listings, Revenue, Orders, Pending approvals, Rating), Sales chart with Recharts.
- **Listing Management**: Add EV listing with rich spec form & multi-image support, View/Edit/Delete listings, Mark Sold, track listing status (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`).
- **Vendor Order Fulfillment**: Manage customer orders, update delivery status with timeline tracking.

### Phase 9: Admin Portal (`/admin/*`)
- **Admin Dashboard**: Live system analytics, user growth, sales charts, revenue metrics, category distribution.
- **Listing Approvals**: Review pending EV submissions with Approve / Reject + Rejection reason workflow.
- **User & Vendor Management**: Manage user roles, suspend/activate vendors and users.
- **Order & Review Oversight**: Global order monitoring and review moderation.

### Phase 10: Security, Performance & QA Polish
- Password hashing with bcrypt, JWT token expiry & authorization middleware.
- MongoDB query sanitization, CORS, Helmet security headers, rate limiting.
- Responsive testing (320px to 1440px+), keyboard accessibility (ARIA), loading skeletons, error boundaries.
- Full documentation (`README.md`, `.env.example`).

---

## Verification Plan

### Automated & System Verification
1. `cd backend && npm test` or node-based API verification script.
2. Build checks for both backend and frontend (`npm run build` in frontend).
3. Full DB Seed check: verify 10+ realistic EVs, categories, sample users/vendors, and reviews in MongoDB.

### Manual End-to-End Verification
- **Customer Flow**: Register/Login -> Browse Marketplace -> Natural Language Filter -> View Details -> Add to Compare -> Add to Cart -> Checkout & Payment -> Track Order -> Submit Review.
- **Vendor Flow**: Register Vendor -> Add EV Listing -> Check Pending Status -> Receive Order -> Update Order Status -> Check Revenue Analytics.
- **Admin Flow**: Login Admin -> Admin Dashboard -> Approve Pending Vendor EV -> Manage Users -> View Platform Analytics.
- **EV Intelligence**: Calculate Range & Charging Cost -> Run AI Vehicle Finder & verify results come from live MongoDB records.
- **UI Responsiveness & Theme**: Toggle Dark/Light mode, test on Mobile layout viewport.
