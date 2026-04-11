# APP Environment Variable Reference

## Overview

Use the `APP` environment variable to select which app/portfolio to build or develop:

```bash
APP=app-name yarn dev
APP=app-name yarn build
```

## Available Apps

Register all apps in `.fachadarc.json`:

```json
{
  "defaultApp": "default-fachada",
  "apps": {
    "default-fachada": "apps/default-fachada/app.config.ts",
    "engineer": "apps/engineer/app.config.ts",
    "artist-engineer": "apps/artist-engineer/app.config.ts"
  }
}
```

### Default App

**`default-fachada`** — Used when `APP` is not set

```bash
yarn dev          # Uses default-fachada
yarn build        # Uses default-fachada
```

### All Available Apps

| App Name          | Description                                     | Location                             |
| ----------------- | ----------------------------------------------- | ------------------------------------ |
| `default-fachada` | Generic developer portfolio framework showcase  | `apps/default-fachada/app.config.ts` |
| `engineer`        | Backend engineer role (restricted theme)        | Not currently in `.fachadarc.json`   |
| `artist-engineer` | Multi-role portfolio: engineer + digital artist | `apps/artist-engineer/app.config.ts` |

## Usage Examples

```bash
# Use default app
yarn dev

# Use specific app
APP=artist-engineer yarn dev
APP=artist-engineer yarn build

# Use another app
APP=default-fachada yarn build
```

## Custom Themes in Artist-Engineer App

The `artist-engineer` app includes 3 custom themes:

- **minimal** — Cool sky blue accents (#0EA5E9)
- **warm** — Amber/orange accents (#D97706)
- **bold** — Vibrant magenta accents (#A855F7)

To verify they're loaded:

```bash
APP=artist-engineer yarn dev
# Open browser console:
# window.__FACHADA_THEME_POOL__
# Should show: {minimal: {...}, warm: {...}, bold: {...}}
```

## Removing PROFILE (Legacy)

As of this update, **only `APP` is supported**. The legacy `PROFILE` environment variable has been removed:

❌ REMOVED:

```bash
PROFILE=artist-engineer-multi yarn dev
```

✅ USE INSTEAD:

```bash
APP=artist-engineer yarn dev
```

## Adding a New App

1. Create `apps/your-app/app.config.ts`
2. Create profile configs in `src/profiles/your-app/`
3. Add entry to `.fachadarc.json`
4. Run: `APP=your-app yarn dev`

See [README.md](../README.md#-creating-new-apps) for full instructions.
