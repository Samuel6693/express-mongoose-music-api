import {Artist} from '../models/Artist.js';

// Get all artists
export async function getAllArtists() {
    return await Artist.find();
}

// Get artist by Id
export async function getArtistById(id) {
    const artist = await Artist.findById(id);
    return artist ? artist : null;
}

// Create new artist
export async function createArtist(name) {
    const artist = new Artist({name});
    await artist.save();
    return artist;
}

// Update artist by Id
export async function updateArtist(id, name) {
    const artist = await Artist.findById(id);
    if (!artist) {
        return null;
    }
    artist.name = name;
    await artist.save();

    return artist;
}

// Delete artist by Id
export async function deleteArtist(id) {
    const result = await Artist.deleteOne({_id: id}); // Deletes the artist with the specified ID
    return result.deletedCount === 1; // Returns true if an artist was deleted, false otherwise
}