# Citations and Attributions

This document lists all third-party code, libraries, and resources used in the Mentorship Management System project.

## Core Libraries

### React and Related
- **React**: JavaScript library for building user interfaces
  - Version: 18.3.1
  - License: MIT
  - Source: [react](https://github.com/facebook/react)
  - Description: Used for building the UI with a component-based approach

- **React DOM**: Entry point to the DOM and server rendering methods for React
  - Version: 18.3.1
  - License: MIT
  - Source: [react-dom](https://github.com/facebook/react)
  - Description: Provides DOM-specific methods for React

- **React Router**: DOM bindings for React Router
  - Version: 6.22.2
  - License: MIT
  - Source: [react-router-dom](https://github.com/remix-run/react-router)
  - Description: Handles routing and navigation within the application

### State Management
- **Zustand**: Small, fast and scalable bearbones state-management solution
  - Version: 4.5.2
  - License: MIT
  - Source: [zustand](https://github.com/pmndrs/zustand)
  - Description: Provides simple and efficient state management

### Database and Authentication
- **Supabase JS Client**: Supabase JavaScript client library
  - Version: 2.39.7
  - License: MIT
  - Source: [supabase-js](https://github.com/supabase/supabase-js)
  - Description: Used for interacting with Supabase services

### UI Components and Styling
- **Lucide React**: Lucide icon library for React
  - Version: 0.344.0
  - License: ISC
  - Source: [lucide-react](https://github.com/lucide-icons/lucide)
  - Description: Provides beautiful and consistent icons

- **Tailwind CSS**: Utility-first CSS framework
  - Version: 3.4.1
  - License: MIT
  - Source: [tailwindcss](https://github.com/tailwindlabs/tailwindcss)
  - Description: Used for styling with utility classes

### Date Handling
- **date-fns**: Modern JavaScript date utility library
  - Version: 3.3.1
  - License: MIT
  - Source: [date-fns](https://github.com/date-fns/date-fns)
  - Description: Provides comprehensive date manipulation utilities

### Notifications
- **Sonner**: Opinionated toast notifications
  - Version: 1.4.3
  - License: MIT
  - Source: [sonner](https://github.com/emilkowalski/sonner)
  - Description: Handles toast notifications in the application

## Development Dependencies

### Build Tools
- **Vite**: Build tool and dev server
  - Version: 5.4.2
  - License: MIT
  - Source: [vite](https://github.com/vitejs/vite)
  - Description: Provides fast development server and build tooling

- **@vitejs/plugin-react**: Vite plugin for React projects
  - Version: 4.3.1
  - License: MIT
  - Source: [plugin-react](https://github.com/vitejs/vite/tree/main/packages/plugin-react)
  - Description: Official React plugin for Vite

### Testing
- **Vitest**: Testing framework
  - Version: 1.3.1
  - License: MIT
  - Source: [vitest](https://github.com/vitest-dev/vitest)
  - Description: Used for unit and integration testing

- **@vitest/coverage-v8**: Coverage provider for Vitest
  - Version: 1.3.1
  - License: MIT
  - Source: [coverage-v8](https://github.com/vitest-dev/vitest/tree/main/packages/coverage-v8)
  - Description: Provides code coverage reporting using V8

- **Testing Library**: Testing utilities
  - @testing-library/react: 14.2.1
  - @testing-library/jest-dom: 6.4.2
  - @testing-library/user-event: 14.5.2
  - License: MIT
  - Source: [testing-library](https://github.com/testing-library/react-testing-library)
  - Description: Provides utilities for testing React components

- **JSDOM**: JavaScript implementation of the WHATWG DOM and HTML standards
  - Version: 24.0.0
  - License: MIT
  - Source: [jsdom](https://github.com/jsdom/jsdom)
  - Description: Provides a browser-like environment for testing

### TypeScript and Type Definitions
- **TypeScript**: JavaScript with syntax for types
  - Version: 5.5.3
  - License: Apache-2.0
  - Source: [typescript](https://github.com/microsoft/TypeScript)
  - Description: Adds static typing to JavaScript

- **@types/react**: TypeScript definitions for React
  - Version: 18.3.5
  - License: MIT
  - Source: [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
  - Description: Type definitions for React

- **@types/react-dom**: TypeScript definitions for React DOM
  - Version: 18.3.0
  - License: MIT
  - Source: [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
  - Description: Type definitions for React DOM

### Code Quality
- **ESLint**: JavaScript linter
  - Version: 9.9.1
  - License: MIT
  - Source: [eslint](https://github.com/eslint/eslint)
  - Description: Ensures code quality and consistency

- **@eslint/js**: JavaScript linter
  - Version: 9.9.1
  - License: MIT
  - Source: [eslint](https://github.com/eslint/eslint)
  - Description: Core ESLint JavaScript functionality

- **eslint-plugin-react-hooks**: ESLint plugin for React Hooks
  - Version: 5.1.0-rc.0
  - License: MIT
  - Source: [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
  - Description: Enforces React Hooks rules

- **eslint-plugin-react-refresh**: ESLint plugin for React Refresh
  - Version: 0.4.11
  - License: MIT
  - Source: [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
  - Description: Validates React Refresh boundaries

- **typescript-eslint**: ESLint rules for TypeScript
  - Version: 8.3.0
  - License: MIT
  - Source: [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
  - Description: TypeScript support for ESLint

### CSS Processing
- **PostCSS**: Tool for transforming CSS with JavaScript plugins
  - Version: 8.4.35
  - License: MIT
  - Source: [postcss](https://github.com/postcss/postcss)
  - Description: CSS transformation and processing

- **Autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes
  - Version: 10.4.18
  - License: MIT
  - Source: [autoprefixer](https://github.com/postcss/autoprefixer)
  - Description: Automatically adds vendor prefixes to CSS

### Utilities
- **globals**: JavaScript global variable declarations
  - Version: 15.9.0
  - License: MIT
  - Source: [globals](https://github.com/sindresorhus/globals)
  - Description: Provides global variable declarations for different environments

## Design Resources

### Icons
All icons are from Lucide React, which is based on Feather Icons:
- **Lucide Icons**: [lucide.dev](https://lucide.dev)
  - License: ISC
  - Used throughout the application for consistent iconography

## Code Patterns and Implementations

### Authentication
- Authentication implementation is based on Supabase Auth best practices
  - Source: [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
  - Description: Follows recommended patterns for user authentication

### Database Schema
- Database schema design follows Supabase best practices
  - Source: [Supabase Schema Docs](https://supabase.com/docs/guides/database)
  - Description: Implements recommended database design patterns

### React Patterns
- Component patterns follow React best practices and hooks documentation
  - Source: [React Docs](https://react.dev/reference/react)
  - Description: Uses recommended React patterns and hooks

## License

This project is licensed under the MIT License. See the LICENSE file for details.

All third-party libraries and resources maintain their respective licenses as listed above.