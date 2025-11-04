<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Multi-Vendors E-commerce Platform

<p align="center">A robust and scalable multi-vendor e-commerce platform built with NestJS and GraphQL.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

## 🚀 Project Overview

Multi-Vendors is a modern e-commerce solution that connects multiple sellers with customers in a single marketplace. The platform handles everything from user authentication to order processing, with features like real-time cart management, secure payments via Stripe, and a comprehensive review system.

## 💻 Tech Stack

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **API:** [GraphQL](https://graphql.org/) with Apollo Server
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT with @nestjs/jwt
- **Queue Management:** BullMQ
- **Payment Processing:** Stripe
- **Caching:** Redis
- **Email Service:** Nodemailer
- **Testing:** Jest

## 🏗 Architecture

The application follows a modular architecture based on NestJS's powerful module system:

- **Core Modules:**
  - Auth Module (Authentication & Authorization)
  - Users Module (User Management)
  - Vendors Module (Seller Management)
  - Products Module (Product Management)
  - Orders Module (Order Processing)
  - Cart Module (Shopping Cart Management)
  - Stripe Module (Payment Processing)
- **Supporting Modules:**
  - BullMQ Module (Queue Management)
  - Email Module (Email Notifications)
  - Redis Module (Caching)
  - DataLoader Module (Efficient Data Loading)

## ✨ Features

- **User Management**
  - Authentication & Authorization
  - Role-based access control
  - User profiles and preferences

- **Vendor Features**
  - Vendor registration and verification
  - Product management
  - Order management
  - Analytics and reporting

- **Shopping Experience**
  - Real-time cart management
  - Secure checkout process
  - Order tracking
  - Product reviews and ratings

- **Payment Integration**
  - Secure payment processing via Stripe
  - Multiple payment methods support
  - Transaction history

## 📁 Folder Structure

```
src/
├── auth/           # Authentication and authorization
├── bullmq/         # Queue management
├── cart/           # Shopping cart functionality
├── clients/        # Client management
├── comments/       # Product comments/reviews
├── email/          # Email service
├── orders/         # Order processing
├── products/       # Product management
├── stripe/         # Payment processing
├── users/          # User management
├── vendors/        # Vendor management
└── wallet/         # Digital wallet functionality
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmedhasssan1/multi-vendors.git
   cd multi-vendors
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in required environment variables

4. **Start the development server**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

5. **Access the GraphQL Playground**
   - Open `http://localhost:3000/graphql` in your browser

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔮 Future Improvements

- [ ] Implementation of WebSocket for real-time features
- [ ] Advanced analytics dashboard for vendors
- [ ] Mobile application support
- [ ] AI-powered product recommendations
- [ ] Multi-language support
- [ ] Advanced search functionality with filters
- [ ] Bulk product import/export functionality

## 📸 Screenshots

[Coming Soon]

## 🔗 Connect With Us

- GitHub: [@ahmedhasssan1](https://github.com/ahmedhasssan1)

- Email: ah1585229@gmail.com

## 📝 License

This project is [MIT licensed](LICENSE).
