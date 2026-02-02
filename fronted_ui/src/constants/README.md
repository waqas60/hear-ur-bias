# Constants

This directory contains application constants and configuration values.

## Purpose
- API endpoints
- Application-wide constants
- Configuration values
- Enums and fixed values
- etc.

## Example
```javascript
// api.js
export const API_BASE_URL = 'http://localhost:5000';
export const API_ENDPOINTS = {
  CHECK_BIAS: '/check-bias',
};

// app.js
export const APP_NAME = 'Hear Your Bias';
export const MAX_TEXT_LENGTH = 5000;
```
