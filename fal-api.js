// FAL.ai API Interaction Functions

async function submitFalAiRequest(modelId, input, additionalOptions = {}) {
  try {
    console.log('Submitting request:', { modelId, input, additionalOptions });
    
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

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Request failed');
    }

    const { request_id } = await response.json();
    console.log('Received request_id:', request_id);
    return request_id;
  } catch (error) {
    console.error('FAL.ai Request Error:', error);
    throw error;
  }
}

async function checkFalAiStatus(modelId, requestId) {
  try {
    console.log('Checking status:', { modelId, requestId });
    
    const response = await fetch(`/api/fal-status?modelId=${modelId}&requestId=${requestId}`, {
      method: 'GET'
    });

    console.log('Status response:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Status error:', errorData);
      throw new Error(errorData.error || 'Status check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('FAL.ai Status Check Error:', error);
    throw error;
  }
}
