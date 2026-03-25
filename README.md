# Music API

A small Node.js and Express API that uses Mongoose and MongoDB to manage artists, albums, and songs.

## Features

- Connects to MongoDB with Mongoose
- Loads environment variables with `dotenv`
- Starts an Express server with JSON support
- CRUD endpoints for artists
- CRUD endpoints for songs
- Create, list, and delete albums
- Song filtering by title and artist
- Song pagination with `page` and `pageSize`
- Seed script for loading sample data

## Current Status

The app that starts from `index.js` currently mounts these route groups:

- `/api/artists`
- `/api/songs`
- `/api/albums`

There are also files for auth and playlists in the repository, but they are not wired into `index.js` yet, so they are not part of the running API right now.

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
|  |- playlists.js
|  |- songs.js
|- models/
|  |- Album.js
|  |- Artist.js
|  |- Playlist.js
|  |- Songs.js
|  |- User.js
|- routes/
|  |- album.js
|  |- artist.js
|  |- auth.js
|  |- me.js
|  |- playlist.js
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

Development mode:

```bash
npm run dev
```

Start normally:

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

Returns:

```json
{ "message": "Music API is running" }
```

### Artists

- `GET /api/artists`
- `GET /api/artists/:id`
- `POST /api/artists`
- `PUT /api/artists/:id`
- `DELETE /api/artists/:id`

Filter artists by name:

```text
GET /api/artists?q=taylor
```

### Songs

- `GET /api/songs`
- `GET /api/songs/:id`
- `POST /api/songs`
- `PUT /api/songs/:id`
- `DELETE /api/songs/:id`

Filter and paginate songs:

```text
GET /api/songs?q=halo
GET /api/songs?artist=Bad%20Bunny
GET /api/songs?page=1&pageSize=10
```

When creating or updating a song:

- `title` and `artist` are required when creating
- `artist` must reference an existing artist
- `albumId` is optional
- if `albumId` is sent, it must reference an existing album

Example:

```json
{
  "title": "Halo",
  "artist": "67d7f1c2a8b4e123456789ab",
  "albumId": "67d7f1c2a8b4e123456789ac"
}
```

### Albums

- `GET /api/albums`
- `GET /api/albums/:id`
- `GET /api/albums/artist/:artistId`
- `POST /api/albums`
- `DELETE /api/albums/:id`

When creating an album:

- `artistId`, `title`, and `releaseDate` are required
- the artist must already exist
- duplicate album titles for the same artist are rejected

## Seed Data

The project includes seed data in `data/` and a seed script in `scripts/seed.js`.

- artists are seeded if the artists collection is empty
- albums are seeded if the albums collection is empty
- songs are seeded if the songs collection is empty
- some songs are linked to albums and some are stored without albums

## Notes

- The project uses ES modules with `"type": "module"` in `package.json`.
- `.env` is gitignored and should not be committed.
- Error handling includes invalid MongoDB id handling through a global Express error middleware.
