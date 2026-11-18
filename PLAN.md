# Kanban MVP Plan

## Phase 1: Scaffold

- [x] Create the Next.js app in `frontend` using the latest stable idiomatic setup.
- [x] Add the project `.gitignore`, minimal README, scripts, and required dependencies.
- [x] Configure the client-rendered app and global theme using the provided color palette.

Success criteria:
- `frontend` builds successfully.
- The app starts locally with no required environment configuration.
- The repository contains no generated dependency or build directories.

## Phase 2: Board UI

- [x] Implement one board with exactly five fixed columns.
- [x] Populate the initial board with representative dummy cards.
- [x] Add an elegant column-name rename interaction.
- [x] Add card title/details display and delete controls.
- [x] Add an add-card form or dialog for the selected column.
- [x] Implement drag and drop movement between columns.

Success criteria:
- The board always renders five columns.
- Column names can be changed.
- Cards can be added, deleted, and moved.
- No persistence or user-management functionality is introduced.

## Phase 3: Unit and Component Tests

- [x] Set up a concise modern test runner.
- [x] Test initial dummy data and fixed column count.
- [x] Test column renaming.
- [x] Test card creation and deletion.
- [x] Test state transitions used for drag and drop.

Success criteria:
- Focused unit/component tests pass.
- Tests cover each requested MVP behavior.
- No test depends on browser storage or persistence.

## Phase 4: Integration and Visual Testing

- [x] Run the app and verify desktop and responsive layouts.
- [x] Use Playwright or an equivalent browser runner for critical workflows.
- [x] Verify column rename, card add/delete, drag and drop, and dummy-data loading.
- [x] Inspect and correct visual defects against the supplied palette.

Success criteria:
- Core workflows pass in a real browser.
- Drag and drop works reliably between all five columns.
- Layout remains usable at representative desktop and mobile widths.
- No console errors occur during critical workflows.

## Phase 5: Final Verification

- [x] Run the full relevant test suite and production build.
- [x] Review the final diff for scope creep and accidental extra features.
- [x] Start the development or production server and verify it responds locally.

Success criteria:
- Tests and build pass.
- Only the requested MVP functionality is present.
- The server is running and ready for the user.
