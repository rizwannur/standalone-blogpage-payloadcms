# Technical Context: Rafey Blog

## 1. Core Technologies

*   **Programming Language**: **TypeScript** (version 5.x+). Used across the entire stack (Next.js frontend, Payload CMS backend configuration, and any custom server-side logic) for strong typing and improved developer experience.
*   **Frontend Framework**: **Next.js** (version 14+ with **App Router**).
    *   **UI Library**: **React** (version 18.2+).
    *   **Key Next.js Features**: Server Components, Client Components, Server Actions, Static Site Generation (SSG), Server-Side Rendering (SSR), API Routes/Route Handlers, Image Optimization.
*   **Backend CMS**: **Payload CMS** (version 3.x).
    *   **Core**: Built on Node.js and Express.js (under the hood).
    *   **Rich Text Editor**: Lexical.
*   **Styling**: **Tailwind CSS** (latest version).
    *   **PostCSS**: Used for processing Tailwind CSS.
*   **Database**: **MongoDB** (version 5.x+ recommended).
    *   **ODM**: Mongoose (used internally by Payload CMS).
*   **Runtime Environment**: **Node.js** (version 18.x or 20.x LTS recommended).
*   **Package Manager**: **pnpm** (preferred for its efficiency, disk space savings, and robust monorepo support).
## 4. Key Dependencies & Their Roles (Summary - Not Exhaustive)

*   **`next`**: The core Next.js framework for building the React-based frontend.
*   **`react`, `react-dom`**: Libraries for building user interfaces.
*   **`payload`**: The core Payload CMS package, providing the headless CMS functionality.
*   **`@payloadcms/db-mongodb`**: The official Payload plugin (database adapter) for connecting to and interacting with a MongoDB database.
*   **`@payloadcms/richtext-lexical`**: The official Payload plugin providing the Lexical rich text editor for content fields.
*   **`@payloadcms/bundler-webpack` / `@payloadcms/bundler-esbuild`**: Payload plugins responsible for bundling the admin panel and server-side CMS code. Esbuild is generally faster.
*   **`tailwindcss`**: A utility-first CSS framework for styling the frontend.
*   **`typescript`**: Adds static typing to JavaScript, used throughout the project.
*   **`eslint`**: A pluggable linter tool for identifying and reporting on patterns in JavaScript/TypeScript.
*   **`prettier`**: An opinionated code formatter.
*   **`graphql`**: Necessary for Payload's GraphQL API functionality, which is a primary way the frontend will fetch data.
*   **`mongoose`**: (Indirect dependency via `@payloadcms/db-mongodb`) An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **`pnpm`**: The package manager used for the project, managing dependencies and workspaces.

*(Refer to `package.json` for the complete and up-to-date list of dependencies and their versions.)*
## 2. Development Environment & Setup

*   **Operating System**: Development can be done on Linux, macOS, or Windows (WSL2 recommended for Windows users for better compatibility and performance).
*   **IDE**: **Visual Studio Code (VS Code)** is highly recommended.
    *   **Essential VS Code Extensions**:
        *   ESLint (dbaeumer.vscode-eslint)
        *   Prettier - Code formatter (esbenp.prettier-vscode)
        *   Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
        *   Path Intellisense (christian-kohler.path-intellisense)
        *   DotENV (mikestead.dotenv) for `.env` file syntax highlighting.
        *   GitLens (eamodio.gitlens) for enhanced Git capabilities.
        *   Material Icon Theme (PKief.material-icon-theme) or similar for better file/folder visibility.
*   **Version Control**: **Git**, with repositories hosted on **GitHub**.
*   **Node.js Version Manager**: Recommended to use a Node.js version manager like **nvm** (Node Version Manager) or **fnm** (Fast Node Manager) to easily switch between Node.js versions.
*   **Local Development Server**:
    *   The Next.js development server (`pnpm dev`) will serve both the frontend application and the Payload CMS admin panel/API, as Payload is integrated within the Next.js app structure.
