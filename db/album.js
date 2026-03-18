import { Album } from '../models/Album.js';


// Get all albums
export async function getAllAlbums() {
    return await Album.find();
}

// Get albums by Id
export async function getAlbumById(id) {
    const album = await Album.findById(id);
    return album ? album : null;
}

// Get album by artist Id
export async function getAlbumByArtistId(artistId) {
    return await Album.find({ artist: artistId }).sort({ releaseDate: 1 }); // Sort albums old to new

}

// Create album
export async function createAlbum({artistId, title, releaseDate}) {
    const album = new Album({artist: artistId, title, releaseDate});
    await album.save();
    return album;

    albumSchema.index({artist: 1, title: 1}, {unique: true});
}
// Delete album
export async function deleteAlbum(id) {
    const result = await Album.deleteOne({_id: id});
    return result.deletedCount === 1; // Returns true if an album was deleted, false otherwise
}