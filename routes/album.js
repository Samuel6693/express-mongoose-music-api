import express from 'express'
import { 
    getAllAlbums,
    getAlbumById,
    getAlbumByArtistId,
    createAlbum,
    deleteAlbum
} from '../db/albums.js';
import { getAlbumByArtistId } from '../db/albums.js';

const albumRouter = express.Router();

//GET /api/albums
albumRouter.get('/', async (req, res) => {
    const albums = await getAllAlbums();
    return res.json(albums);
});

//GET /api/albums/:id
albumRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    const album = await getAlbumById(id);
    
    if(!album) {
        return res.status(404).json({message: 'album not found'});
    }
    res.json(album);
});
//GET /api/albums/artist/:artistId
albumRouter.get('/artist/:artistId', async (req, res) => {
    const artistId = req.params.artistId;   
    const albums = await getAlbumByArtistId(artistId);
    res.json(albums);
});

//POST /api/albums
albumRouter.post('/', async (req, res) => {
    const {artistId, title, releaseDate} = req.body;

    if (!artistId || !title || !releaseDate) {
        return res.status(400).json({
            error: 'artistId, title and releaseDate are required'});
    }

    const artist = await getAlbumByArtistId(artistId);
    if (!artist) {
        return res.status(404).json({error: 'Artist not found'});
    }

    try {
        const newAlbum = await createAlbum({artistId, title, releaseDate});
        res.status(201).json(newAlbum);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({error: 'Album title already exists for the artist'});
        }
        res.status(500).json({error: 'Failed to create album'});
    }
});
//DELETE /api/albums/:id
albumRouter.delete('/:id', async (req, res) => {
    const deletedAlbum = await deleteAlbum(req.params.id);

    if(!deletedAlbum) {
        return res.status(404).json({error: 'album not found'});
    }
    
    return res.json({message: 'album deleted successfully'});
});

export default albumRouter;