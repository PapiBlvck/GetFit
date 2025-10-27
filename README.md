# GetFit - Fitness Web Application

A modern fitness tracking web application built with React, TypeScript, Firebase, and tRPC.

## Features

- 🏋️ Workout tracking
- 🥗 Nutrition monitoring
- 📊 Progress analytics
- 🔐 User authentication
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Backend**: tRPC, Firebase
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod
- **Styling**: CSS Modules / Tailwind CSS (to be configured)
- **Testing**: Vitest, React Testing Library

## Project Structure

```
src/
├── api/              # API integration (tRPC, Firebase)
├── components/       # React components
│   ├── common/       # Reusable components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Page components
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/              # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js 14+ 
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Copy `.env.example` to `.env` and fill in your Firebase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.

