import express from 'express';
import {
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
    deleteArtist,
} from '../db/artists.js';

const artistRouter = express.Router();

// Get /api/artists
artistRouter.get('/', async (req, res) => {
    let artists = await getAllArtists();

    const {q} = req.query;

    // Filter by name
    if (q) {
        artists = artists.filter(artist =>
            artist.name.toLowerCase().includes(q.toLowerCase())
        );
    }

    return res.json(artists);
});

// Get /api/artists/:id
artistRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    const artist = await getArtistById(id);
    if (!artist) {
        return res.status(404).json({error: 'Artist not found'});
    }   
    return res.json(artist);
}); 

// POST /api/artists
artistRouter.post('/', async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }  
    const newArtist = await createArtist(name);
    return res.status(201).json(newArtist);
});

// PUT /api/artists/:id
artistRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }   
    const updatedArtist = await updateArtist(id, name);

    if (!updatedArtist) {
        return res.status(404).json({error: 'Artist not found'});
    }
    return res.json(updatedArtist);
});

// DELETE /api/artists/:id
artistRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const deletedArtist = await deleteArtist(id);
    if (!deletedArtist) {
        return res.status(404).json({error: 'Artist not found'});
    }
    return res.json(deletedArtist);
});

export default artistRouter;
