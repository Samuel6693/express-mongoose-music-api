# Music API

This project is a small Node.js and Express API that uses Mongoose to connect to MongoDB and manage artists, albums and songs.

## Features

- Connects to MongoDB with Mongoose
- Loads environment variables with `dotenv`
- Starts an Express server
- Exposes REST endpoints for artists, albums and songs
- Supports song filtering and pagination
- Supports optional album connections on songs
- Includes a seed script for artists, albums and songs

## Project Structure

```text
.
|- data/
|  |- artists.json
|  |- albums.json
|  |- songs.json
|- db/
|  |- albums.js
|  |- artists.js
|  |- connection.js
|  |- songs.js
|- models/
|  |- Artist.js
|  |- Album.js
|  |- Songs.js
|- routes/
|  |- album.js
|  |- artist.js
|  |- songs.js
|- scripts/
|  |- seed.js
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

Seed the database:

```bash
npm run seed
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

### Albums

- `GET /api/albums`
- `GET /api/albums/:id`
- `GET /api/albums/artist/:artistId`
- `POST /api/albums`
- `DELETE /api/albums/:id`

When creating an album:

- `artistId`, `title` and `releaseDate` are required
- the artist must already exist
- the same artist cannot have two albums with the same title

### Songs

`artist` in songs is a MongoDB reference to an existing artist document. `album` is also a MongoDB reference, but it is optional.

Example:

```json
{
  "title": "Halo",
  "artist": "67d7f1c2a8b4e123456789ab",
  "albumId": "67d7f1c2a8b4e123456789ac"
}
```

Songs without an album are treated as singles through the virtual boolean `isSingle`.

You can filter and paginate songs with query parameters:

```text
GET /api/songs?q=halo
GET /api/songs?artist=Bad%20Bunny
GET /api/songs?page=1&pageSize=10
```

## Seed Data

The project includes seed data in the `data/` folder and a seed script in `scripts/seed.js`.

- artists are seeded if the artists collection is empty
- albums are seeded if the albums collection is empty
- songs are seeded if the songs collection is empty
- some songs are connected to albums and some are seeded without albums

## Notes

- The project uses ES modules, so `"type": "module"` is set in `package.json`.
- The `.env` file is gitignored and should not be committed.
