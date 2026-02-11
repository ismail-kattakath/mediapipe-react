# Contributing to @ismail-kattakath/mediapipe-react

First off, thank you for considering contributing to `@ismail-kattakath/mediapipe-react`! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## Monorepo Structure

This project is a monorepo managed with **pnpm workspaces** and **Turborepo**.

- `packages/core`: The main library package.
- `apps/playground-next`: A Next.js playground for testing and demonstrating features.
- `apps/playground-vite`: A Vite + React playground for testing and demonstrating features.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ismail-kattakath/mediapipe-react.git
   cd mediapipe-react
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run the playgrounds**:
   ```bash
   pnpm dev
   ```
   This will start both playgrounds. You can access the Next.js playground at `http://localhost:3000` and the Vite playground at `http://localhost:5173`.

## Adding New MediaPipe Tasks (e.g., Vision)

To add a new task like `vision` or `audio`:

1.  **Draft the logic**: Create a new file in `packages/core/src/[task].ts` (e.g., `vision.ts`).
2.  **Define the Interface**:
    - Initialize the specific MediaPipe task (e.g., `ImageClassifier`).
    - Create a React hook (e.g., `useVision`) that wraps the task logic.
    - Ensure the hook uses the `MediaPipeProvider` context for `wasmPath`.
    - Implement worker-based execution if the task is computationally expensive (recommended).
3.  **Export the Subpath**: Update `packages/core/package.json`'s `exports` field:
    ```json
    "exports": {
      "./[task]": "./dist/[task].js"
    }
    ```
4.  **Configure Build**: Update `tsup.config.ts` in `packages/core`:
    ```typescript
    entry: [..., "src/[task].ts"],
    ```
5.  **Documentation**: Add a simple example in `README.md` or a dedicated doc if needed.

## Development Workflow

- **Linting & Formatting**: We use `prettier` and `lint-staged`. These run automatically on pre-commit hook.
- **Versioning**: We use `@changesets/cli`. When you create a PR that should trigger a version bump, run `pnpm changeset` and follow the prompts.
- **CI**: Every PR runs linting and build checks via GitHub Actions.

## Submitting a Pull Request

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and ensure they follow the project's coding standards.
4. Run `pnpm changeset` if your changes affect the public API.
5. Submit a pull request with a clear description of your changes.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers.
