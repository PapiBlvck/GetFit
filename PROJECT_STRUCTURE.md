# GetFit Project Structure

## Overview
This document outlines the complete project structure for the GetFit fitness tracking web application.

## Directory Structure

```
Hytel BootCamp/
├── config/                      # Configuration files
├── public/                      # Static assets
│   └── index.html              # HTML entry point
├── src/                        # Source code
│   ├── api/                    # API integration
│   │   ├── firebase/           # Firebase configuration
│   │   │   └── config.ts       # Firebase initialization
│   │   └── trpc/               # tRPC API setup
│   ├── assets/                 # Static assets (images, icons)
│   │   ├── icons/
│   │   └── images/
│   ├── components/             # React components
│   │   ├── common/             # Reusable components
│   │   │   └── Button.tsx      # Button component
│   │   ├── layout/             # Layout components
│   │   │   └── Header.tsx      # Header component
│   │   └── features/           # Feature-specific components
│   │       ├── auth/           # Authentication components
│   │       ├── workout/        # Workout components
│   │       ├── nutrition/      # Nutrition components
│   │       └── progress/       # Progress tracking components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   │   └── useLocalStorage.ts # LocalStorage hook
│   ├── lib/                    # Utility libraries
│   ├── pages/                  # Page components
│   ├── styles/                 # Stylesheets
│   │   ├── index.css          # Global styles
│   │   └── App.css            # App-specific styles
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Main types
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts       # App constants
│   │   └── helpers.ts         # Helper functions
│   ├── App.tsx                # Main App component
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite environment types
├── tests/                      # Test files
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   ├── e2e/                   # End-to-end tests
│   └── setup.ts               # Test setup
├── .env.example               # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── package.json              # Project dependencies
├── README.md                 # Project documentation
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript Node configuration
├── vite.config.ts            # Vite configuration
└── vitest.config.ts          # Vitest configuration
```

## Key Files Created

### Configuration Files
- `tsconfig.json` - TypeScript compiler configuration with path aliases
- `vite.config.ts` - Vite bundler configuration
- `vitest.config.ts` - Testing framework configuration
- `.eslintrc.json` - Code linting rules
- `.prettierrc` - Code formatting rules
- `.gitignore` - Files to exclude from version control

### Source Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component
- `src/api/firebase/config.ts` - Firebase initialization
- `src/types/index.ts` - TypeScript type definitions
- `src/utils/constants.ts` - Application constants
- `src/utils/helpers.ts` - Utility helper functions
- `src/components/common/Button.tsx` - Reusable button component
- `src/components/layout/Header.tsx` - Application header
- `src/hooks/useLocalStorage.ts` - Custom localStorage hook

### Styling
- `src/styles/index.css` - Global styles with CSS variables
- `src/styles/App.css` - Application-specific styles

### Documentation
- `README.md` - Project overview and setup instructions
- `PROJECT_STRUCTURE.md` - This file

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Backend/API**: Firebase + tRPC
- **State Management**: React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form + Zod validation
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Features to Implement

- [ ] User authentication (Firebase Auth)
- [ ] Workout tracking and management
- [ ] Nutrition logging
- [ ] Progress tracking with charts
- [ ] Goal setting and monitoring
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Data persistence with Firebase Firestore
- [ ] Real-time updates
- [ ] PWA capabilities

## Notes

- All path aliases are configured in `tsconfig.json` and `vite.config.ts`
- Use `@/` prefix for imports from src directory
- Follow the established folder structure for new components
- Write tests for all new features
- Use TypeScript strict mode



