import {Songs} from '../models/Songs.js'

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
export async function createSong({title, artist}) {
    const song = new Songs({title, artist});
    await song.save();
    return song;
}

// Update songs by Id
export async function updateSongs(id, {title, artist}) {
    const song = await Songs.findById(id).populate('artist');

    if (!song) {
        return null
    }

    if (title === undefined && artist === undefined) {
        return song; // No updates provided, return the original song
    }
    if (title !== undefined) {
        song.title = title
    }
    if (artist !== undefined) {
        song.artist = artist
    }

    await song.save(); 
    return song;
}

// Delete songs by Id
export async function deleteSongs(id) {
    const result = await Songs.deleteOne({_id: id});
    return result.deletedCount === 1;
}