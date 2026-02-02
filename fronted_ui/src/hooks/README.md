# Hooks

This directory contains custom React hooks.

## Purpose
- Reusable stateful logic
- Custom hooks for common patterns
- Side effect management
- etc.

## Example
```javascript
// useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  // Hook logic
  return { user, setUser };
};
```
