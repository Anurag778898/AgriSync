# AgriSync frontend prototype

AgriSync is an agricultural market intelligence project. This branch currently contains a React frontend prototype with a decision-first overview and navigation for market prices, produce, recommendations, weather, the assistant, notifications, and preferences.

The screens use illustrative sample content so the intended workflows and visual hierarchy can be reviewed before API integration. No backend, authentication, live market or weather feeds, forecast models, or AI assistant service is connected. Actions that change the interface are local to the current browser session.

## Run locally

```bash
npm ci
npm run dev
```

### Windows Command Prompt

From Command Prompt, run:

```cmd
cd /d C:\Users\dhank\Engg-Projects\AgriSync
npm ci
npm run dev
```

Open the local URL printed by Vite in your browser (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — create a production frontend build.
- `npm run preview` — preview a production build.
- `npm run lint` — run ESLint.

## Current prototype screens

- **Overview:** sample market note, crop watchlist, and shortcuts to key actions.
- **Market:** filterable illustrative price board.
- **My produce:** sample listings and a local draft form.
- **Recommendations:** illustrative selling-window card and decision factors.
- **Weather:** location and weather placeholder, explicitly marked as non-live.
- **Assistant:** local question composer with no generated advice.
- **Notifications:** sample updates with local read state.
- **Settings:** sample profile context and local language selector.

Treat all prices, profile information, activity, and weather content as placeholders. Connect and validate the backend APIs before using this interface for real agricultural decisions.
