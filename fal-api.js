// FAL.ai API Interaction Functions

// Submit a request to FAL.ai via proxy
async function submitFalAiRequest(modelId, input, additionalOptions = {}) {
  try {
    // Submit request to your proxy
    const response = await fetch('/api/fal-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        modelId,
        input,
        ...additionalOptions
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const { request_id } = await response.json();
    return request_id;
  } catch (error) {
    console.error('FAL.ai Request Error:', error);
    throw error;
  }
}

// Check request status
async function checkFalAiStatus(modelId, requestId) {
  try {
    const response = await fetch(`/api/fal-status?modelId=${modelId}&requestId=${requestId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Status check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('FAL.ai Status Check Error:', error);
    throw error;
  }
}

// Example usage function
async function generateImage() {
  try {
    const requestId = await submitFalAiRequest('fal-ai/iclight-v2', {
      prompt: "perfume bottle in a volcano surrounded by lava.",
      image_url: "https://storage.googleapis.com/falserverless/iclight-v2/bottle.png",
      num_inference_steps: 28,
      guidance_scale: 5
    });

    // Poll for status or use webhooks
    const status = await checkFalAiStatus('fal-ai/iclight-v2', requestId);
    
    // Handle the result
    if (status.completed) {
      // Process the image
      console.log(status.result);
    }
  } catch (error) {
    // Handle errors
    console.error('Image Generation Error:', error);
  }
}

// Expose functions if needed
window.submitFalAiRequest = submitFalAiRequest;
window.checkFalAiStatus = checkFalAiStatus;
window.generateImage = generateImage;
