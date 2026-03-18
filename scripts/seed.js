import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { connectDb, disconnectDb } from '../db/connection.js';
import { Artist } from '../models/Artist.js';
import { Album } from '../models/Album.js';
import { Songs } from '../models/Songs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

async function readJson(fileName) {
    const filePath = path.join(dataDir, fileName);
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
}

function songAlbumKey(title, artist) {
    return `${artist}:::${title}`;
}

async function seedArtists() {
    const artistCount = await Artist.countDocuments();

    if (artistCount > 0) {
        console.log('Artists already exist, skipping artist seed.');
        return await Artist.find();
    }

    const artistsData = await readJson('artists.json');
    const artistsToInsert = artistsData.map(({ name }) => ({ name }));
    const artists = await Artist.insertMany(artistsToInsert);
    console.log(`Seeded ${artists.length} artists.`);
    return artists;
}

async function seedAlbums(artistMap) {
    const albumCount = await Album.countDocuments();

    if (albumCount > 0) {
        console.log('Albums already exist, skipping album seed.');
        return await Album.find();
    }

    const albumsData = await readJson('albums.json');
    const albumsToInsert = albumsData
        .map(({ title, artist, releaseDate }) => {
            const artistDoc = artistMap.get(artist);

            if (!artistDoc) {
                return null;
            }

            return {
                artist: artistDoc._id,
                title,
                releaseDate: new Date(releaseDate),
            };
        })
        .filter(Boolean);

    const albums = await Album.insertMany(albumsToInsert);
    console.log(`Seeded ${albums.length} albums.`);
    return albums;
}

async function seedSongs(artistMap, albumMap) {
    const songCount = await Songs.countDocuments();

    if (songCount > 0) {
        console.log('Songs already exist, skipping song seed.');
        return;
    }

    const songsData = await readJson('songs.json');
    const songsToInsert = songsData
        .map(({ title, artist }) => {
            const artistDoc = artistMap.get(artist);

            if (!artistDoc) {
                return null;
            }

            const albumId = albumMap.get(songAlbumKey(title, artist));

            return {
                title,
                artist: artistDoc._id,
                ...(albumId ? { album: albumId } : {}),
            };
        })
        .filter(Boolean);

    const songs = await Songs.insertMany(songsToInsert);
    console.log(`Seeded ${songs.length} songs.`);
}

async function runSeed() {
    await connectDb();

    try {
        const artists = await seedArtists();
        const artistMap = new Map(artists.map(artist => [artist.name, artist]));

        const albums = await seedAlbums(artistMap);
        const albumMap = new Map();

        for (const album of albums) {
            const artistDoc = artists.find(artist => artist._id.equals(album.artist));

            if (!artistDoc) {
                continue;
            }

            if (artistDoc.name === 'Bad Bunny' && album.title === 'DeBI TiRAR MaS FOToS') {
                albumMap.set(songAlbumKey('DtMF', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('NUEVAYoL', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('BAILE INoLVIDABLE', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('VOY A LLeVARTE PA PR', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('EoO', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('VeLDÁ', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('WELTiTA', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('KLOuFRENS', artistDoc.name), album._id);
            }

            if (artistDoc.name === 'PinkPantheress' && album.title === 'Heaven knows') {
                albumMap.set(songAlbumKey('Stateside + Zara Larsson', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('PIXELATED KISSES', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('LAST OF A DYING BREED', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('The Subway', artistDoc.name), album._id);
            }

            if (artistDoc.name === 'Sabrina Carpenter' && album.title === 'emails i can\'t send') {
                albumMap.set(songAlbumKey('Tears', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('Espresso', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('Sports car', artistDoc.name), album._id);
            }

            if (artistDoc.name === 'Billie Eilish' && album.title === 'Hit Me Hard and Soft') {
                albumMap.set(songAlbumKey('WILDFLOWER', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('BIRDS OF A FEATHER', artistDoc.name), album._id);
            }

            if (artistDoc.name === 'Tame Impala' && album.title === 'Currents') {
                albumMap.set(songAlbumKey('The Less I Know the Better', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('Dracula', artistDoc.name), album._id);
            }

            if (artistDoc.name === 'Radiohead' && album.title === 'OK Computer') {
                albumMap.set(songAlbumKey('Creep', artistDoc.name), album._id);
                albumMap.set(songAlbumKey('Let Down', artistDoc.name), album._id);
            }
        }

        await seedSongs(artistMap, albumMap);
        console.log('Seed complete.');
    } finally {
        await disconnectDb();
    }
}

runSeed().catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
});
