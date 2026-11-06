# AgriSync frontend prototype

AgriSync is an agricultural market intelligence project. This repository currently contains a React frontend prototype for farmers to review sample market prices, produce, selling considerations, local weather placeholders, and related tools.

The screens use illustrative sample content so the workflows and visual hierarchy can be reviewed before API integration. **This is not connected to a backend, authentication, live market or weather feeds, forecast models, or an AI assistant service.** Do not use the sample values to make real agricultural decisions.

## Run locally

Install dependencies and start Vite:

```bash
npm ci
npm run dev
```

On Windows Command Prompt:

```cmd
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production frontend build. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Run ESLint. |

## Current prototype screens

- **Overview:** sample market note, crop watchlist, and shortcuts to key actions.
- **Market:** searchable illustrative price board.
- **My produce:** sample listings and a local draft form.
- **Recommendations:** illustrative selling window and decision factors.
- **Weather:** location and weather placeholders, marked as non-live.
- **Assistant:** local question composer; it does not generate advice.
- **Notifications:** sample updates with local read state.
- **Settings:** sample profile context and language selector.

## Product and design goals

- Keep the frontend clear, easy to understand, elegant, distinctive, and uncluttered, while keeping features visible.
- Use Fraunces for display headings and Instrument Sans for UI, with Noto Sans/Serif Devanagari fallbacks for Hindi and Marathi.
- Keep dark mode soothing and ensure text, controls, and forms remain readable and usable.
- Avoid tiny text in Activity, Weather, and other supporting sections.
- Support English, Hindi, and Marathi throughout the interface, with Devanagari typography that fits the existing design.
- Keep focused updates isolated; do not disturb unrelated UI elements or existing functionality.

## Current frontend structure and behavior

The browser entry flow is `index.html` -> `src/main.jsx` -> `src/App.jsx`. The app uses React state for in-page navigation; it does not currently use a URL router or API layer.

- `src/App.jsx` owns the page components, sample data, navigation, local preferences, and Overview-only illustration mounts. `src/i18n.js` initializes i18next/react-i18next; `src/locales/hi.json` and `src/locales/mr.json` hold the Hindi and Marathi catalogs.
- `src/App.css` contains the main layout, responsive component styling, typography, and light/dark presentation. `src/index.css` contains global resets and browser defaults.
- `src/motion.css` contains motion styles and tokens, sidebar behavior, reduced-motion rules, and Overview background effects. `src/motion.js` contains count-up and value-flash behavior, page and theme transitions, sidebar indicator movement, and motion observers.
- `src/overview-illustration.js` mounts the Overview's inline animated SVG harvest illustration and removes its listeners when the user leaves Overview. `src/overview-illustration.css` contains its palette, motion and small-screen layout.
- `src/floating-produce-field.js` mounts the seeded 18-item crop field on Overview. It looks for cut-outs under `public/assets/produce/` and falls back to inline SVG crop illustrations when files are absent.
- `src/overview-ambient.js` mounts the Overview-only soft light field, ray, particles, contour lines, and desktop pointer parallax. It cleans up when leaving Overview and respects reduced motion and visibility changes.
- The active Overview uses inline SVG produce artwork; it does not load 3D models or PBR texture files.

Theme, language, and desktop sidebar preferences use the browser's local storage keys `agrisync-theme`, `agrisync-language`, and `agrisync-sidebar`. These preferences are not associated with an account. The produce draft, assistant questions, and notification read state are also local prototype interactions.

## Project context and recent work

The broader product vision is to help farmers and buyers make better decisions by connecting market intelligence, supply, demand, weather, and explainable recommendations. Intended future modules include authentication and role-based access, marketplace workflows, real market/weather integrations, demand and price forecasting, farmer-buyer matching, a demand-supply synchronization index (DSSI), notifications, and an AI assistant. Those are goals, not claims about the implementation in this repository.

Frontend work recorded so far:

- Established the requested Fraunces / Instrument Sans typography system and Devanagari fallbacks.
- Added the light/dark theme control, larger supporting text, and working English/Hindi/Marathi language selection.
- Added a sidebar toggle with desktop persistence, a mobile drawer, keyboard handling, and accessibility behavior.
- Added a set of motion effects with reduced-motion handling.
- Added an Overview-only animated SVG harvest illustration, a floating produce field, and the ambient background animation.
- Replaced the former Overview 3D model scene with a 2D animated SVG illustration.

No crop cut-out files are present under `public/assets/produce/`. The floating produce field uses inline SVG fallbacks without them. Unused GLB/FBX/OBJ model files and their PBR textures have been removed from `src/assets/` because the current Overview does not load them.

## Verification and limitations

- `npm.cmd run lint` and `npm.cmd run build` passed after the i18next localization update on 6 November 2026.
- Hindi and Marathi were rendered in the Overview at a 390px mobile viewport; both use the configured Devanagari font stack and 1.65 line-height. Responsive widths from 320px through 900px were checked during the Overview layout update.
- A DevTools Performance recording was not performed. Frame timing under sustained animation remains unverified.
- The interface marks its content as illustrative. Connect and validate backend APIs and real data before using it for agricultural decisions.

## Conversation continuity

This README now includes the project goals, implementation notes, and recent updates previously recorded in `AgriSync_Chat_Handoff.md`. The handoff file remains as a compact continuity note. The conversation itself is not a verbatim transcript in either file.

## Things to be fixed

| Thing to be fixed | Developer name responsible |
| --- | --- |

## Things that need to be created

| Thing to be created                              | Developer name responsible |
| ------------------------------------------------ | -------------------------- |
| Start backend and database development,          |                            |
|  including the API, data model, and integrations |                            |
|  needed to replace prototype-only data.          |                            |

## Things that are fixed

| Thing fixed                                              | Developer name who fixed it |
| -------------------------------------------------------- | --------------------------- |
| Removed the Overview hero's Three.js                     |            Anuj             |
|  produce models and replaced them                        |                             | 
|  with a responsive animated 2D SVG illustration.         |                             |

