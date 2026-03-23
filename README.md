# 🥭 FreshCart

A full-stack e-commerce platform for premium farm-direct mango delivery, built for the Indian market. Features a customer storefront with OTP-based authentication, Razorpay payments, and a comprehensive admin panel.

## Features

### Customer

- **OTP Login** — Mobile number authentication via Twilio SMS
- **Product Catalog** — Search, category filter, sorting, and pagination
- **Shopping Cart** — Add, update, remove items with stock-aware quantity control
- **Razorpay Checkout** — Secure payments with signature verification (demo mode fallback for development)
- **Order Tracking** — Order history with status timeline
- **Product Reviews** — Rate and review purchased products
- **Google Reviews** — View Google Places reviews alongside customer reviews
- **WhatsApp Notifications** — Order confirmation and delivery updates via WhatsApp Business API
- **Contact Form** — Customer inquiries with Google Maps integration

### Admin

- **Dashboard** — Revenue, orders, users, and product analytics
- **Order Management** — Filter, view details, and update order statuses
- **Product CRUD** — Create, edit, and delete products with Cloudinary image uploads
- **User Management** — View registered users
- **Review Moderation** — View and delete reviews
- **Real-time Notifications** — Socket.IO powered alerts for new orders

## Tech Stack

### Frontend

- **React 18** with React Router v6
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Framer Motion** for animations
- **Axios** with interceptors for API calls
- **Socket.IO Client** for real-time updates

### Backend

- **Node.js** with **Express**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication (httpOnly cookies + Bearer tokens)
- **Socket.IO** for real-time events
- **Razorpay** payment gateway
- **Twilio** for OTP SMS
- **Cloudinary** for image storage
- **WhatsApp Business API** (Meta Graph) for notifications
- **Google Places API** for reviews
- **PDFKit** & **json2csv** for exports

## Project Structure

```
client/                     # React frontend
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute, AdminRoute
│   │   ├── common/         # Loader, StarRating, WhatsAppButton
│   │   └── layout/         # Navbar, Footer, AdminLayout
│   ├── pages/
│   │   ├── admin/          # Admin dashboard, orders, products, users, reviews
│   │   └── ...             # Home, Shop, Cart, Checkout, Login, etc.
│   └── redux/
│       ├── api.js          # Axios instance
│       ├── store.js        # Redux store
│       └── slices/         # Auth, cart, product, order, admin slices
server/                     # Express backend
├── config/                 # DB connection, Cloudinary setup
├── controllers/            # Route handlers
├── middleware/              # Auth, error handling, file upload
├── models/                 # Mongoose schemas
├── routes/                 # API route definitions
├── services/               # OTP, WhatsApp, Google Reviews, Socket.IO
└── utils/                  # JWT token generation
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas) — falls back to in-memory MongoDB for development
- **npm**

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/freshcart

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Admin Credentials (auto-creates admin user)
ADMIN_EMAIL=admin@freshcart.com
ADMIN_PASSWORD=your_admin_password

# Razorpay (leave as placeholder for demo mode)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Twilio (OTP returned in response in development)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp Business API
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Google Places
GOOGLE_MAPS_API_KEY=your_google_api_key
GOOGLE_PLACE_ID=your_google_place_id
```

Create a `.env` file in the `client/` directory (optional):

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start the backend (from server/)
npm run dev

# Start the frontend (from client/)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Seed Data

```bash
# Seed the database with sample products (from server/)
npm run seed
```

## API Endpoints

| Resource        | Method | Endpoint                         | Auth     |
| --------------- | ------ | -------------------------------- | -------- |
| **Auth**        | POST   | `/api/auth/send-otp`             | Public   |
|                 | POST   | `/api/auth/verify-otp`           | Public   |
|                 | POST   | `/api/auth/admin/login`          | Public   |
|                 | GET    | `/api/auth/profile`              | User     |
|                 | PUT    | `/api/auth/profile`              | User     |
|                 | POST   | `/api/auth/logout`               | User     |
| **Products**    | GET    | `/api/products`                  | Public   |
|                 | GET    | `/api/products/:id`              | Public   |
|                 | POST   | `/api/products`                  | Admin    |
|                 | PUT    | `/api/products/:id`              | Admin    |
|                 | DELETE | `/api/products/:id`              | Admin    |
| **Cart**        | GET    | `/api/cart`                      | User     |
|                 | POST   | `/api/cart/add`                  | User     |
|                 | PUT    | `/api/cart/update/:itemId`       | User     |
|                 | DELETE | `/api/cart/remove/:itemId`       | User     |
|                 | DELETE | `/api/cart/clear`                | User     |
| **Orders**      | POST   | `/api/orders`                    | User     |
|                 | GET    | `/api/orders/my-orders`          | User     |
|                 | GET    | `/api/orders/:id`                | User     |
|                 | GET    | `/api/orders/admin/all`          | Admin    |
|                 | GET    | `/api/orders/admin/stats`        | Admin    |
|                 | PUT    | `/api/orders/admin/:id/status`   | Admin    |
| **Payment**     | POST   | `/api/payment/create-order`      | User     |
|                 | POST   | `/api/payment/verify`            | User     |
| **Reviews**     | GET    | `/api/reviews/google`            | Public   |
|                 | GET    | `/api/reviews/all`               | Public   |
|                 | GET    | `/api/reviews/:productId`        | Public   |
|                 | POST   | `/api/reviews/:productId`        | User     |
|                 | DELETE | `/api/reviews/:reviewId`         | Admin    |
| **Stats**       | GET    | `/api/stats/live`                | Public   |
|                 | GET    | `/api/stats/admin`               | Admin    |
| **Contact**     | POST   | `/api/contact`                   | Public   |
|                 | GET    | `/api/contact`                   | Admin    |
| **Notifications** | GET  | `/api/notifications`             | Admin    |
|                 | PUT    | `/api/notifications/read-all`    | Admin    |
|                 | PUT    | `/api/notifications/:id/read`    | Admin    |
| **Users**       | GET    | `/api/users`                     | Admin    |
| **Health**      | GET    | `/api/health`                    | Public   |

## License

This project is for educational and personal use.
