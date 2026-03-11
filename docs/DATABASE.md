# Database Schema

PostgreSQL database schema for Artisan Post Generator.

## Tables

### users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | User ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| company_name | VARCHAR(255) | NOT NULL | Company name |
| phone | VARCHAR(50) | | Phone number |
| website | VARCHAR(255) | | Website URL |
| is_admin | BOOLEAN | DEFAULT FALSE | Admin flag |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Update timestamp |

**Indexes:**
- `idx_users_email` on `email`

---

### posts

Stores generated social media posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Post ID |
| user_id | INTEGER | FK → users(id), NOT NULL | Post owner |
| job_type | VARCHAR(100) | NOT NULL | Type of job |
| post_text | TEXT | NOT NULL | Generated post text |
| user_comment | TEXT | | Optional user comment |
| images | JSONB | DEFAULT '[]' | Array of image URLs |
| sent_to_automation | BOOLEAN | DEFAULT FALSE | Automation status |
| automation_sent_at | TIMESTAMP | | Automation send time |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Update timestamp |

**Indexes:**
- `idx_posts_user_id` on `user_id`
- `idx_posts_created_at` on `created_at DESC`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### webhook_logs

Logs webhook execution attempts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Log ID |
| post_id | INTEGER | FK → posts(id) | Related post |
| webhook_url | TEXT | NOT NULL | Webhook URL |
| payload | JSONB | NOT NULL | Sent payload |
| response_status | INTEGER | | HTTP status code |
| response_body | TEXT | | Response body |
| success | BOOLEAN | DEFAULT FALSE | Success flag |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |

**Indexes:**
- `idx_webhook_logs_post_id` on `post_id`

**Foreign Keys:**
- `post_id` REFERENCES `posts(id)` ON DELETE SET NULL

---

### settings

Stores system configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Setting ID |
| key | VARCHAR(100) | UNIQUE, NOT NULL | Setting key |
| value | TEXT | | Setting value |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Update timestamp |

**Default Settings:**
- `n8n_webhook_url`: n8n webhook endpoint
- `default_hashtags`: Default hashtags for posts

---

## Relationships

```
users (1) ──< (N) posts
posts (1) ──< (N) webhook_logs
```

---

## Sample Data

### Default Admin User
- Email: `admin@artisan.com`
- Password: `admin123` (change in production!)
- Company: `Admin`
- is_admin: `true`

---

## Migration

Run migrations:
```bash
cd backend
npm run migrate
```

This will:
1. Create all tables
2. Create indexes
3. Insert default admin user
4. Insert default settings
