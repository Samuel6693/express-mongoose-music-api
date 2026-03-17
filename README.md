# Music API

This project is a small Node.js and Express API that uses Mongoose to connect to MongoDB and manage artists and songs.

## Features

- Connects to MongoDB with Mongoose
- Loads environment variables with `dotenv`
- Starts an Express server
- Exposes REST endpoints for artists and songs
- Supports song filtering and pagination

## Project Structure

```text
.
|- data/
|  |- artists.json
|  |- songs.json
|- db/
|  |- artists.js
|  |- connection.js
|  |- songs.js
|- models/
|  |- Artist.js
|  |- Songs.js
|- routes/
|  |- artist.js
|  |- songs.js
|- index.js
|- package.json
```

## Requirements

- Node.js
- MongoDB

## Installation

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/MUSICAPP
PORT=3000
```

`PORT` is optional. If it is not set, the app uses `3000`.

## Run the Project

Start in development mode:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

When the server is running, the API is available at:

```text
http://localhost:3000
```

## API Endpoints

### Root

- `GET /`

Returns a simple status message.

### Artists

- `GET /api/artists`
- `GET /api/artists/:id`
- `POST /api/artists`
- `PUT /api/artists/:id`
- `DELETE /api/artists/:id`

You can filter artists by name with:

```text
GET /api/artists?q=taylor
```

### Songs

- `GET /api/songs`
- `GET /api/songs/:id`
- `POST /api/songs`
- `PUT /api/songs/:id`
- `DELETE /api/songs/:id`

You can filter and paginate songs with query parameters:

```text
GET /api/songs?q=halo
GET /api/songs?artist=Bad%20Bunny
GET /api/songs?page=1&pageSize=10
```

## Notes

- The project uses ES modules, so `"type": "module"` is set in `package.json`.
- The `.env` file is gitignored and should not be committed.
