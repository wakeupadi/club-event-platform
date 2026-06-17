# Backend Code - EventHub

This directory contains the serverless REST API endpoints, Server Actions, integration tests, and database connector scripts:

- **`app/api/`**: REST API endpoints for user sessions, club sessions, role cookies, and collaboration metrics.
- **`app/actions/`**: Server Actions (suggestBestDates, createEventAction, rsvpToEvent) executing the algorithmic logic.
- **`lib/`**: Shared connection modules (Prisma client pool and cookie session parsers).
- **`scripts/`**: Database reset utilities and programmatic test suites.

*Note: For runtime instructions, please refer to the main [README.md](../README.md) at the root of the repository.*
