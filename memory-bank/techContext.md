# Technical Context: Rafey Blog

## 1. Core Technologies

*   **Frontend Framework**: Next.js (v15.3.0)
*   **Backend CMS**: Payload CMS (v3.42.0)
*   **Programming Language**: TypeScript
*   **Styling**: Tailwind CSS (v4.x implied by `@tailwindcss/postcss` v4.1.10)
*   **Database**: MongoDB (via `mongooseAdapter` in Payload config)
*   **Package Manager**: pnpm (inferred from `pnpm-lock.yaml` and `README.md` instructions)
*   **Containerization**: Docker (optional, setup described in `README.md` and `docker-compose.yml`)

## 2. Key Libraries & Dependencies

### Payload CMS & Related:
*   `@payloadcms/db-mongodb`: MongoDB adapter for Payload.
*   `@payloadcms/richtext-lexical`: Lexical rich text editor for Payload.
*   `@payloadcms/next`: Integration utilities for Next.js and Payload.
*   `@payloadcms/admin-bar`: Provides an admin bar for logged-in users on the frontend.
*   `@payloadcms/live-preview-react`: Enables live preview functionality.
*   `@payloadcms/plugin-form-builder`: Plugin for creating forms.
*   `@payloadcms/plugin-nested-docs`: Plugin for managing nested document structures.
*   `@payloadcms/plugin-redirects`: Plugin for managing URL redirects.
*   `@payloadcms/plugin-search`: Plugin for adding search capabilities.
*   `@payloadcms/plugin-seo`: Plugin for SEO-related fields and sitemap generation.
*   `sharp`: Image processing library, used by Payload for media handling.

### Next.js & Frontend:
*   `react`, `react-dom`: Core React libraries.
*   `lucide-react`: Icon library.
*   `class-variance-authority`, `clsx`, `tailwind-merge`: Utilities for managing Tailwind CSS classes.
*   `@radix-ui/react-slot`: Utility for component composition.

### Development & Build Tools:
*   `cross-env`: For setting environment variables across platforms.
*   `eslint`, `prettier`: For linting and code formatting.
*   `typescript`: For static typing.
*   `postcss`: For processing CSS with Tailwind.

## 3. Development Setup

As per `README.md`:

1.  **Clone Repository**.
2.  **Environment Variables**: Copy `.env.example` to `.env` and configure `MONGODB_URI` and other necessary variables (e.g., `PAYLOAD_SECRET`, `CRON_SECRET`).
3.  **Install Dependencies**: `pnpm install`
4.  **Run Development Server**: `pnpm dev` (starts Next.js dev server, typically on `http://localhost:3000`)

### Docker Setup (Alternative):

1.  Configure `.env` file.
2.  Run `docker-compose up`.

## 4. Project Structure Overview

*   `src/`: Main source code directory.
    *   `app/`: Next.js App Router directory.
        *   `(frontend)/`: Contains frontend-specific routes and components.
        *   `(payload)/`: Contains Payload CMS admin UI routes and API endpoints.
        *   `my-route/`: Example or custom route directory.
    *   `client/`: Contains shared client-side code, Payload collections, blocks, fields, components, utilities, etc.
        *   `collections/`: Payload CMS collection definitions (e.g., `Users`, `Posts`, `Pages`, `Media`, `Categories`).
        *   `blocks/`: Definitions for reusable content blocks (e.g., `MediaBlock`, `ContentBlock`, `CodeBlock`).
        *   `components/`: UI components for both frontend and Payload admin (e.g., `RichText`, `AdminBar`).
        *   `fields/`: Custom Payload field definitions.
        *   `globals/`: Payload global configurations (e.g., `Header`, `Footer`).
        *   `plugins/`: Payload plugin configurations.
        *   `utilities/`: Helper functions and utilities.
    *   `lib/`: General library code (e.g., `utils.ts`).
    *   `payload-types.ts`: Auto-generated TypeScript types for Payload collections and globals.
    *   `payload.config.ts`: Main Payload CMS configuration file.
*   `memory-bank/`: Directory for these documentation files.
*   `public/`: Static assets for Next.js.
*   Configuration files: `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` (implicitly, though not listed, Tailwind requires one), `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`.

## 5. Technical Constraints & Considerations

*   **Node.js Version**: `NODE_OPTIONS=--no-deprecation` is used in npm scripts, suggesting potential compatibility considerations with specific Node.js versions or dependencies.
*   **Payload Cloud**: The project mentions `@payloadcms/payload-cloud`, indicating potential integration or deployment with Payload Cloud services.
*   **Server-Side Operations**: Payload CMS operations and data fetching for Next.js server components will run server-side.
*   **Client Components**: Components requiring interactivity (e.g., using hooks like `useState`, `useEffect`, or event handlers) in Next.js must be marked with `'use client'`.
*   **Build Process**: `next build` is used for production builds.
*   **API Endpoints**: Payload CMS automatically generates API endpoints under `/api` (e.g., `/api/posts`, `/api/users`). These are configured in `src/app/(payload)/api/[...slug]/route.ts`.
*   **Live Preview**: The project is configured for live preview capabilities, linking the Payload admin with the Next.js frontend.

## 6. Version Control

*   Git (implied by `.gitignore`).

## 7. Code Quality & Conventions

*   **ESLint** and **Prettier** are configured for linting and formatting, ensuring code consistency.
*   **TypeScript** is used for type safety and improved developer experience.
*   The project structure separates concerns between frontend, Payload admin, and shared client logic.