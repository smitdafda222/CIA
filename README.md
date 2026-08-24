# ITUE301: Advanced Web Development Frameworks
## SET A: QuickBite Food Ordering System

**Student Roll Number**: `24ce021`  
**GitHub Repository**: `https://github.com/smitdafda222/CIE`  
**Tech Stack**: React (frontend) + Express.js (backend) + MongoDB with Mongoose  

---

### Project Overview
QuickBite is an end-to-end full-stack web application designed for food ordering. Customers can browse restaurants, filter by cuisine/name, and place orders online. Restaurant owners and admins can manage incoming orders and platform restaurants.

---

### Folder Structure
```
CIA/
├── backend/
│   ├── middleware/
│   │   ├── authGuard.js       # Custom authGuard middleware validating Bearer JWT
│   │   └── logger.js          # Custom requestLogger middleware logging [METHOD] [PATH] [TIMESTAMP]
│   ├── models/
│   │   ├── Customer.js        # Mongoose schema for Customer
│   │   ├── Restaurant.js      # Mongoose schema for Restaurant
│   │   ├── Order.js           # Mongoose schema for Order (with references and enum validation)
│   │   └── db-fallback.js     # In-memory dataset fallback
│   ├── routes/
│   │   └── api.js             # Express REST API endpoints (/api/v1/...)
│   ├── .env                   # Database connection string and PORT
│   ├── .env.example           # Example environment template
│   ├── package.json           # Backend dependencies
│   └── server.js              # Entrypoint server script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global navigation bar
│   │   │   ├── ProtectedRoute.jsx   # Auth guard route wrapper redirecting to /
│   │   │   └── RestaurantCard.jsx   # Reusable component with dynamic status styling
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global Auth state context { customer, token }
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Landing page /
│   │   │   ├── RestaurantsPage.jsx  # /restaurants with API fetch & client-side search filter
│   │   │   ├── OrderPage.jsx        # /order protected page with live summary & history
│   │   │   └── AdminPanel.jsx       # /admin lazy-loaded panel (React.lazy + Suspense)
│   │   ├── App.jsx                  # Main router setup
│   │   └── main.jsx                 # Vite React entry point
│   ├── package.json
│   └── vite.config.js
│
├── README.md                        # Documentation
├── .env                             # Root environment file
└── .env.example                     # Root environment example template
```

---

### Setup & Installation Instructions

#### 1. Prerequisites
- Node.js (v18+)
- MongoDB Server running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

#### 2. Backend Setup
```bash
cd backend
npm install
node server.js
# or
npm start
```
The server will start on `http://localhost:5000` and automatically connect to MongoDB via Mongoose, seeding default data into the `quickbite` database.

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Vite dev server will start on `http://localhost:3000`.

---

### REST API Endpoints (`/api/v1/`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticate customer and issue JWT token |
| `GET` | `/api/v1/restaurants` | Public | Return all restaurants |
| `POST` | `/api/v1/restaurants` | Admin | Create a new restaurant |
| `POST` | `/api/v1/orders` | Protected | Create a new order (validated and saved to MongoDB) |
| `GET` | `/api/v1/orders` | Protected | Return all orders for logged-in customer (with Mongoose `.populate()`) |
| `PATCH` | `/api/v1/orders/:id/status` | Protected | Update order status |

---

### Key Features Implemented

1. **Task 1: React Component Architecture**
   - Reusable `RestaurantCard` component displaying `name`, `cuisine`, `rating`, and `isOpen` badge ("Open Now" / "Closed").
   - Multi-page setup: HomePage, RestaurantsPage, OrderPage, AdminPanel.

2. **Task 2: React Routing and State Management**
   - React Router configuration with `<Link>` / `<NavLink>` navigation.
   - `OrderPage` protected via `ProtectedRoute` wrapper redirecting unauthenticated users to `/`.
   - `AdminPanel` lazy-loaded with `React.lazy()` + `<Suspense>`.
   - `AuthContext` holding `{ customer, token }`.
   - Live Order Summary updating in real-time on `OrderPage` state changes.

3. **Task 3: Express REST API + Middleware**
   - Endpoints under `/api/v1/`.
   - Global custom `requestLogger` middleware logging `[METHOD] [PATH] [TIMESTAMP]`.
   - Custom `authGuard` middleware validating Bearer token header.
   - Structured JSON error handler middleware.

4. **Task 4: REST API Consumption in React**
   - `RestaurantsPage` fetches `/api/v1/restaurants` on mount using `useEffect()`.
   - Maintains `restaurants`, `loading`, and `error` states.
   - Client-side search input filtering the array by name or cuisine without re-fetching.

5. **Task 5: MongoDB + Mongoose Schema Design and Validation**
   - Mongoose schemas for `Customer`, `Restaurant`, `Order`.
   - Mongoose references (`customerId` -> Customer, `restaurantId` -> Restaurant).
   - Validation rules (required, unique, min, enum: `pending`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`).
   - `.populate('customerId', 'name email')` and `.populate('restaurantId', 'name cuisine')` on orders GET endpoint.
