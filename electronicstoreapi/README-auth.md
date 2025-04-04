# Authentication System Documentation

## Overview

This application uses a JWT-based authentication system with refresh tokens for maintaining long-term sessions.

## Authentication Flow

1. **Login**: User provides credentials and receives an access token and refresh token
2. **API Access**: Access token is used as a Bearer token in the Authorization header
3. **Token Refresh**: When the access token expires, the refresh token is used to get a new access token
4. **Logout**: Invalidates the refresh token

## Refresh Token Storage Options

The application supports two different strategies for refresh token storage:

### 1. Database Storage (Default)

**Configuration**:
```yaml
jwt:
  refresh-token:
    storage: database
```

**Characteristics**:
- Refresh tokens are stored in the database
- Each user can have one active refresh token
- Tokens can be revoked server-side
- More secure against token theft (revocation is possible)
- Requires database queries for validation

### 2. JWT-Based Storage (Stateless)

**Configuration**:
```yaml
jwt:
  refresh-token:
    storage: jwt
```

**Characteristics**:
- Refresh tokens are signed JWTs, similar to access tokens
- Tokens are not stored in the database
- Stateless authentication (no server-side storage)
- Cannot be revoked server-side once issued
- Better performance (no database queries)
- Suitable for horizontally scaled applications

## How to Use Refresh Tokens

### 1. Login
```http
POST /api/v1/auth/login
{
  "username": "user",
  "password": "password"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "7c19c805-b770-45f4-ba03-910c08ade669", // or JWT string for jwt storage
  "username": "user",
  "role": "ADMIN"
}
```

### 2. API Access
Use the access token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 3. Refresh Token
When the access token expires (you get a 401 response), use the refresh token:

```http
POST /api/v1/auth/refresh-token
{
  "refreshToken": "7c19c805-b770-45f4-ba03-910c08ade669"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "7c19c805-b770-45f4-ba03-910c08ade669",
  "tokenType": "Bearer"
}
```

### 4. Logout
```http
POST /api/v1/auth/logout
```
- For database storage: Deletes the refresh token from the database
- For JWT storage: The client should discard the token

## Security Considerations

1. **Database Storage**:
   - More secure since tokens can be revoked
   - Better for sensitive applications
   - Consider database load with many users

2. **JWT Storage**:
   - Cannot be revoked server-side
   - Use shorter expiry times
   - Consider implementing a token blacklist for critical applications
   - Set proper security for the JWT secret key

## Implementation Details

- The system automatically handles both storage strategies
- No code changes needed when switching between strategies
- Configuration is done in `application.yml` 