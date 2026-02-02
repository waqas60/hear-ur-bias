# Services

This directory contains API service functions and external service integrations.

## Purpose
- API calls to backend
- Third-party service integrations
- Data fetching logic
- etc.

## Example
```javascript
// biasService.js
const API_URL = 'http://localhost:5000';

export const checkBias = async (text) => {
  const response = await fetch(`${API_URL}/check-bias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
};
```
