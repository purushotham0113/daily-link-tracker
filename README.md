# Daily Link Tracker

A full-stack MERN web application for saving and organizing links by date. Paste any URL, save it with a timestamp, and browse your links filtered by date.

## Features

- **Add a Link** — Paste a URL and submit. Auto-prepends `https://` if no protocol is provided.
- **View Links by Date** — Filter links by date (defaults to today). Links are sorted newest-first.
- **Clickable Links** — Each link is rendered as clickable text with an "Open ↗" button.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 19 (JavaScript) + Vite       |
| Backend   | Node.js + Express.js               |
| Database  | MongoDB with Mongoose              |
| Security  | Helmet, CORS, Rate Limiting, XSS   |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "container of links"
```

### 2. Set up the Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your MongoDB connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/daily-link-tracker
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Then install dependencies and start:

```bash
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 3. Set up the Frontend

Open a new terminal:

```bash
cd client
cp .env.example .env
```

The default `.env` should work for local development:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then install dependencies and start:

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 4. Open the App

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/api/links`        | Add a new link                     |
| GET    | `/api/links?date=`  | Get links for a specific date      |
| GET    | `/api/links/dates`  | Get dates that have at least 1 link|

## Security

This application implements:

- **Helmet.js** — Secure HTTP headers
- **CORS** — Restricted origins via environment variable
- **Rate Limiting** — 100 req/15 min global, 10 req/min on POST
- **Input Validation** — Server-side validation with express-validator
- **NoSQL Injection Protection** — express-mongo-sanitize
- **XSS Protection** — Input sanitization with xss package
- **Request Size Limits** — 10KB JSON body cap
- **Centralized Error Handling** — No stack traces leaked to clients

## Project Structure

```
├── README.md
├── server/
│   ├── config/db.js
│   ├── controllers/linkController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validateRequest.js
│   ├── models/Link.js
│   ├── routes/linkRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── client/
    ├── src/
    │   ├── api/linkApi.js
    │   ├── components/
    │   │   ├── AddLinkForm.jsx
    │   │   ├── DateFilter.jsx
    │   │   ├── LinkItem.jsx
    │   │   └── LinkList.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Notes

- **MongoDB URI**: You must supply your own `MONGO_URI` in `server/.env`. The app will not start without it.
- **Date Handling**: All dates are stored and queried in UTC for consistency.
- **No Authentication**: This app does not include login/auth. If needed, JWT auth can be added later.
