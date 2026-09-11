# Sarhad Electrics — Enterprise E-Commerce Platform

A high-performance e-commerce platform specializing in smart electronics, home appliances, and electrical tools. Features a futuristic dark-mode UI with neon cyan (`#00E5FF`) and magenta (`#EC4899`/`#A855F7`) accents, built with modern full-stack web technologies.

---

## 🏛 Architecture Overview

```text
Sarhad Electronic/
├── frontend/                  # React + TypeScript Customer-Facing Storefront (Port 5173)
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProductCard, TrustMetrics, PromoBanner, etc.
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── pages/             # Home, Shop, ProductDetail, About, Contact, Login, Register
│   │   ├── services/          # Axios client with offline/dev fallbacks
│   │   └── types/             # TypeScript interfaces
│   └── vite.config.ts
│
├── admin-panel/               # React + TypeScript Operations Dashboard (Port 5174)
│   ├── src/
│   │   ├── components/        # AdminSidebar, AdminHeader, DataTables
│   │   ├── context/           # AdminAuthContext
│   │   ├── pages/             # Dashboard, ManageProducts, Orders, Messages
│   │   └── services/          # Admin REST client
│   └── vite.config.ts
│
└── backend/                   # Express.js + TypeScript REST API (Port 5000)
    ├── prisma/
    │   ├── migrations/
    │   ├── schema.prisma      # Supabase PostgreSQL schema with Prisma ORM
    │   └── seed.ts            # Seed script for categories, users & catalog
    ├── src/
    │   ├── config/            # Prisma Client singleton, Cloudinary SDK
    │   ├── controllers/       # auth, product, category, order, contact, user
    │   ├── middlewares/       # JWT auth guard, Admin RBAC, Multer upload, Error handler
    │   ├── routes/            # Express router definitions
    │   └── index.ts           # Server bootstrap
    └── .env
```

---

## 🗄 Database Schema (PostgreSQL via Prisma ORM)

Located at `backend/prisma/schema.prisma`:
- **`users`**: Account authentication, full name, email, password hash, role (`USER` | `ADMIN`), avatar.
- **`categories`**: Smart Gadgets, Modern Lighting, Home Appliances, Electrical Tools.
- **`products`**: Pricing, stock levels, brand, category foreign keys, Cloudinary image URLs, reviews & ratings.
- **`orders`**: Checkout records, status (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), shipping address, phone, COD / Bank payment methods.
- **`order_items`**: Pivot relations linking orders and products with purchase snapshots.
- **`contact_messages`**: Submissions from the contact page (Peshawar showroom inquiries).
- **`subscribers`**: Newsletter emails.

---

## 🚀 Quick Start Guide

### 1. Backend REST API (Port 5000)
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Health Check:* `http://localhost:5000/api/health`

### 2. Customer Storefront (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Storefront URL:* `http://localhost:5173`

### 3. Admin Command Dashboard (Port 5174)
```bash
cd admin-panel
npm install
npm run dev
```
*Admin Dashboard URL:* `http://localhost:5174`
*Default Admin Credentials:* `khankhansarmad9@gmail.com` / `Pakistan123@`

---

## ⚡ Key Features

- **Futuristic Dark Neon UI:** Tailored with midnight blue (`#081021`), surface glassmorphism cards (`#1E293B`), bright cyan actions (`#00E5FF`), and purple highlights.
- **Dynamic Catalog Discovery:** Instant search, category pill filtering, sort by price (asc/desc) and newest first.
- **Persistent Shopping Cart & Checkout:** Flyout cart drawer with quantity adjustments and Cash on Delivery order placement.
- **Physical Store Details:** Integrated showroom info (Shop No. 57 Raheem Plaza, Board Bazar, University Road, Peshawar) and direct phone line (`03351950058`).
- **Resilient Fallback Mode:** The backend and frontends automatically operate with built-in rich demo fixtures if Supabase is still connecting, ensuring instant testability.

