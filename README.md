# 📱 Mobil Masr - E-Commerce Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

**A full-featured RESTful API for a mobile phones and electronics e-commerce platform**

</div>

---

## 👥 Team Members

- Abdullah
- Mostafa
- Ghehad
- Rehab
- Heba

---

## 📌 About the Project

**Mobil Masr** is a comprehensive e-commerce backend solution for selling mobile phones and electronics in Egypt. Built with Node.js and Express.js, this API provides all the necessary endpoints to power a modern online store with AI-powered features.

### 🌟 Key Features

- **🛒 Complete E-Commerce Flow** - Products, Cart, Wishlist, Orders
- **🤖 AI-Powered Assistant** - Smart product recommendations using OpenAI GPT-4
- **💳 Payment Integration** - Secure payments via Stripe (Online & COD)
- **👤 User Management** - Authentication, Google OAuth, Role-based access
- **🏪 Multi-Vendor Support** - Vendors can list and manage their products
- **📊 Admin Dashboard** - Analytics, Revenue tracking, User management
- **🌐 Bilingual Support** - Arabic & English content for products
- **📷 Cloud Storage** - Image uploads via Cloudinary
- **📄 API Documentation** - Swagger UI integration

---

## 🏗️ Project Structure

```
├── app.js                 # Application entry point
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── connectDB.js       # MongoDB connection
│   └── stripeClient.js    # Stripe configuration
├── controllers/           # Request handlers
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── aiController.js
│   └── ...
├── models/                # MongoDB schemas
│   ├── productModel.js
│   ├── userModel.js
│   ├── orderModel.js
│   └── ...
├── routes/                # API routes
├── middleware/            # Custom middleware
├── services/              # Business logic
│   ├── aiService.js       # OpenAI integration
│   └── ragService.js      # RAG for recommendations
├── features/              # Feature modules
│   ├── recommend.js       # AI recommendations
│   ├── compare.js         # Product comparison
│   └── chat.js            # AI chat assistant
└── utils/                 # Utility functions
```

---

## 🚀 API Endpoints

**Total Endpoints: 57**

### 🔐 Authentication & User Management (7 endpoints)

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/auth/register`        | Register new user     |
| POST   | `/auth/login`           | User login            |
| POST   | `/auth/google-login`    | Google OAuth login    |
| GET    | `/auth/profile`         | Get user profile      |
| PUT    | `/auth/profile`         | Update user profile   |
| PUT    | `/auth/change-password` | Change password       |
| GET    | `/auth/check`           | Verify token validity |

### 📦 Products (5 endpoints)

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/products`     | Get all products (filters) |
| GET    | `/products/:id` | Get product by ID          |
| POST   | `/products`     | Create product (Admin)     |
| PUT    | `/products/:id` | Update product (Admin)     |
| DELETE | `/products/:id` | Delete product (Admin)     |

### 🏷️ Categories (5 endpoints)

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/categories`     | Get all categories |
| GET    | `/categories/:id` | Get category by ID |
| POST   | `/categories`     | Create category    |
| PUT    | `/categories/:id` | Update category    |
| DELETE | `/categories/:id` | Delete category    |

### 🏢 Brands (5 endpoints)

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| GET    | `/brands`     | Get all brands  |
| GET    | `/brands/:id` | Get brand by ID |
| POST   | `/brands`     | Create brand    |
| PUT    | `/brands/:id` | Update brand    |
| DELETE | `/brands/:id` | Delete brand    |

### 🏪 Vendors (5 endpoints)

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/vendors`     | Get all vendors       |
| GET    | `/vendors/:id` | Get vendor by ID      |
| POST   | `/vendors`     | Create vendor (Admin) |
| PUT    | `/vendors/:id` | Update vendor (Admin) |
| DELETE | `/vendors/:id` | Delete vendor (Admin) |

