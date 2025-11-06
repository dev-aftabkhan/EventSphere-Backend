# API Reference

Base URL: /api

Authentication & Headers:
- `x-api-key`: required on routes guarded by API key middleware. API keys are validated in the `api_keys` table and have an `access_level` value.
- `Authorization`: `Bearer <JWT>` for routes protected by `authMiddleware`.

Routes (summary):

Auth
- POST `/api/auth/register` — register new user. Body: `{ username, email, password }`.
- POST `/api/auth/login` — log in. Body: `{ email, password }`.
- GET `/api/auth/auto-login` — verify token and return user details. Header: `Authorization: Bearer <token>`.

Image
- POST `/api/image/upload` — Upload an image. Headers: `x-api-key` (admin-level), multipart form field `image`. Body (form fields): `eventId`, `uploadedBy`, `caption`.

Admin (requires admin-level API key)
- GET `/api/admin/users` — list users
- GET `/api/admin/events` — list events
- POST `/api/admin/events` — create event (body: event_name, event_description, date, created_by)
- PUT `/api/admin/events/:eventID` — update event
- DELETE `/api/admin/events/:eventID` — archive event
- GET `/api/admin/announcements` — list announcements
- POST `/api/admin/announcements` — create announcement
- DELETE `/api/admin/announcements/:announcementID` — mark announcement expired
- POST `/api/admin/roles` — create role
- PUT `/api/admin/organization/:orgID` — update organization

Leader (requires leader-level API key)
- GET `/api/leader/events/:eventID/members` — get event members with roles
- GET `/api/leader/events/:eventID/roles` — get event roles
- PUT `/api/leader/events/members/role` — edit user role (body: event_member_id, role_id, event_id)
- PUT `/api/leader/events/role` — manage event roles (body includes event_id, role_name etc.)
- GET `/api/leader/events/:eventID/members/:username` — find member by username
- GET `/api/leader/events/members/request` — get join requests
- POST `/api/leader/events/members` — add member to event
- PUT `/api/leader/events/members/request_status` — update request status
- DELETE `/api/leader/users/:userID` — remove user (soft delete)

Fetch (public-ish, gated by API key with access level 4)
- GET `/api/fetch/events` — event cards (query params: `status`, `visibility`)
- GET `/api/fetch/events/current` — current events
- GET `/api/fetch/event/:event_id` — event details
- GET `/api/fetch/event/:event_id/images` — images for event (query param `sort`)
- GET `/api/fetch/organizations` — organizations
- GET `/api/fetch/announcements/latest` — latest announcements

User
- POST `/api/user/raiseTicket` — raise support ticket (requires `authMiddleware` and a valid JWT). Token must include `member_id` in payload.

Response format
- Most endpoints return JSON with either `{ success: true, ... }` or an error object `{ success: false, error: '...' }` and standard HTTP status codes.

Notes
- Controller functions are in `controllers/`; services that interact with DB/logic reside in `services/`.
- The services use `config/mysqlConfig.js` (MySQL pool) for primary data access and `database/mongodb/*` Mongoose models for logs.