*   **Key Dependencies (Illustrative - refer to `package.json` for the definitive list)**:
    *   **Frontend**: `next`, `react`, `react-dom`, `tailwindcss`, `autoprefixer`, `postcss`.
    *   **Backend (Payload CMS)**: `payload`, `@payloadcms/db-mongodb` (database adapter), `@payloadcms/richtext-lexical` (rich text editor), `@payloadcms/bundler-webpack` (or `@payloadcms/bundler-esbuild` if preferred for faster builds), `graphql`.
    *   **Development**: `typescript`, `@types/react`, `@types/node`, `eslint`, `eslint-config-next`, `prettier`, `pnpm`.
*   **Project Setup Steps (High-Level)**:
    1.  Clone the repository from GitHub.
    2.  Ensure Node.js (LTS version, e.g., 18.x or 20.x) and pnpm are installed.
    3.  Navigate to the project root directory.
    4.  Run `pnpm install` to install all dependencies.
    5.  Create a `.env` file by copying `.env.example` (if it exists) or by creating it manually. Populate it with necessary environment variables:
        *   `MONGODB_URI`: Connection string for your MongoDB instance.
        *   `PAYLOAD_SECRET`: A strong, unique secret key for Payload CMS cryptographic functions.
        *   `NEXT_PUBLIC_SERVER_URL`: The public URL where the application will be hosted (e.g., `http://localhost:3000` for local development).
        *   Other environment-specific variables as needed.
    6.  Run `pnpm dev` to start the development server. The Next.js frontend will typically be available at `http://localhost:3000`, and the Payload admin panel at `http://localhost:3000/admin`.
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

## 3. Technical Constraints & Considerations

*   **Deployment Environment**: While Vercel is ideal for Next.js, the integrated Payload CMS backend means the deployment target must support Node.js execution for the CMS part. This could be Vercel (with serverless functions for Payload API/admin), a traditional Node.js server, or containerization (e.g., Docker).
*   **Build Times**: As the project grows, build times for both Next.js and Payload (if using webpack bundler for Payload) can increase. Consider optimizing build processes or exploring faster bundlers like esbuild for Payload if not already default.
*   **Cold Starts (if Serverless)**: If Payload CMS is deployed as serverless functions (e.g., on Vercel), cold start times for API requests or admin panel access can be a concern. Strategies to mitigate this might include provisioned concurrency (if available/cost-effective) or warming functions.
*   **Database Performance**: MongoDB performance will be critical. Proper indexing, query optimization, and potentially a managed MongoDB service (like MongoDB Atlas) should be considered for production.
*   **Scalability**: 
    *   **Frontend**: Next.js offers good scalability through SSG, ISR, and edge functions (on platforms like Vercel).
    *   **Backend**: Payload CMS scalability depends on the Node.js server/functions and MongoDB. Horizontal scaling of Node.js instances and a robust MongoDB cluster will be needed for high traffic.
*   **Security**: 
    *   Regularly update dependencies to patch vulnerabilities.
    *   Implement strong access control within Payload CMS.
    *   Secure environment variables and secrets (e.g., `PAYLOAD_SECRET`, database credentials).
    *   Protect against common web vulnerabilities (XSS, CSRF, SQL/NoSQL injection - though Payload helps mitigate some of these).
    *   Consider rate limiting for APIs if abuse is a concern.
*   **State Management (Frontend)**: For complex global state, carefully choose between React Context, Zustand, Jotai, or other libraries to avoid performance bottlenecks or overly complex solutions.
*   **Monorepo Management (if applicable)**: If the project evolves into a true monorepo with shared packages, tools like Turborepo or Nx might be considered for build optimization and dependency management, though for the current integrated setup, pnpm workspaces might suffice if separation becomes more distinct.
## 6. Version Control

*   Git (implied by `.gitignore`).

## 7. Code Quality & Conventions

*   **ESLint** and **Prettier** are configured for linting and formatting, ensuring code consistency.
*   **TypeScript** is used for type safety and improved developer experience.
*   The project structure separates concerns between frontend, Payload admin, and shared client logic.