### 🛒 Cart (6 endpoints)

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/cart`          | Get user's cart        |
| POST   | `/cart/add`      | Add item to cart       |
| PUT    | `/cart/update`   | Update quantity        |
| PUT    | `/cart/remove`   | Remove item            |
| DELETE | `/cart/clear`    | Clear cart             |
| POST   | `/cart/checkout` | Create order from cart |

### ❤️ Wishlist (4 endpoints)

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| GET    | `/wishlist`        | Get user's wishlist    |
| POST   | `/wishlist`        | Add to wishlist        |
| DELETE | `/wishlist/remove` | Remove from wishlist   |
| DELETE | `/wishlist`        | Delete entire wishlist |

### 📋 Orders (6 endpoints)

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/orders`           | Create new order            |
| GET    | `/orders/user`      | Get user's orders           |
| GET    | `/orders/admin/all` | Get all orders (Admin)      |
| GET    | `/orders/:id`       | Get order by ID             |
| PUT    | `/orders/:id`       | Update order status (Admin) |
| DELETE | `/orders/:id`       | Delete order (Admin)        |

### 💳 Stripe Payment (2 endpoints)

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/stripe/create-checkout-session` | Create Stripe checkout session |
| GET    | `/stripe/verify-session`          | Verify payment session         |

### 🤖 AI Features (1 endpoint)

| Method | Endpoint | Description                             |
| ------ | -------- | --------------------------------------- |
| POST   | `/ai`    | AI assistant (chat, recommend, compare) |

### ⭐ Site Reviews (3 endpoints)

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | `/reviews`     | Add site review      |
| GET    | `/reviews`     | Get all site reviews |
| DELETE | `/reviews/:id` | Delete review        |

### 👨‍💼 Admin Panel (6 endpoints)

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/admin/users`           | Get all users                |
| GET    | `/admin/users/:id`       | Get user by ID               |
| PUT    | `/admin/users/:id`       | Update user by admin         |
| DELETE | `/admin/users/:id`       | Delete user by admin         |
| PUT    | `/admin/profile-picture` | Update admin profile picture |
| POST   | `/admin/ai-chat`         | Admin AI chat                |

### 📊 Dashboard (1 endpoint)

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/dashboard/overview` | Dashboard statistics |

### 📈 Visits Tracking (1 endpoint)

| Method | Endpoint  | Description  |
| ------ | --------- | ------------ |
| POST   | `/visits` | Track visits |

---

## 🔧 Tech Stack

| Category           | Technology                  |
| ------------------ | --------------------------- |
| **Runtime**        | Node.js                     |
| **Framework**      | Express.js 5                |
| **Database**       | MongoDB + Mongoose          |
| **Authentication** | JWT + bcrypt + Google OAuth |
| **Payments**       | Stripe                      |
| **AI/ML**          | OpenAI GPT-4                |
| **File Upload**    | Multer + Cloudinary         |
| **Validation**     | Express Validator           |
| **Documentation**  | Swagger UI                  |

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB
- Stripe Account
- Cloudinary Account
- OpenAI API Key

### 1. Clone the repository

```bash
git clone https://github.com/Abdullah-Nasr10/Backend-MobileMasr.git
cd Backend-MobileMasr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Swagger
swaggerURL=http://localhost:5000
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Access API Documentation

Open your browser and navigate to:

```
http://localhost:5000/api-docs
```

---

## 🤖 AI Features Explained

### Smart Product Recommendations

The system uses **RAG (Retrieval-Augmented Generation)** to provide personalized product recommendations based on:

- User's purchase history
- Current cart items
- Product specifications and prices
- User's budget preferences

### AI Chat Assistant

An intelligent chatbot that can:

- Answer questions about products
- Help users find the right phone/laptop
- Provide comparisons between products
- Assist with order-related queries

---

## 📱 Product Schema Highlights

- **Bilingual Support**: Product names, descriptions in Arabic & English
- **Detailed Specs**: RAM, Storage, Processor, GPU, Camera, Battery
- **Pricing**: Original price, discount percentage, calculated final price
- **Condition**: New or Used products
- **Warranty**: Guarantee information

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User, Vendor, Admin)
- Secure payment processing via Stripe
- Input validation and sanitization

---

## 📄 License

This project is part of the MEARN Track graduation project.

---

<div align="center">

**Made with ❤️ by the Mobil Masr Team**

</div>
