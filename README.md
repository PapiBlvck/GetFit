# GetFit - Fitness Tracking App

A modern, full-stack fitness tracking application built with React, TypeScript, Firebase, and tRPC.

## 🏗️ Project Structure

```
getfit-monorepo/
├── apps/
│   └── web/                    # React web application
│       ├── src/
│       │   ├── api/           # API clients (Firebase, tRPC)
│       │   ├── assets/        # Static assets (images, icons)
│       │   ├── components/    # React components
│       │   │   ├── auth/      # Authentication components
│       │   │   ├── common/    # Reusable UI components
│       │   │   ├── demo/      # Demo/example components
│       │   │   ├── features/  # Feature-specific components
│       │   │   └── layout/    # Layout components
│       │   ├── contexts/      # React contexts (Auth, Toast, etc.)
│       │   ├── hooks/         # Custom React hooks
│       │   ├── lib/           # Library code (validations, utilities)
│       │   ├── pages/         # Page components
│       │   │   └── auth/      # Auth-related pages
│       │   ├── scripts/       # Build/utility scripts
│       │   ├── services/      # Service layer (Firestore, etc.)
│       │   ├── styles/        # CSS files
│       │   ├── types/         # TypeScript type definitions
│       │   ├── utils/         # Utility functions
│       │   ├── App.tsx        # Main app component
│       │   └── main.tsx       # Application entry point
│       ├── public/            # Public static files
│       ├── index.html         # HTML entry point
│       ├── package.json       # Web app dependencies
│       ├── vite.config.ts     # Vite configuration
│       ├── vitest.config.ts   # Vitest configuration
│       └── tsconfig.json      # TypeScript configuration
│
├── functions/                  # Firebase Cloud Functions (tRPC backend)
│   ├── src/
│   │   ├── routers/           # tRPC route handlers
│   │   │   ├── activity.ts    # Activity tracking routes
│   │   │   ├── ai-coaching.ts # AI coaching routes
│   │   │   ├── goals.ts       # Goals management routes
│   │   │   └── index.ts       # Router aggregation
│   │   ├── index.ts           # Functions entry point
│   │   └── trpc.ts            # tRPC setup
│   ├── package.json
│   └── tsconfig.json
│
├── packages/                   # Shared packages
│   └── shared-schemas/        # Shared Zod schemas
│       ├── src/
│       │   ├── activity.ts
│       │   ├── goals.ts
│       │   ├── nutrition.ts
│       │   ├── routes.ts
│       │   ├── timeseries.ts
│       │   ├── user.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── tests/                      # Test files
│   ├── e2e/                   # End-to-end tests (Playwright)
│   │   └── user-journey.test.ts
│   ├── integration/           # Integration tests
│   │   ├── auth.test.tsx
│   │   └── nutrition-flow.test.tsx
│   ├── unit/                  # Unit tests
│   │   ├── Button.test.tsx
│   │   ├── firestore.service.test.ts
│   │   ├── helpers.test.ts
│   │   ├── Toast.test.tsx
│   │   └── validations.test.ts
│   └── setup.ts               # Test setup/configuration
│
├── config/                     # Configuration files
│   ├── firebase.config
│   └── firebase.config.ts
│
├── docs/                       # Documentation
│   ├── GetFit.txt             # Original TDD specification
│   ├── TDD_ALIGNMENT_GUIDE.md # TDD alignment documentation
│   ├── README.md              # Additional documentation
│   └── *.md                   # Other documentation files
│
├── scripts/                    # Project-level scripts
│
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (git-ignored)
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── firestore.rules            # Firestore security rules
├── package.json               # Root package.json (monorepo)
├── playwright.config.ts       # Playwright E2E test configuration
├── pnpm-lock.yaml             # pnpm lockfile
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Firebase CLI (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

### Development

Start the web app in development mode:
```bash
pnpm dev
# or
pnpm dev:web
```

The app will be available at `http://localhost:3000`

### Building

Build all packages:
```bash
pnpm build
```

Build specific package:
```bash
pnpm build:web      # Web app
pnpm build:schemas  # Shared schemas
pnpm build:functions # Cloud functions
```

## 🧪 Testing

### Unit & Integration Tests

Run all tests:
```bash
pnpm test
```

Run tests with UI:
```bash
pnpm test:ui
```

Generate coverage report:
```bash
pnpm test:coverage
```

### End-to-End Tests

Run E2E tests:
```bash
pnpm test:e2e
```

Run E2E tests with UI:
```bash
pnpm test:e2e:ui
```

Run all tests (unit + E2E):
```bash
pnpm test:all
```

## 📝 Development Scripts

- `pnpm dev` - Start web app in development mode
- `pnpm build` - Build all packages
- `pnpm test` - Run unit & integration tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm lint` - Run linter on all packages
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all node_modules and build artifacts

## 🏗️ Architecture

This project uses a **monorepo structure** with pnpm workspaces:

- **apps/web**: React SPA built with Vite
- **functions**: Firebase Cloud Functions with tRPC API
- **packages/shared-schemas**: Shared Zod validation schemas
- **tests**: Centralized test suite (unit, integration, E2E)

### Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Firebase (Auth, Firestore), tRPC
- **Testing**: Vitest, Playwright, Testing Library
- **State Management**: React Query, Context API
- **Validation**: Zod schemas
- **UI**: Lucide icons, Framer Motion
- **Forms**: React Hook Form

## 📦 Deployment

Deploy Cloud Functions:
```bash
pnpm deploy:functions
```

Deploy entire app (web + functions):
```bash
pnpm deploy
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test:all`
4. Run linter: `pnpm lint`
5. Format code: `pnpm format`
6. Commit and push
7. Create a pull request

## 📄 License

Private project - All rights reserved

## 📚 Documentation

For detailed documentation, see the `/docs` folder:
- Technical Design Document: `docs/GetFit.txt`
- TDD Alignment Guide: `docs/TDD_ALIGNMENT_GUIDE.md`
- Implementation summaries and guides

---

Built with ❤️ by the GetFit team

