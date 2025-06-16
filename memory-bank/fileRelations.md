# File Relations: Rafey Blog

This document tracks relationships between key code files, functions, and configurations within the Rafey Blog project. It will be updated as new features are implemented and existing code is modified.

## Core Configuration & Setup

### File: `payload.config.ts`
*   **Path**: `src/payload.config.ts`
*   **Related Files/Functions/Modules**:
    *   All Collection definitions (e.g., `src/client/collections/Users.ts`, `src/client/collections/Posts.ts`, etc.) - Imports and registers them.
    *   All Global definitions (e.g., `src/client/globals/Header.ts`, `src/client/globals/Footer.ts`) - Imports and registers them.
    *   All Plugin configurations (e.g., `src/client/plugins/seo.ts`, `src/client/plugins/formBuilder.ts`) - Imports and configures them.
    *   `@payloadcms/db-mongodb` (for `mongooseAdapter` or `postgresAdapter`).
    *   `@payloadcms/richtext-lexical` - Configures the rich text editor.
    *   `@payloadcms/next` - For `payload` function used in Next.js integration.
    *   `path` (Node.js module) - Often used for resolving file paths.
    *   `sharp` - For image processing.
*   **Relationships**:
    *   **Imports**: Collections, Globals, Plugins, Adapters, Editor.
    *   **Configures**: Defines the entire CMS schema, database connection, admin panel path, GraphQL path, CSRF settings, and more.
*   **Description**: The central nervous system of Payload CMS. It defines what content types exist, how they are structured, what features are enabled (plugins), and how the CMS integrates with the database and frontend framework (Next.js).

### File: `next.config.mjs`
*   **Path**: `next.config.mjs`
*   **Related Files/Functions/Modules**:
    *   Potentially `@payloadcms/next/webpack` if custom Webpack configurations for Payload are needed.
    *   Environment variables (e.g., `process.env.PAYLOAD_PUBLIC_SERVER_URL`).
*   **Relationships**:
    *   **Configures**: Next.js build and runtime behavior, including image domains, experimental features, environment variable exposure, and potentially custom Webpack settings.
*   **Description**: Main configuration file for the Next.js application. It dictates how Next.js builds, serves, and behaves.

### File: `src/app/(payload)/api/[...slug]/route.ts`
*   **Path**: `src/app/(payload)/api/[...slug]/route.ts`
*   **Related Files/Functions/Modules**:
    *   `@payloadcms/next/routes` (specifically `makePayloadHandler`)
    *   `payload.config.ts` (implicitly, as the handler relies on the initialized Payload instance)
*   **Relationships**:
    *   **Uses**: `makePayloadHandler` to create Next.js route handlers for all Payload API endpoints (REST and GraphQL).
*   **Description**: This dynamic route file is crucial for exposing all of Payload CMS's API endpoints through the Next.js application structure.

### File: `src/app/(payload)/admin/[...slug]/route.ts`
*   **Path**: `src/app/(payload)/admin/[...slug]/route.ts`
*   **Related Files/Functions/Modules**:
    *   `@payloadcms/next/routes` (specifically `makePayloadAdmin`)
    *   `payload.config.ts` (implicitly)
*   **Relationships**:
    *   **Uses**: `makePayloadAdmin` to render the Payload CMS admin panel within the Next.js application.
*   **Description**: This dynamic route file serves the entire Payload CMS admin interface.

## Frontend Components & Pages

### File: `src/app/(frontend)/not-found.tsx`
*   **Path**: `src/app/(frontend)/not-found.tsx`
*   **Related Files/Functions/Modules**:
    *   `lucide-react` (for icons like `AlertTriangle`, `Home`, `Undo2`).
    *   `next/link` (for the `Link` component).
    *   `@/components/ui/Button` (custom Button component).
    *   `@/components/ui/Card` (custom Card component).
    *   `@/lib/utils` (for `cn` utility if used for class names).
    *   `react` (for `useRouter` if `router.back()` is used, and general JSX).
*   **Relationships**:
    *   **Imports**: Icon components, `Link`, `Button`, `Card`.
    *   **Uses**: `Link` for navigation, `Button` for actions (e.g., go back, go home).
    *   **Directive**: `'use client'` - Marks this as a Client Component due to interactive elements and hooks.
*   **Description**: Custom 404 error page for the Next.js frontend. It provides users with options when they land on a non-existent page.
    *   **Function**: `NotFound` (React Component)
        *   **File**: `src/app/(frontend)/not-found.tsx`
        *   **Related Files/Functions**: Uses `Link` component, `Button` component, icons.
        *   **Description**: Renders the UI for the 404 page, including a message, an animation/image, and action buttons.

## Collections (Example)

### File: `src/client/collections/Posts.ts` (Illustrative - to be expanded)
*   **Path**: `src/client/collections/Posts.ts`
*   **Related Files/Functions/Modules**:
    *   `payload/types` (for `CollectionConfig`).
    *   Potentially custom field components or hooks defined in `src/client/fields/` or `src/client/hooks/`.
    *   Related collections via relationship fields (e.g., `Categories.ts`, `Users.ts` for author).
    *   Blocks defined in `src/client/blocks/` if used in a `blocks` field.
*   **Relationships**:
    *   **Defines**: The schema for 'Post' content type, including fields like title, slug, content (rich text/blocks), author, categories, status, etc.
    *   **Exports**: A `CollectionConfig` object.
*   **Description**: Defines the structure and behavior of blog posts within Payload CMS. This is a critical file for the blog's content.

--- 
*This file will be actively updated as the blog application is developed, detailing new components, pages, API interactions, and data flows.*