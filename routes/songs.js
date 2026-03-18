import express from 'express';
import {
    getAllSongs,
    getSongsById,
    createSong,
    updateSongs,
    deleteSongs,
} from '../db/songs.js';

const songsRouter = express.Router();

//GET /api/songs
songsRouter.get('/', async (req, res) => {
    let songs = await getAllSongs();

    const {q, artist, page = 1, pageSize = 10} = req.query;

    //Filter artist
    if (artist) {
        songs = songs.filter(song => 
            song.artist.name.toLowerCase() === artist.toLowerCase() // artist.name.toLowerCase() cuz artist is an object reference to the Artist model, we need to access the name property for filtering
        );
    }
    //Filter title
    if (q) {
        songs = songs.filter(song =>
            song.title.toLowerCase().includes(q.toLowerCase())
        );
    }
    
    //Total songs after filtering
    const totalSongs = songs.length;

    //Pagination
    const pageNum = Number(page); // Convert page to number
    const sizeNum = Number(pageSize); // Convert pageSize to number
    const totalPages = Math.ceil(totalSongs / sizeNum); // Calculate total pages

    // Validate pagination parameters
    if (!Number.isInteger(pageNum) || pageNum < 1) {
        return res.status(400).json({error: "Page must be an integer >= 1"});
    }
    if (!Number.isInteger(sizeNum) || sizeNum < 1 || sizeNum > 100) {
        return res.status(400).json({error: "Pagesize must be an integer between 1 and 100"});
    }

    if (pageNum > totalPages && pageNum > 1) {
        return res.status(400).json({error: "Page number is out of bounds"});
    }

    const start = (pageNum - 1) * sizeNum; // Calculate the starting index for pagination
    const end = start + sizeNum; // Calculate the ending index for pagination

    const items = songs.slice(start, end); // Get the paginated items

    return res.json({
       page: pageNum,
       pageSize: sizeNum,
       totalSongs,
       songs: items,
    }); // Return the paginated response with metadata
});

//GET /api/songs/:id
songsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    const song = await getSongsById(id);

    if (!song) {
        return res.status(404).json({error: 'Song not found'});
    }
    res.json(song);
});

//POST /api/songs
songsRouter.post('/', async(req, res) => {
    const {title, artist, albumId} = req.body;

    if (!title || !artist) {
        return res.status(400).json({error: 'title and artist are required'})
    }
    if (albumId) {
        const albumExists = await getAlbumbyId(albumId);
        if (!albumExists) {
            return res.status(400).json({error: 'Album not found'});
        }
    }
    const newSong = await createSong({title, artist, album: albumId});
    res.status(201).json(newSong);
});

// PUT /api/songs/:id
songsRouter.put('/:id', async(req, res) => {
    const id = req.params.id;
    const {title, artist, albumId} = req.body;

    if (title === undefined && artist === undefined) {
        return res.status(400).json({error: 'title or artist are required'});
    }

    const updatedSong = await updateSongs(id, {title, artist, album: albumId});

    if(!updatedSong) {
        return res.status(404).json({error: 'song not found'});
    }

    res.json(updatedSong)
});

//DELETE /api/songs/:id
songsRouter.delete('/:id', async(req, res) => {
    const id = req.params.id;

    const deletedSong = await deleteSongs(id);

    if (!deletedSong) {
        return res.status(404).json({ error: 'song not found' });
    }

    return res.json(deletedSong)
});

export default songsRouter;