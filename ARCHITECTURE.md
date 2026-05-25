# 🏗️ Architecture Guide — community.wildsaura

## Multi-Site Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                     WILDSAURA ECOSYSTEM                          │
│                                                                  │
│  wildsaura.com     drishya.com     market.wildsaura.com          │
│      │                 │                  │                      │
│      └─────────────────┼──────────────────┘                     │
│                        │                                         │
│              community.wildsaura.com                             │
│                 (This App - Next.js)                             │
│                        │                                         │
│         ┌──────────────┼──────────────┐                         │
│         │              │              │                          │
│    Firebase Auth   Firestore DB  Firebase Storage                │
│    (wildsaura-1ef8a shared project)                              │
└─────────────────────────────────────────────────────────────────┘
```

## Shared Firebase Collections

### `community_posts`
```
{
  id: string (auto),
  userId: string,
  username: string,
  text: string,
  imageUrl: string | null,
  timestamp: Timestamp,
  likes: string[], // array of userIds
  comments: [{
    userId, username, text, timestamp,
    avatarUrl, avatarColor, spiritAnimal
  }],
  avatarUrl: string,
  avatarColor: string,
  spiritAnimal: string,
  category: string,
  story: string,
}
```

### `community_members`
```
{
  id: string (= userId),
  userId: string,
  displayName: string,
  email: string,
  avatarUrl: string,
  avatarColor: string,
  spiritAnimal: string,
  joinedAt: Timestamp,
}
```

## Embedding in Other Sites

### Option 1: iframe embed
```html
<iframe
  src="https://community.wildsaura.com/embed"
  style="width:100%;height:600px;border:none;"
/>
```

### Option 2: Cross-origin auth (SSO)
Share the same Firebase project across all your Next.js apps.
Users signed in on wildsaura.com will also be signed in on community.wildsaura.com
because they share `wildsaura-1ef8a` auth domain.

## Deployment (Vercel)

```bash
vercel --prod
```

Set environment variables in Vercel dashboard from `.env.example`.

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Community posts — public read, authenticated write
    match /community_posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
    // Members — public read, authenticated write own
    match /community_members/{userId} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```
