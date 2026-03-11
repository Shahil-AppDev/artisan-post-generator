# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "company_name": "My Company",
  "phone": "06 12 34 56 78",
  "website": "https://mycompany.fr"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "company_name": "My Company",
    "phone": "06 12 34 56 78",
    "website": "https://mycompany.fr",
    "is_admin": false
  }
}
```

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### GET /auth/me
Get current user information (requires authentication).

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "company_name": "My Company",
    "is_admin": false
  }
}
```

---

## Post Endpoints

### POST /posts/create
Create a new post with images (requires authentication).

**Request:** multipart/form-data
- `job_type`: string (required) - One of: climatisation, plomberie, depannage_plomberie, chauffe_eau, froid_commercial, autre
- `user_comment`: string (optional)
- `images`: files (1-5 images required)

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "job_type": "climatisation",
    "post_text": "Generated post text...",
    "user_comment": "Optional comment",
    "images": ["url1", "url2"],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /posts
Get all posts for current user (requires authentication).

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### GET /posts/:id
Get a specific post (requires authentication).

**Response:**
```json
{
  "post": {
    "id": 1,
    "job_type": "climatisation",
    "post_text": "...",
    "images": [...],
    "sent_to_automation": false,
    "created_at": "..."
  }
}
```

### PUT /posts/:id
Update post text (requires authentication).

**Request Body:**
```json
{
  "post_text": "Updated post text..."
}
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": { ... }
}
```

### POST /posts/:id/send-to-automation
Send post to n8n webhook (requires authentication).

**Response:**
```json
{
  "message": "Post sent to automation successfully",
  "webhook_response": {
    "success": true,
    "status": 200,
    "data": { ... }
  }
}
```

### DELETE /posts/:id
Delete a post (requires authentication).

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

## User Endpoints

### GET /users/profile
Get current user profile (requires authentication).

### PUT /users/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "company_name": "Updated Company",
  "phone": "06 12 34 56 78",
  "website": "https://newsite.fr"
}
```

### POST /users/change-password
Change user password (requires authentication).

**Request Body:**
```json
{
  "current_password": "oldpass",
  "new_password": "newpass123"
}
```

---

## Admin Endpoints

All admin endpoints require authentication + admin role.

### GET /admin/users
Get all users with pagination.

### GET /admin/posts
Get all posts from all users with pagination.

### DELETE /admin/posts/:id
Delete any post.

### DELETE /admin/users/:id
Delete a user account.

### GET /admin/stats
Get platform statistics.

**Response:**
```json
{
  "stats": {
    "total_users": 10,
    "total_posts": 50,
    "automated_posts": 30
  },
  "recent_posts": [...]
}
```

### GET /admin/settings
Get system settings.

### PUT /admin/settings
Update system settings.

**Request Body:**
```json
{
  "key": "n8n_webhook_url",
  "value": "https://n8n.example.com/webhook/posts"
}
```

---

## Webhook Endpoints

### GET /webhook/logs
Get webhook execution logs (admin only).

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message description"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
