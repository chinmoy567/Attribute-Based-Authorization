# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server with nodemon (hot-reload)
npm run token    # generate a test JWT token (logged to console)
```

No test runner is configured. There is no build step — the app runs directly with Node.js ESM.

## Environment

Copy `.env` to configure:

```
PORT=3000
JWT_SECRET=MY_NAME_IS_CHINMOY
```

Defaults in `src/config/env.js`: port `5002`, secret `dev_secret_key`.

## Architecture

This is an Express.js REST API demonstrating **Attribute-Based Access Control (ABAC)**. All data is in-memory (no database).

### Request flow

```
Client → JWT auth (verifyToken) → controller → authorize(policy, resource) → response
```

1. **Login** (`POST /api/project/login`) — accepts `{ userId }`, finds the user in `mockUsers`, signs their full profile as the JWT payload. The entire user object (`role`, `department`, `accessLevel`) travels in the token.
2. **Protected routes** — `verifyToken` middleware decodes the token and attaches the user to `req.user`.
3. **Authorization** — `authorize` in `src/middleware/authorize.js` is a higher-order function: `authorize(policyFn, resource)` returns middleware that calls `policyFn(req.user, resource)` and either calls `next()` or responds 403.
4. **Policies** (`src/policies/projectPolicy.js`) — pure functions `(user, project) → { permitted: bool, reason: string }`. `canUpdateProject` also checks server time (business hours 9–17) as an environmental attribute example.

### Key data shapes

**User** (stored in JWT):
```js
{ id, name, role: "admin"|"manager"|"employee", department, accessLevel }
```

**Project** (in-memory):
```js
{ id, name, department, accessLevel, team: [userId, ...] }
```

### Authorization rules summary

| Action | Permitted when |
|--------|---------------|
| View   | admin role, OR same department, OR team member with sufficient accessLevel |
| Update | admin role (anytime), OR manager in same dept / team member (business hours only) |

### Adding a new resource type

1. Add data to `src/data/projectData.js`
2. Create a policy file in `src/policies/`
3. Add controller functions in `src/controller/` calling `authorize(newPolicy, resource)`
4. Register routes in `src/routes/` with `verifyToken` and the controller
