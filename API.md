# API Documentation

Complete API reference for Game Arcade backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clv1234567890",
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "bio": null,
    "totalScore": 0,
    "gamesPlayed": 0
  }
}
```

**Errors:**
- 400: Email already registered
- 400: Username already taken
- 400: Validation error

---

### Login User
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clv1234567890",
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "bio": null,
    "totalScore": 0,
    "gamesPlayed": 0
  }
}
```

**Errors:**
- 401: Invalid email or password
- 400: Validation error

---

### Get Profile
**GET** `/auth/profile` *(Protected)*

Get current user's profile with achievements.

**Response (200):**
```json
{
  "id": "clv1234567890",
  "email": "user@example.com",
  "username": "username",
  "avatar": null,
  "bio": null,
  "totalScore": 500,
  "gamesPlayed": 12,
  "achievements": [
    {
      "id": "ach1",
      "name": "First Victory",
      "slug": "first-victory",
      "description": "Win your first game",
      "icon": "🏆",
      "unlockedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Errors:**
- 401: No token provided
- 403: Invalid or expired token
- 404: User not found

---

### Update Profile
**PUT** `/auth/profile` *(Protected)*

Update user profile information.

**Request Body:**
```json
{
  "username": "newusername",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "I love games!"
}
```

**Response (200):**
```json
{
  "id": "clv1234567890",
  "email": "user@example.com",
  "username": "newusername",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "I love games!",
  "totalScore": 500,
  "gamesPlayed": 12
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized

---

## Games Endpoints

### Get All Games
**GET** `/games`

Get list of all available games.

**Query Parameters:**
- `limit` (optional): Number of games to return

**Response (200):**
```json
[
  {
    "id": "game1",
    "name": "Flappy Bird Clone",
    "slug": "flappy-bird",
    "description": "Navigate through pipes",
    "difficulty": "easy",
    "category": "arcade",
    "icon": null,
    "instructions": "Click to flap",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Get Game by ID
**GET** `/games/:id`

Get specific game details.

**Response (200):**
```json
{
  "id": "game1",
  "name": "Flappy Bird Clone",
  "slug": "flappy-bird",
  "description": "Navigate through pipes",
  "difficulty": "easy",
  "category": "arcade",
  "icon": null,
  "instructions": "Click to flap",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**
- 404: Game not found

---

### Get Game by Slug
**GET** `/games/by-slug/:slug`

Get game by URL slug.

**Response (200):** Same as Get Game by ID

---

### Get Games by Category
**GET** `/games/by-category/:category`

Get all games in a category.

**Response (200):**
```json
[
  {
    "id": "game1",
    "name": "Flappy Bird Clone",
    ...
  }
]
```

---

## Scores Endpoints

### Submit Score
**POST** `/scores` *(Protected)*

Submit a game score.

**Request Body:**
```json
{
  "gameId": "game1",
  "points": 250,
  "duration": 45
}
```

**Response (201):**
```json
{
  "id": "score1",
  "userId": "user1",
  "gameId": "game1",
  "points": 250,
  "duration": 45,
  "timestamp": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- 400: Validation error (points/duration must be integers >= 0)
- 404: Game not found
- 401: Unauthorized

---

### Get User Scores
**GET** `/scores/user` *(Protected)*

Get all scores for current user.

**Query Parameters:**
- `limit` (optional, default 50): Max results

**Response (200):**
```json
[
  {
    "id": "score1",
    "userId": "user1",
    "gameId": "game1",
    "points": 250,
    "duration": 45,
    "timestamp": "2024-01-15T10:30:00Z",
    "game": {
      "id": "game1",
      "name": "Flappy Bird Clone",
      "slug": "flappy-bird"
    }
  }
]
```

---

### Get Highest Scores
**GET** `/scores/highest`

Get highest scores globally.

**Query Parameters:**
- `limit` (optional, default 50): Max results

**Response (200):**
```json
[
  {
    "id": "score1",
    "points": 1250,
    "duration": 120,
    "user": {
      "id": "user1",
      "username": "champion",
      "avatar": null
    },
    "game": {
      "id": "game1",
      "name": "Flappy Bird Clone"
    }
  }
]
```

---

### Get Game Scores
**GET** `/scores/game/:gameId`

Get all scores for a specific game.

**Query Parameters:**
- `limit` (optional, default 50): Max results

**Response (200):** Same format as Get Highest Scores

---

## Leaderboards Endpoints

### Get Global Leaderboard
**GET** `/leaderboards/global`

Get top players by total score.

**Query Parameters:**
- `limit` (optional, default 10): Max results

**Response (200):**
```json
[
  {
    "rank": 1,
    "id": "user1",
    "username": "champion",
    "avatar": null,
    "totalScore": 5000,
    "gamesPlayed": 50
  }
]
```

---

### Get Game Leaderboard
**GET** `/leaderboards/game/:gameSlug`

Get top scorers for a specific game.

**Query Parameters:**
- `limit` (optional, default 10): Max results

**Response (200):**
```json
[
  {
    "rank": 1,
    "userId": "user1",
    "username": "champion",
    "avatar": null,
    "points": 1250,
    "gameId": "game1"
  }
]
```

---

### Get User Rank
**GET** `/leaderboards/my-rank` *(Protected)*

Get current user's global rank.

**Response (200):**
```json
{
  "rank": 15,
  "username": "player",
  "totalScore": 1500
}
```

**Errors:**
- 401: Unauthorized
- 404: User not found

---

## Achievements Endpoints

### Get All Achievements
**GET** `/achievements`

Get list of all achievements.

**Response (200):**
```json
[
  {
    "id": "ach1",
    "name": "First Victory",
    "slug": "first-victory",
    "description": "Win your first game",
    "icon": "🏆",
    "criteria": "win_game",
    "reward": 10,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Get User Achievements
**GET** `/achievements/user` *(Protected)*

Get all achievements unlocked by current user.

**Response (200):**
```json
[
  {
    "id": "ach1",
    "name": "First Victory",
    "slug": "first-victory",
    "description": "Win your first game",
    "icon": "🏆",
    "reward": 10,
    "unlockedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Achievement Statistics
**GET** `/achievements/stats`

Get how many users unlocked each achievement.

**Response (200):**
```json
[
  {
    "id": "ach1",
    "name": "First Victory",
    "slug": "first-victory",
    "description": "Win your first game",
    "unlockedBy": 45
  }
]
```

---

### Get Achievement by ID
**GET** `/achievements/:id`

Get achievement details.

**Response (200):** Same as Get All Achievements (single item)

**Errors:**
- 404: Achievement not found

---

### Get Achievement by Slug
**GET** `/achievements/by-slug/:slug`

Get achievement by URL slug.

**Response (200):** Same as Get Achievement by ID

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Implement based on deployment needs.

## Pagination

Use `limit` query parameter to control results:
- Default: Varies by endpoint (usually 50 or 10)
- Max: 100 (enforced by frontend validation)

## Sorting

Results are sorted by:
- **Games**: creation date (newest first)
- **Scores**: points (highest first) or timestamp (newest first)
- **Leaderboards**: total score or game points (highest first)
- **Achievements**: creation date (newest first)

---

## Testing

**Demo Account:**
```
Email: demo@gamearcade.com
Password: Demo@1234
```

Use Postman or curl for API testing:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Get Games
curl http://localhost:5000/api/games

# Submit Score (with token)
curl -X POST http://localhost:5000/api/scores \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"gameId":"game1","points":500,"duration":60}'
```

---

**API Version**: 1.0.0
**Status**: ✅ Production Ready
