const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Validate incoming request
    const { 
      modelId, 
      input, 
      webhookUrl, 
      ...additionalOptions 
    } = req.body;

    if (!modelId || !input) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Make request to FAL.ai
    const response = await axios.post(
      'https://fal.ai/queue/submit', 
      {
        model_id: modelId,
        input: input,
        webhook_url: webhookUrl,
        ...additionalOptions
      }, 
      {
        headers: {
          'Authorization': `Bearer ${process.env.FAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    // Return request ID to client
    res.status(200).json({
      request_id: response.data.request_id
    });

  } catch (error) {
    console.error('FAL.ai Proxy Error:', error.response ? error.response.data : error.message);

    // Handle different types of errors
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Error processing request',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};
