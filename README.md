# ⚙️ ClothStore Backend API

This is the core engine of the ClothStore E-commerce platform. It handles data management, security, and third-party integrations to ensure a smooth shopping experience.

## 🚀 Features
- **RESTful API:** Clean and structured endpoints for Products, Users, and Orders.
- **Authentication:** Secure user login and registration using **JWT (JSON Web Tokens)**.
- **Payment Integration:** Seamless payment processing via **Stripe** and **SSLCommerz**.
- **Media Management:** AI-powered image uploads and storage using **Cloudinary**.
- **Database:** Optimized data modeling with **MongoDB** and **Mongoose**.
- **Security:** Protected routes and password hashing using **Bcrypt**.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Tools:** Mongoose, Axios, Cors, Dotenv

## 📂 API Endpoints (Quick Look)

### 🛍️ Products
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (Admin Only)

### 👤 User
- `POST /api/user/login` - User authentication
- `POST /api/user/register` - Create new account

### 📦 Orders
- `POST /api/order/place` - Cash on Delivery
- `POST /api/order/stripe` - Stripe Payment integration

## 🛠️ Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/sharifulNext/cloth-store-backend.git](https://github.com/sharifulNext/cloth-store-backend.git)
