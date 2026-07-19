```markdown
# herenciapp Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `herenciapp` TypeScript codebase. It covers file naming, import/export styles, commit message conventions, and testing practices. By following these guidelines, contributors can ensure consistency and maintainability across the project.

## Coding Conventions

### File Naming
- Use **PascalCase** for all file names.
  - Example: `UserProfile.tsx`, `AuthService.ts`

### Import Style
- Use **relative imports** for referencing modules within the project.
  - Example:
    ```typescript
    import { AuthService } from '../services/AuthService';
    ```

### Export Style
- Use **named exports** rather than default exports.
  - Example:
    ```typescript
    // In AuthService.ts
    export function login() { ... }
    export function logout() { ... }

    // In another file
    import { login, logout } from './AuthService';
    ```

### Commit Message Convention
- Follow the **Conventional Commits** specification.
- Use prefixes such as `test` to indicate the type of change.
  - Example:
    ```
    test: add unit tests for UserProfile component
    ```
- Average commit message length is around 87 characters; be descriptive.

## Workflows

### Writing a New Feature
**Trigger:** When adding new functionality to the codebase  
**Command:** `/new-feature`

1. Create a new file using PascalCase (e.g., `NewFeature.tsx`).
2. Use relative imports to include dependencies.
3. Export your functions or components using named exports.
4. Write or update tests in a corresponding `.test.tsx` file.
5. Commit your changes with a conventional commit message (e.g., `feat: add NewFeature component`).

### Running Tests
**Trigger:** To verify code correctness before committing or merging  
**Command:** `/run-tests`

1. Ensure all test files are named with the `.test.tsx` pattern.
2. Run the Jest test suite:
    ```bash
    npx jest
    ```
3. Review test results and fix any failing tests.

### Writing Tests
**Trigger:** When adding or updating features  
**Command:** `/write-tests`

1. Create a test file named after the component or module, ending with `.test.tsx` (e.g., `UserProfile.test.tsx`).
2. Use Jest for writing unit and integration tests.
    ```typescript
    import { render } from '@testing-library/react';
    import { UserProfile } from './UserProfile';

    test('renders user name', () => {
      // Test implementation
    });
    ```
3. Commit with a `test:` prefix in your message.

## Testing Patterns

- All tests are written using **Jest**.
- Test files follow the `*.test.tsx` naming convention and are colocated with the code they test.
- Example test file:
    ```typescript
    // UserProfile.test.tsx
    import { render } from '@testing-library/react';
    import { UserProfile } from './UserProfile';

    test('renders user name', () => {
      // Test implementation
    });
    ```

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /new-feature   | Start a new feature with proper conventions  |
| /run-tests     | Run all Jest tests in the codebase           |
| /write-tests   | Add or update tests for a module/component   |
```