import {Songs} from '../models/Songs.js'
import '../models/Artist.js';

// Get all songs
export async function getAllSongs() {
    return await Songs.find().populate('artist');
}

// Get songs by Id
export async function getSongsById(id) {
    const songs = await Songs.findById(id).populate('artist');
    return songs ? songs : null; // Return null if not found
}

// Create new song
export async function createSong({title, artist, album}) {
    const song = new Songs({title, artist, album});
    await song.save();
    return song;
}

// Update songs by Id
export async function updateSongs(id, {title, artist, album}) {
    const song = await Songs.findById(id);

    if (!song) {
        return null
    }

    if (title === undefined && artist === undefined && album === undefined) {
        return song; // No updates provided, return the original song
    }
    if (title !== undefined) {
        song.title = title
    }
    if (artist !== undefined) {
        song.artist = artist
    }
    if (album !== undefined) {
        song.album = album
    }

    await song.save();
    await song.populate('artist');
    return song;
}

// Delete songs by Id
export async function deleteSongs(id) {
    const result = await Songs.deleteOne({_id: id});
    return result.deletedCount === 1;
}
