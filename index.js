import { readFile } from "fs/promises";
import { connectDb, disconnectDb } from "./db/connection.js";
import { Artist } from "./models/Artist.js";
import { getAllArtists, createArtist } from "./db/artists.js";

const DATA_PATH = new URL("./data/artists.json", import.meta.url);

// Seed database if empty
async function seedIfEmpty() {
  const count = await Artist.countDocuments();

  if (count > 0) {
    console.log("Database already has artists, skipping seeding.");
    return;
  }

  // Read artists from file and insert into database
  const raw = await readFile(DATA_PATH, "utf8");
  const artistsFromFile = JSON.parse(raw);

  // Map the artists to the format expected by the database
  const artistsToInsert = artistsFromFile.map(a => ({
    name: a.name
  }));

  // Insert artists into database
  await Artist.insertMany(artistsToInsert);

  console.log("Seeding completed.");
}

// Main function to run the application
async function main() {
  let isConnected = false;

  try {
    await connectDb();
    isConnected = true;

    await seedIfEmpty();

    const all = await getAllArtists();
    console.log("All artists:", all.map(a => a.name));

    const existingArtist = await Artist.findOne({ name: "Test Artist" });

    if (existingArtist) {
      console.log("Test Artist already exists, skipping creation.");
    } else {
      const newArtist = await createArtist("Test Artist");
      console.log("Created artist:", newArtist.name);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    if (isConnected) {
      await disconnectDb();
    }
  }
}

main();
