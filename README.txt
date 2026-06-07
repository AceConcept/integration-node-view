integration-node-view

Vite + React integration node diagram UI.

Local development
  npm install
  npm run dev

Production build
  npm run build
  npm run preview

Deploy to Vercel

Option A — GitHub (recommended)
  1. Push this repo to GitHub.
  2. Import the repo at https://vercel.com/new
  3. Vercel detects Vite automatically (see vercel.json).
  4. Deploy with defaults:
       Build Command: npm run build
       Output Directory: dist
       Install Command: npm install

Option B — Vercel CLI
  npm i -g vercel
  vercel login
  vercel
  vercel --prod

No environment variables are required for this project.
