# 🌿 community.wildsaura

Centralized community platform for the WildSaura ecosystem.

## Overview

`community.wildsaura.com` is the single shared community hub for:
- **wildsaura.com** — Main wildlife photography platform
- **drishya** — Stories & visual narratives
- **market.wildsaura.com** — Wildlife marketplace

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) |
| Auth | Firebase Auth (Google, Facebook, Apple) |
| Database | Cloud Firestore (shared project) |
| Storage | Firebase Storage |
| Realtime | Firestore onSnapshot |
| Styling | Tailwind CSS |
| Language | TypeScript |

## Firebase Collections

| Collection | Purpose |
|------------|--------|
| `community_posts` | Posts with likes, comments, images |
| `community_members` | Registered community members |

## Architecture

```
community.wildsaura.com (this app)
      │
      ├── Firebase Auth (SSO-ready)
      ├── Firestore (shared DB)
      └── Firebase Storage (media)
           ↕
wildsaura.com ←→ drishya ←→ market.wildsaura.com
```

All sites share the same Firebase project (`wildsaura-1ef8a`), enabling:
- Shared user accounts
- Shared posts and community data
- Single Sign-On experience

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in Firebase credentials in .env.local
npm run dev
```

## Firestore Rules

Make sure your Firestore rules allow:
- **Read** community_posts: public (no auth required)
- **Write** community_posts: authenticated users only
- **Read/Write** community_members: authenticated users only

## Embedding in Other Sites

Community components can be embedded in wildsaura.com, drishya, or market by importing from this package or embedding via iframe:

```html
<iframe src="https://community.wildsaura.com" />
```
