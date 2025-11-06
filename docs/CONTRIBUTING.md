# Contributing & Testing

Guidelines to contribute and test changes in this repository.

1. Development workflow
- Create a topic branch from `main`.
- Open a pull request with a clear description of the change and which files were modified.

2. Tests & verification
- There are no automated tests included. For changes to DB queries, verify against a local MySQL instance containing the expected schema and seed data.
- Run the server locally with `npm start` and exercise endpoints with an HTTP client (Postman / curl).

3. Linting / Style
- Keep changes in the existing JavaScript style. The repo doesn't enforce ESLint or Prettier; if you add them, include configuration files and update package.json.

4. Documentation changes
- When updating or adding endpoints, update `docs/API.md` and any related service/controller comments.
