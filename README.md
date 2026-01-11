# bundycrush
An educational word search puzzle game for humans. Play career mode or invite friends to play together.

## Built with

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite** - Database engine
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses SQLite with Drizzle ORM.

1. Make sure you have a SQLite database set up.
2. Apply the schema to your database:
```bash
pnpm run db:push
```


Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).
The web socket API is running at [http://localhost:3003](http://localhost:3003).

For better observability, I recommend you run each service seperately. Check the [Available Scripts](#available-scripts) section below for the necessary scripts.

## Project Structure

```
wordsearch/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, TRPC, Bun)
├── packages/
│   ├── api/         # API layer / business logic
│   └── db/          # Database schema & queries
│   └── auth          # Authentication
│   └── env          # Environment variables
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:ws`: Start only the websocket application.
- `pnpm run dev:server`: Start only the server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:studio`: Open database studio UI
- `pnpm run check`: Run Oxlint and Oxfmt


## Contribution
All contributions are welcomedd. Kindly open an issue or submit a PR request