# GcpTrainer

[![Live on Vercel](https://img.shields.io/badge/live-gcp--trainer.vercel.app-black?logo=vercel&logoColor=white)](https://gcp-trainer.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest&logoColor=white)](#getting-started)
[![License: all rights reserved](https://img.shields.io/badge/license-all%20rights%20reserved-lightgrey)](#license)

Keep your GCP sharp. GcpTrainer is a bilingual (EN/FR) learning app that
combines architect-level lessons, spaced repetition flashcards and
hands-on exercises covering Google Cloud Platform, wrapped in a
lightweight gamification loop (XP, levels, daily streak, activity
heatmap) designed for short daily sessions.

The content targets tech leads and freelancers: service landscape,
architecture trade-offs and the gotchas that come up in real missions
and interviews, rather than certification cramming.

**Live app:** [gcp-trainer.vercel.app](https://gcp-trainer.vercel.app)

Copyright (c) 2026 Riadh MNASRI. All rights reserved.

## Features

- **Lessons**: short, dense refreshers with gcloud commands, YAML and
  Terraform snippets, tips and gotchas. Written for people who already
  work in the cloud.
- **Flashcards**: Leitner spaced repetition (5 boxes), keyboard driven
  review sessions (Space to flip, 1-4 to grade).
- **Exercises**: quizzes, "predict the output" and "find the bug"
  challenges with detailed explanations.
- **Gamification**: XP, levels, daily streak with a GitHub-style
  heatmap, configurable daily goal. Rewards are strictly virtual.
- **Bilingual**: every piece of UI and content exists in English and
  French; switch instantly from the header or Settings.
- **Cross-device sync**: offline-first localStorage, with optional
  passphrase-protected sync through a Postgres-backed API, so progress
  survives machine changes.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack) on React 19 and
  TypeScript.
- **Styling**: Tailwind CSS 4.
- **Persistence**: localStorage offline-first, Neon Postgres (serverless
  driver) for the optional cross-device sync API route.
- **Testing**: Vitest, unit tests for the SRS and gamification engine.
- **Deployment**: Vercel, deployed from `main` via GitHub integration.

## Getting started

```bash
npm install
npm run dev
```

The app runs on **http://localhost:3838**.

```bash
npm run test    # unit tests (SRS scheduling, XP, streaks)
npm run build   # production build
npm run lint
```

## Cross-device sync setup

1. Copy `.env.example` to `.env.local` and set `GCPTRAINER_PASSPHRASE`
   to a long private sentence.
2. In production (Vercel), add a Neon Postgres integration so
   `DATABASE_URL` is provisioned; locally the API falls back to a JSON
   file under `data/`.
3. In the app, open Settings > Cross-device sync and enter the same
   passphrase on each machine.

Conflict handling is last-write-wins on the whole progress document
(see `docs/adr/0003-sync-strategy.md`).

## Architecture

```
app/                    Next.js App Router pages and the sync API route
components/             Reusable UI (header, heatmap, code blocks, ...)
lib/engine/             Topic-agnostic learning engine
  srs.ts                Leitner spaced repetition scheduling
  gamification.ts       XP, levels, streaks, heatmap buckets
  progress.tsx          Progress store, persistence and sync client
lib/i18n/               UI dictionaries and locale provider
lib/content/            Neutral content types and the pack loader
lib/server/             Storage adapters (Neon Postgres / local file)
content/packs/gcp/      The GCP content pack (manifest + modules)
docs/adr/               Architecture decision records
tests/                  Unit tests for the engine
```

The engine never references GCP: all topic-specific text lives in the
content pack as JSON, in both locales. See
`docs/adr/0001-engine-content-separation.md`.

### Content model

A pack is a manifest (`pack.json`) plus one JSON file per module. Each
module contains `lessons` (typed blocks: text, code, tip, gotcha),
`flashcards` and `exercises`, every string carrying `en` and `fr`
translations. The shapes are documented in `lib/content/types.ts`.

## Using GcpTrainer as a template for another topic

GcpTrainer itself was built from the Kortex (Kotlin) template. To spawn
another app:

1. Copy the repository and rename the app (header brand in
   `components/AppHeader.tsx`, metadata in `app/layout.tsx`, name in
   `package.json`, port in the `dev`/`start` scripts).
2. Create `content/packs/<topic>/` with a `pack.json` manifest listing
   your modules, and one module JSON conforming to
   `lib/content/types.ts`.
3. Point the imports in `lib/content/index.ts` to the new pack. This is
   the only code file that knows which pack is active.
4. Adjust the accent palette in `app/globals.css` if you want a
   different identity.
5. Adapt the content-update pipeline (see below) to the new topic's
   official sources.

## Content status

The GCP pack targets 12 modules; content is written incrementally.

| Module | Status |
| --- | --- |
| Platform fundamentals | Available |
| Compute options | Available |
| Storage | Planned |
| Databases | Planned |
| Networking | Planned |
| IAM & security | Planned |
| Data & analytics | Planned |
| Messaging & eventing | Planned |
| Observability & SRE | Planned |
| DevOps & IaC | Planned |
| ML & AI | Planned |
| What's new on GCP | Planned |

See `content/packs/gcp/pack.json` for the source of truth.

## Keeping content up to date

`content/packs/gcp/version.json` records the coverage snapshot date of
the pack. A documented pipeline (`.claude/skills/gcp-news/`) researches
newer GCP announcements, generates matching bilingual content, updates
the tracking file and presents a summary for approval before anything
is committed.

## Deployment

Deployed on Vercel. Set `GCPTRAINER_PASSPHRASE` and `DATABASE_URL` in
the project's environment variables; every push to `main` deploys.

## License

All rights reserved. This is a personal project; do not redistribute
without permission.
