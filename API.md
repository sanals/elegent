# Elegent Electronics Store API Documentation

This document describes the API endpoints provided by the ElectronicStoreAPI backend service, which serves both the customer frontend and admin dashboard.

## Base URL

```
http://localhost:8090/api/v1
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

### Auth Endpoints

| Method | Endpoint           | Description               | Request Body                                 | Response                      |
|--------|-------------------|---------------------------|----------------------------------------------|-------------------------------|
| POST   | `/auth/login`      | User login                | `{ email: string, password: string }`       | `{ token: string, user: User }` |
| POST   | `/auth/register`   | Register new customer     | `{ email, password, firstName, lastName }`  | `{ token: string, user: User }` |
| POST   | `/auth/refresh`    | Refresh token             | `{ token: string }`                         | `{ token: string }`           |

## Products

| Method | Endpoint                      | Description               | Auth Required | Role     |
|--------|------------------------------|---------------------------|--------------|----------|
| GET    | `/products`                   | List all products         | No           | -        |
| GET    | `/products/{id}`              | Get product details       | No           | -        |
| GET    | `/products/featured`          | List featured products    | No           | -        |
| GET    | `/products/category/{id}`     | List by category          | No           | -        |
| POST   | `/products`                   | Create product            | Yes          | ADMIN    |
| PUT    | `/products/{id}`              | Update product            | Yes          | ADMIN    |
| DELETE | `/products/{id}`              | Delete product            | Yes          | ADMIN    |

### Query Parameters for Product Listing

- `page`: Page number (default: 0)
- `size`: Page size (default: 10)
- `sort`: Sort field (default: "id,asc")
- `search`: Search term (optional)
- `minPrice`: Minimum price (optional)
- `maxPrice`: Maximum price (optional)

## Categories

| Method | Endpoint                    | Description               | Auth Required | Role     |
|--------|-----------------------------|---------------------------|--------------|----------|
| GET    | `/categories`               | List all categories       | No           | -        |
| GET    | `/categories/{id}`          | Get category details      | No           | -        |
| GET    | `/categories/parent/{id}`   | List subcategories        | No           | -        |
| POST   | `/categories`               | Create category           | Yes          | ADMIN    |
| PUT    | `/categories/{id}`          | Update category           | Yes          | ADMIN    |
| DELETE | `/categories/{id}`          | Delete category           | Yes          | ADMIN    |

## Orders

| Method | Endpoint                     | Description               | Auth Required | Role     |
|--------|------------------------------|---------------------------|--------------|----------|
| GET    | `/orders`                    | List all orders           | Yes          | ADMIN    |
| GET    | `/orders/my-orders`          | List user orders          | Yes          | CUSTOMER |
| GET    | `/orders/{id}`               | Get order details         | Yes          | BOTH     |
| POST   | `/orders`                    | Create order              | Yes          | CUSTOMER |
| PUT    | `/orders/{id}/status`        | Update order status       | Yes          | ADMIN    |
| DELETE | `/orders/{id}`               | Cancel order              | Yes          | BOTH     |

## Users

| Method | Endpoint                     | Description               | Auth Required | Role     |
|--------|------------------------------|---------------------------|--------------|----------|
| GET    | `/users`                     | List all users            | Yes          | ADMIN    |
| GET    | `/users/{id}`                | Get user details          | Yes          | ADMIN    |
| GET    | `/users/profile`             | Get current user profile  | Yes          | BOTH     |
| PUT    | `/users/profile`             | Update user profile       | Yes          | BOTH     |
| PUT    | `/users/{id}/role`           | Update user role          | Yes          | ADMIN    |
| DELETE | `/users/{id}`                | Delete user               | Yes          | ADMIN    |

## Media Upload

| Method | Endpoint                    | Description               | Auth Required | Role     |
|--------|-----------------------------|---------------------------|--------------|----------|
| POST   | `/media/upload`             | Upload file               | Yes          | ADMIN    |
| DELETE | `/media/{filename}`         | Delete file               | Yes          | ADMIN    |

## Swagger Documentation

A live Swagger UI documentation is available at:

```
http://localhost:8090/swagger-ui.html
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "status": "error",
  "message": "Error message details",
  "timestamp": "2023-05-01T12:34:56Z",
  "path": "/api/v1/endpoint",
  "code": 400
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error 