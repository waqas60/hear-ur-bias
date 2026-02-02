# Project Structure

This document outlines the file and folder structure of the Hear Your Bias application.

## Overview

The project is organized as a monorepo containing both backend and frontend applications:

```
ICAT-26/
├── backend/          # Node.js/Express backend server
├── fronted_ui/       # React + Vite frontend application
└── README.md         # Main project documentation
```

## Backend Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── server.js     # Server configuration (PORT, etc.)
│   ├── controllers/      # Request handlers and business logic
│   │   └── biasController.js
│   ├── routes/           # API route definitions
│   │   └── biasRoutes.js
│   ├── services/         # Business logic and external services
│   │   └── biasChecker.js
│   ├── middleware/       # Custom Express middleware
│   ├── models/           # Data models and schemas
│   ├── utils/            # Utility functions and helpers
│   └── index.js          # Application entry point
├── data/                 # Data files (CSV, JSON, etc.)
│   └── dataset.csv
├── package.json
└── .gitignore

```

### Backend Directory Descriptions

- **`src/config/`**: Configuration files for the application (server settings, database config, etc.)
- **`src/controllers/`**: Route handlers that process requests and send responses
- **`src/routes/`**: API route definitions that map URLs to controllers
- **`src/services/`**: Business logic, data processing, and external service integrations
- **`src/middleware/`**: Custom Express middleware (authentication, validation, error handling, etc.)
- **`src/models/`**: Data models, schemas, and type definitions
- **`src/utils/`**: Utility functions and helper methods
- **`data/`**: Static data files used by the application

## Frontend Structure

```
fronted_ui/
├── src/
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── SpeechToText.jsx
│   ├── contexts/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components (routes)
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── Tool.jsx
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API calls and external service integrations
│   ├── utils/            # Utility functions and helpers
│   ├── constants/        # Application constants and configuration
│   ├── styles/           # Global styles and theme
│   ├── firebase.js       # Firebase configuration
│   ├── App.jsx           # Root application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global CSS
├── public/               # Public static files
├── index.html            # HTML template
├── package.json
├── vite.config.js
├── eslint.config.js
├── .env.example          # Environment variable template
└── .gitignore
```

### Frontend Directory Descriptions

- **`src/components/`**: Reusable UI components used across different pages
- **`src/pages/`**: Top-level page components that correspond to routes
- **`src/contexts/`**: React Context providers for global state management
- **`src/hooks/`**: Custom React hooks for reusable stateful logic
- **`src/services/`**: Functions for API calls and external service integrations
- **`src/utils/`**: Utility functions and helper methods
- **`src/constants/`**: Application-wide constants, API endpoints, and configuration
- **`src/styles/`**: Global styles and theme configurations
- **`src/assets/`**: Static assets like images, fonts, and icons
- **`public/`**: Public files served directly (favicon, manifest, etc.)

## File Naming Conventions

### Backend
- Use **camelCase** for file names: `biasController.js`, `biasChecker.js`
- Controllers: `*Controller.js`
- Routes: `*Routes.js`
- Services: descriptive names like `biasChecker.js`
- Middleware: `*Middleware.js`

### Frontend
- Use **PascalCase** for React components: `Navbar.jsx`, `SpeechToText.jsx`
- Use **camelCase** for utility files: `formatters.js`, `api.js`
- Context files: `*Context.jsx`
- Pages should be named after their route: `Login.jsx`, `Profile.jsx`

## Getting Started

### Running the Backend
```bash
cd backend
npm install
npm start
```

### Running the Frontend
```bash
cd fronted_ui
npm install
npm run dev
```

## Best Practices

1. **Separation of Concerns**: Keep business logic in services, route handling in controllers
2. **Modularity**: Create small, focused modules that do one thing well
3. **Reusability**: Extract common logic into utils, hooks, or services
4. **Configuration**: Keep configuration separate from code
5. **Documentation**: Add README.md files in new directories to explain their purpose

## Future Enhancements

Consider adding:
- `backend/src/tests/` for backend tests
- `fronted_ui/src/__tests__/` for frontend tests
- `backend/src/validators/` for request validation schemas
- `fronted_ui/src/types/` for TypeScript type definitions (if migrating to TypeScript)
