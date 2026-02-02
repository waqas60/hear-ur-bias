# Utils

This directory contains utility functions and helper methods.

## Purpose
- Common helper functions
- Data formatting utilities
- Validation utilities
- DOM manipulation utilities
- etc.

## Example
```javascript
// formatters.js
export const formatDate = (date) => {
  // Format date logic
  return formattedDate;
};

export const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
```
