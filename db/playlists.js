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
        return { error: "playlist_not_found" };
    }

    const alreadyExists = playlist.songs.some(
        id => id.toString() === songId
    );

    if (alreadyExists) {
        return { error: "song_already_in_playlist" };
    }

    playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate("songs");
    return { playlist };
}

// Remove song from playlist
export async function removeSongFromPlaylist(playlistId, songId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return { error: "playlist_not_found" };
    }

    const originalLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter(
        id => id.toString() !== songId
    );

    if (playlist.songs.length === originalLength) {
        return { error: "song_not_in_playlist" };
    }

    await playlist.save();
    await playlist.populate("songs");
    return { playlist };
}
