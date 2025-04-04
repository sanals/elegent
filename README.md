# Elegent Electronics Store Platform

## Project Overview
This workspace contains three interrelated applications that together form a complete electronics store solution:

1. **ElectronicStore Frontend** (`electronicstore/`) - Customer-facing React application
2. **ElectronicStoreAdmin** (`electronicstoreadmin/`) - Admin dashboard React application 
3. **ElectronicStoreAPI** (`electronicstoreapi/`) - Java Spring Boot backend API

## Architecture & Communication

### Communication Flow
```
┌──────────────────┐    ┌───────────────────────┐
│  ElectronicStore │    │ ElectronicsStoreAdmin │
│    (Frontend)    │    │     (Admin UI)        │
└────────┬─────────┘    └────────┬──────────────┘
         │                       │
         │                       │
         │ HTTP/REST             │ HTTP/REST
         │                       │
         ▼                       ▼
┌────────────────────────────────────────┐
│          ElectronicStoreAPI            │
│         (Spring Boot Backend)          │
└────────────────────────────────────────┘
```

## API Endpoints & Integration

The Spring Boot backend (`electronicstoreapi`) serves both the customer frontend and admin dashboard through shared and role-specific API endpoints:

- `/api/v1/auth/*` - Authentication endpoints (login, register)
- `/api/v1/products/*` - Product management
- `/api/v1/categories/*` - Category management
- `/api/v1/orders/*` - Order processing
- `/api/v1/users/*` - User management (admin only)

## Development Setup

### 1. Start the Backend API
```
cd electronicstoreapi
./mvnw spring-boot:run
```
The API will be available at http://localhost:8090

### 2. Start the Admin Dashboard
```
cd electronicstoreadmin
npm run dev
```
The admin UI will be available at http://localhost:3003

### 3. Start the Customer Frontend
```
cd electronicstore
npm run dev
```
The customer UI will be available at http://localhost:3000

## Configuration

Each application has its own configuration files:

- `electronicstoreapi/src/main/resources/application.properties` - Backend settings
- `electronicstoreadmin/.env` - Admin UI environment variables
- `electronicstore/.env` - Customer UI environment variables

## Shared Resources

All applications share the following resources:
- Common domain models (represented as TypeScript interfaces in frontends)
- API endpoints documentation (via SpringDoc OpenAPI)
- Authentication mechanism (JWT tokens)

## Project Objectives

This project aims to:
1. Provide a complete e-commerce solution for electronics products
2. Demonstrate a modern microservices architecture
3. Showcase best practices in full-stack development
4. Support seamless admin and customer experiences

## Contributing

When working on this project, please ensure:
1. Backend changes are tested against both frontends
2. API changes are documented and communicated to frontend developers
3. Frontend changes maintain consistency in design and UX 