# Mongoose Example

This is a small Node.js project that uses `mongoose` to connect to MongoDB, seed artist data from a JSON file, and perform a few basic database operations.

## Features

- Connects to MongoDB with Mongoose
- Loads environment variables with `dotenv`
- Seeds artists from `data/artists.json` if the database is empty
- Reads all artists from the database
- Creates a new artist entry

## Project Structure

```text
.
|- data/
|  |- artists.json
|- db/
|  |- artists.js
|  |- connection.js
|- models/
|  |- Artist.js
|- index.js
|- package.json
```

## Requirements

- Node.js
- MongoDB connection string

## Installation

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Run the Project

Start the app with:

```bash
node index.js
```

## What the App Does

When you run the project, it:

1. Connects to MongoDB
2. Checks whether the artists collection already has data
3. Seeds data from `data/artists.json` if the collection is empty
4. Fetches and logs all artists
5. Creates a new artist called `Test Artist`
6. Disconnects from MongoDB

## Dependencies

- `mongoose`
- `dotenv`

## Notes

This project uses ES modules, so `"type": "module"` is set in `package.json`.
