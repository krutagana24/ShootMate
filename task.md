# Database Migration Checklist

- `[x]` Define User Mongoose model (`server/models/User.ts`) containing only the requested fields.
- `[x]` Define Project Mongoose model (`server/models/Project.ts`) containing only the requested fields.
- `[x]` Update database configuration and routes in `server.ts` for simplified registration, login (with bcryptjs password hashing), and Google auth.
- `[x]` Add project booking API endpoints in `server.ts`.
- `[x]` Synchronize `StateContext.tsx` authentication and booking methods to call the backend APIs.
- `[x]` Verify that registration, login, and project saving work correctly and persist to MongoDB.
