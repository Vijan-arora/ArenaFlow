# Contributing to ArenaFlow

Thank you for your interest in contributing to ArenaFlow! Here are the guidelines to get started.

## Development Workflow

1. **Fork and Clone**: Fork the repository on GitHub and clone your fork locally.
2. **Branching**: Create a feature branch off of `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Environment Setup**:
   - Copy `.env.example` to `.env` and fill in necessary keys.
   - Run `npm install` at the root to install all workspace dependencies.
4. **Testing**:
   - Run unit tests: `npm test`
   - Run E2E tests: `npm run test:e2e`
   - Verify coverage: `npm run test:coverage` (Target: 95%+)

## Commit Message Guidelines

We enforce Conventional Commits structure using `commitlint` and pre-commit hooks:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, auxiliary tools, and libraries

Example:
```
feat(assistant): add Arabic language support and RTL rendering
```

## Pull Request Guidelines

- Ensure linting and formatting pass: `npm run lint` and `npm run format`.
- Ensure all tests pass.
- Write clear descriptions of what changes were made and their visual impact (if any).
