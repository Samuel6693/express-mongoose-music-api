import { Playlist } from "../models/Playlist.js";

export async function getAllPlaylists() {
    return await Playlist.find().populate('songs');
}

export async function getPlaylistById(id) {
    if (!id) {
        return null;
    }
    return await Playlist.findById(id).populate('songs')
}

export async function createPlaylist( name, description ) {
    const playlist = new Playlist({name, description, songs: []})
    await playlist.save();
    return playlist;
}

// add song to playlist, no duplicate songs allowed
export async function addSongToPlaylist(playlistId, songId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return null;
    }
    if (playlist.songs.includes(songId)) {
        return null;
    }
    playlist.songs.push(songId);
    await playlist.save();
    return playlist;
}

// Remove song from playlist
export async function removeSongFromPlaylist(playlistId, songId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return null;
    }
    playlist.songs = playlist.songs.filter(
        id => id.toString() !== songId
    );
    
    await playlist.save();
    return playlist;
}
