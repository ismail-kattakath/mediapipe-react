# Playground-Next

A Next.js App Router playground for testing and developing `@ismail-kattakath/mediapipe-react`.

## Purpose

This playground app serves as:

- **Development environment** for testing new MediaPipe features
- **Integration testing** for Next.js App Router compatibility
- **Live demo** of library capabilities

## Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- A local MediaPipe model file (`.bin` or `.task`)

### Installation

From the **monorepo root**, install all dependencies:

```bash
pnpm install
```

This automatically installs dependencies for all workspaces, including this playground.

### Adding Model Files

MediaPipe models are **not included** in this repository due to their size. You'll need to download them separately.

#### Option 1: Download Pre-trained Models

Download a compatible model from [Kaggle Models](https://www.kaggle.com/models) or [Hugging Face](https://huggingface.co/):

**Recommended GenAI models:**

- [Gemma 2B IT GPU INT4](https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-gpu-int4)
- [Llama 3.2 1B](https://huggingface.co/meta-llama/Llama-3.2-1B)

#### Option 2: Use Your Own Model

If you have a custom `.tflite` or `.task` model, place it in the `public/models/` directory.

#### File Structure

```
apps/playground-next/
└── public/
    └── models/
        ├── gemma-2b-it-gpu-int4.bin
        └── your-custom-model.task
```

> [!IMPORTANT]
> Model files can be **very large** (500MB - 2GB). They are gitignored by default. Never commit model files to the repository.

### Running the Playground

#### From the Monorepo Root (Recommended)

Use Turborepo to run the playground with automatic rebuilding of the core library:

```bash
pnpm dev
```

This starts:

- **Core library** in watch mode (auto-rebuilds on changes)
- **Playground-Next** on `http://localhost:3000`
- **Playground-Vite** on `http://localhost:5173`

#### Run Only This Playground

If you only want to run the Next.js playground:

```bash
pnpm dev --filter playground-next
```

Or from this directory:

```bash
cd apps/playground-next
pnpm dev
```

> [!NOTE]
> When running from this directory, changes to `packages/core` won't automatically rebuild. You'll need to manually run `pnpm build` in the core package.

### Using Turbo Filters

Turborepo supports powerful filtering to run specific workspaces:

```bash
# Run dev for playground-next only
pnpm dev --filter playground-next

# Run build for all apps
pnpm build --filter "./apps/*"

# Run tests for core package only
pnpm test --filter @ismail-kattakath/mediapipe-react
```

Learn more about [Turbo filters](https://turbo.build/repo/docs/core-concepts/monorepos/filtering).

## Environment Variables

Create a `.env.local` file in this directory for local configuration:

```env
# Optional: Custom model path
NEXT_PUBLIC_MODEL_PATH=/models/gemma-2b-it-gpu-int4.bin

# Optional: Custom WASM path
NEXT_PUBLIC_WASM_PATH=/wasm
```

Then access them in your components:

```tsx
const modelPath = process.env.NEXT_PUBLIC_MODEL_PATH || "/models/default.bin";
```

## Project Structure

```
apps/playground-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with MediaPipeProvider
│   │   ├── page.tsx         # Home page
│   │   └── components/      # Demo components
│   └── ...
├── public/
│   └── models/              # Place your .bin/.task files here
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Development Workflow

1. **Make changes** to `packages/core/src/`
2. **Turborepo automatically rebuilds** the core library
3. **Next.js hot-reloads** the playground app
4. **Test your changes** in the browser at `http://localhost:3000`

### Testing New Features

When developing a new MediaPipe feature:

1. Add the hook/component to `packages/core/src/`
2. Create a demo page in `src/app/` to test it
3. Verify it works in both development and production builds

### Building for Production

```bash
# From monorepo root
pnpm build --filter playground-next

# Or from this directory
pnpm build
```

This creates an optimized production build in `.next/`.

## Troubleshooting

### "Module not found" errors

If you see import errors for `@ismail-kattakath/mediapipe-react`:

1. Ensure you've run `pnpm install` from the monorepo root
2. Build the core package: `pnpm build --filter @ismail-kattakath/mediapipe-react`
3. Restart the dev server

### Model fails to load

- Check that the model file exists in `public/models/`
- Verify the file path in your component matches the actual filename
- Check browser console for network errors
- Ensure the model format is compatible (`.bin` or `.task`)

### Changes to core library not reflecting

- Ensure you're running `pnpm dev` from the monorepo root (not this directory)
- Check that Turborepo is watching the core package
- Try manually rebuilding: `pnpm build --filter @ismail-kattakath/mediapipe-react`

## Contributing

This playground is part of the main monorepo. For contribution guidelines, see the [main CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT © [Ismail Kattakath](../../LICENSE)
