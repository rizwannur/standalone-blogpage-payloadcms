# Tech Context

This project utilizes a modern JavaScript ecosystem for both frontend and backend development.

## Technologies Used:
- **Frontend:**
  - **Next.js:** React framework for building the user interface.
  - **React:** JavaScript library for building user interfaces.
  - **TypeScript:** Superset of JavaScript that adds static typing.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
  - **Shadcn/ui:** Reusable components built with Tailwind CSS and Radix UI.
- **Backend/CMS:**
  - **Payload CMS:** Headless CMS built with Node.js, React, and MongoDB/PostgreSQL.
  - **Node.js:** JavaScript runtime environment.
  - **Express.js:** Web application framework for Node.js (used by Payload).
- **Database:**
  - **MongoDB:** NoSQL database (default for Payload, though PostgreSQL is also an option).

## Development Setup:
- **Package Manager:** `bun` (or `npm`/`yarn`)
- **Environment Variables:** Managed via `.env` file.
- **Code Editor:** VS Code (with recommended extensions).
- **Linting & Formatting:** ESLint and Prettier.

## Technical Constraints:
- **Payload CMS Structure:** Adhering to Payload's collection and global configurations.
- **Next.js Data Fetching:** Utilizing Next.js's data fetching mechanisms (getServerSideProps, getStaticProps, etc.).
- **Database Schema:** Defined by Payload CMS configurations.

## Dependencies:
- All project dependencies are managed via `package.json` and `bun.lock` (or `package-lock.json`/`yarn.lock`).
- Key dependencies include `next`, `react`, `payload`, `mongodb`.