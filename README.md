# JEE Study Hub

Learn Smart. Practice Daily. Crack JEE.

A modern, mobile-friendly React site with chapter-wise notes, formulas, practice
questions, a question-strategy guide, a printable formula sheet, an owner notes
editor, and a student Community (discussion forum, study groups, daily
challenge, live chat) — built for JEE Main & Advanced aspirants.

## Tech stack

- [Vite](https://vitejs.dev/) + React 18
- [Tailwind CSS](https://tailwindcss.com/) for layout & utilities
- [lucide-react](https://lucide.dev/) for icons
- Plain CSS variables for theming/dark mode (no extra state library needed)

All app data (notes, questions, forum posts, chat) currently lives in React
state, so it resets on page refresh — it's ready to be wired up to a real
backend (Firebase, Supabase, a custom API, etc.) whenever you want persistence
and real user accounts.

## Project structure

```
jee-study-hub/
├── index.html          # HTML shell, fonts, SEO meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx         # React entry point
    ├── index.css        # Tailwind directives
    └── App.jsx          # The entire application (pages, components, data)
```

## Run locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

The production build is output to `dist/`.

## Deploy on Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and
   import the repository.
3. Vercel auto-detects Vite — keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. Every future push to the connected branch redeploys
   automatically.

## Deploy on GitHub Pages

1. In `vite.config.js`, uncomment and set the `base` option to your repo name:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: "/your-repo-name/",
   });
   ```

2. Install the deploy helper and add a deploy script:

   ```bash
   npm install --save-dev gh-pages
   ```

   Add to `package.json` scripts:

   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Deploy:

   ```bash
   npm run deploy
   ```

4. In your GitHub repo settings → Pages, set the source to the `gh-pages`
   branch (created automatically by the command above).

## Customizing content

Nearly all site content (chapter notes, formulas, practice questions,
community seed data) lives near the top of `src/App.jsx` in a few constants:

- `initialSubjectData` — Physics/Chemistry/Mathematics chapter notes
- `initialQuestions` — practice questions bank
- `formulaSheet` — formula sheet entries
- `seedThreads`, `seedGroups`, `dailyChallenge`, `chatRoomsSeed` — community data

Edit these directly, or use the in-app **Editor** toggle (top-right of the
header) to add/edit/delete subject notes through the UI.
