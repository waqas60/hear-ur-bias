# Middleware

This directory contains custom Express middleware functions.

## Purpose
- Authentication middleware
- Error handling middleware
- Request validation middleware
- Logging middleware
- etc.

## Example
```javascript
// authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Authentication logic
  next();
};

module.exports = authMiddleware;
```
