const axios = require('axios');
const pool = require('../config/database');

async function sendToN8N(payload) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N webhook URL not configured');
    return { success: false, message: 'Webhook URL not configured' };
  }

  try {
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    await pool.query(
      `INSERT INTO webhook_logs (post_id, webhook_url, payload, response_status, response_body, success)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        payload.post_id,
        webhookUrl,
        JSON.stringify(payload),
        response.status,
        JSON.stringify(response.data),
        true
      ]
    );

    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('N8N webhook error:', error);

    await pool.query(
      `INSERT INTO webhook_logs (post_id, webhook_url, payload, response_status, response_body, success)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        payload.post_id,
        webhookUrl,
        JSON.stringify(payload),
        error.response?.status || 0,
        error.message,
        false
      ]
    );

    throw new Error('Failed to send to n8n webhook');
  }
}

module.exports = { sendToN8N };
