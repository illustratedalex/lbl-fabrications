# LBL Fabrications App

Dedicated standalone Next.js app for the LBL Fabrications website.

## Purpose

- Staging domain target: lbl.staging.deadsignal.co
- Production domain target: lblfabrications.com
- Independent Vercel project from the main DeadSignal website

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

- / : Initial marketing homepage scaffold
- /workspace : Client collaboration workspace route

## Independent Vercel deployment

Create a new Vercel project and set the root directory to `lbl-fabrications`.

Recommended project settings:

- Framework Preset: Next.js
- Install Command: npm install
- Build Command: npm run build
- Output command: npm run start (for preview runtime)

After project creation:

1. Attach lbl.staging.deadsignal.co for staging.
2. Attach lblfabrications.com for production.
