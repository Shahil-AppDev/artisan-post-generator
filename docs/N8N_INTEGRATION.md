# n8n Integration Guide

Complete guide to integrate Artisan Post Generator with n8n for automated Facebook posting.

## Overview

When a user clicks "Send to automation", the application sends a webhook to n8n with post data. n8n then handles publishing to Facebook groups/pages.

---

## Webhook Payload

The application sends this JSON payload to your n8n webhook:

```json
{
  "company": "Company Name",
  "post_text": "Generated post text with emojis and hashtags...",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "job_type": "climatisation",
  "user_email": "user@example.com",
  "post_id": 123
}
```

---

## n8n Workflow Setup

### 1. Create New Workflow

1. Login to your n8n instance
2. Click "New Workflow"
3. Name it "Artisan Posts - Facebook Automation"

### 2. Add Webhook Trigger

1. Add node: **Webhook**
2. Configure:
   - **Webhook URLs**: Production URL
   - **HTTP Method**: POST
   - **Path**: `/webhook/artisan-posts`
   - **Response Mode**: Immediately
   - **Response Code**: 200

3. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/artisan-posts`)
4. Add this URL to your backend `.env` file as `N8N_WEBHOOK_URL`

### 3. Add Facebook Node

#### Option A: Facebook Pages API

1. Add node: **Facebook Graph API**
2. Configure:
   - **Credential**: Create Facebook credentials
   - **Resource**: Post
   - **Operation**: Create
   - **Page ID**: Your Facebook page ID
   - **Message**: `{{ $json.post_text }}`
   - **Link**: (optional) `{{ $json.images[0] }}`

#### Option B: Facebook Groups

1. Add node: **HTTP Request**
2. Configure:
   - **Method**: POST
   - **URL**: `https://graph.facebook.com/v18.0/{GROUP_ID}/feed`
   - **Authentication**: Generic Credential Type
   - **Query Parameters**:
     - `access_token`: Your Facebook access token
     - `message`: `{{ $json.post_text }}`
     - `link`: `{{ $json.images[0] }}`

### 4. Handle Multiple Images

If you want to post multiple images:

1. Add node: **Split In Batches**
2. Configure:
   - **Batch Size**: 1
   - **Input Data**: `{{ $json.images }}`

3. Add node: **Facebook Graph API** (for each image)
4. Configure to upload each image

### 5. Add Error Handling

1. Add node: **IF** (after Facebook node)
2. Check if post was successful
3. If error:
   - Add **Email** node to notify admin
   - Or add **Slack** node for alerts

### 6. Log Success

1. Add node: **HTTP Request**
2. Send success confirmation back to your API (optional)

---

## Complete n8n Workflow Example

```
[Webhook Trigger]
    ↓
[Set Variables] (extract data)
    ↓
[Facebook Graph API] (create post)
    ↓
[IF] (check success)
    ↓ (success)
[Respond to Webhook] (200 OK)
    ↓ (error)
[Send Email Alert]
```

---

## Facebook API Setup

### Get Facebook Access Token

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an App (Business type)
3. Add "Facebook Login" product
4. Generate User Access Token with permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `publish_to_groups` (for groups)

5. Convert to Long-lived token:
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_TOKEN}"
```

### Get Page/Group ID

**For Pages:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={ACCESS_TOKEN}"
```

**For Groups:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/groups?access_token={ACCESS_TOKEN}"
```

---

## Advanced n8n Workflows

### Workflow 1: Multi-Platform Publishing

Post to Facebook, Instagram, and LinkedIn simultaneously:

```
[Webhook]
    ↓
[Split] (3 branches)
    ↓
[Facebook] [Instagram] [LinkedIn]
    ↓
[Merge]
    ↓
[Respond]
```

### Workflow 2: Scheduled Publishing

Store posts and publish at optimal times:

```
[Webhook]
    ↓
[Google Sheets] (save post)
    ↓
[Schedule Trigger] (daily at 10 AM)
    ↓
[Read Sheet]
    ↓
[Facebook Post]
    ↓
[Mark as Published]
```

### Workflow 3: AI Enhancement

Enhance posts before publishing:

```
[Webhook]
    ↓
[OpenAI] (improve text)
    ↓
[Translate] (if needed)
    ↓
[Add Hashtags]
    ↓
[Facebook Post]
```

---

## Testing the Integration

### 1. Test Webhook Locally

```bash
curl -X POST https://your-n8n.com/webhook/artisan-posts \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Test Company",
    "post_text": "Test post",
    "images": ["https://example.com/image.jpg"],
    "job_type": "test",
    "user_email": "test@example.com",
    "post_id": 1
  }'
```

### 2. Test from Application

1. Create a post in the app
2. Click "Send to automation"
3. Check n8n workflow execution
4. Verify Facebook post

### 3. Check Logs

In n8n:
- View workflow executions
- Check for errors
- Review execution data

In your app:
```bash
docker-compose logs backend | grep webhook
```

---

## Webhook Security

### Add Authentication

In n8n Webhook node:
1. Enable **Header Auth**
2. Add header: `X-Webhook-Secret: your_secret_key`

In backend `.env`:
```env
N8N_WEBHOOK_SECRET=your_secret_key
```

Update backend webhook service to include header:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET
}
```

---

## Troubleshooting

### Webhook not receiving data
- Check n8n webhook URL is correct
- Verify n8n is accessible from your server
- Check firewall settings

### Facebook API errors
- Verify access token is valid
- Check token permissions
- Ensure page/group ID is correct

### Images not uploading
- Verify image URLs are publicly accessible
- Check Cloudinary configuration
- Try with direct image URLs

---

## Best Practices

1. **Rate Limiting**: Don't spam Facebook API
2. **Error Handling**: Always handle failures gracefully
3. **Logging**: Keep logs of all webhook calls
4. **Monitoring**: Set up alerts for failed posts
5. **Backup**: Store posts in database before sending
6. **Testing**: Test with test accounts first

---

## Example n8n Workflow JSON

Save this as a starting template:

```json
{
  "name": "Artisan Posts - Facebook",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "artisan-posts",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "resource": "post",
        "operation": "create",
        "pageId": "YOUR_PAGE_ID",
        "message": "={{ $json.post_text }}"
      },
      "name": "Facebook",
      "type": "n8n-nodes-base.facebookGraphApi",
      "position": [450, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"success\": true } }}"
      },
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Facebook", "type": "main", "index": 0 }]]
    },
    "Facebook": {
      "main": [[{ "node": "Respond", "type": "main", "index": 0 }]]
    }
  }
}
```

Import this in n8n and customize as needed.

---

## Support Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis/)
