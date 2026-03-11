const express = require('express');
const Joi = require('joi');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { generatePost } = require('../services/ai.service');
const { uploadToCloudinary } = require('../services/cloudinary.service');
const { sendToN8N } = require('../services/webhook.service');

const router = express.Router();

router.use(authMiddleware);

const createPostSchema = Joi.object({
  job_type: Joi.string().required(),
  user_comment: Joi.string().allow('', null)
});

router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { job_type, user_comment } = value;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    let imageUrls = [];

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      imageUrls = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.path))
      );
    } else {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const postText = await generatePost({
      job_type,
      user_comment,
      company_name: req.user.company_name,
      phone: req.user.phone,
      website: req.user.website
    });

    const result = await pool.query(
      `INSERT INTO posts (user_id, job_type, post_text, user_comment, images)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, job_type, postText, user_comment, JSON.stringify(imageUrls)]
    );

    const post = result.rows[0];

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post.id,
        job_type: post.job_type,
        post_text: post.post_text,
        user_comment: post.user_comment,
        images: post.images,
        created_at: post.created_at
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, job_type, post_text, user_comment, images, sent_to_automation, created_at
       FROM posts
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      posts: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { post_text } = req.body;

    if (!post_text) {
      return res.status(400).json({ error: 'Post text is required' });
    }

    const result = await pool.query(
      `UPDATE posts
       SET post_text = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [post_text, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      message: 'Post updated successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.post('/:id/send-to-automation', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = result.rows[0];

    const webhookResult = await sendToN8N({
      company: req.user.company_name,
      post_text: post.post_text,
      images: post.images,
      job_type: post.job_type,
      user_email: req.user.email,
      post_id: post.id
    });

    await pool.query(
      `UPDATE posts
       SET sent_to_automation = TRUE, automation_sent_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [post.id]
    );

    res.json({
      message: 'Post sent to automation successfully',
      webhook_response: webhookResult
    });
  } catch (error) {
    console.error('Send to automation error:', error);
    res.status(500).json({ error: 'Failed to send to automation' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
