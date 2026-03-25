import { Router } from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from "../db/playlists.js";
import { Songs } from "../models/Songs.js";

const playlistRouter = Router();

playlistRouter.get("/", async (req, res) => {
  res.json(await getAllPlaylists());
});

playlistRouter.get("/:id", async (req, res) => {
  const playlist = await getPlaylistById(req.params.id);
  if (!playlist) return res.status(404).json({ message: "Not found" });
  res.json(playlist);
});

playlistRouter.post("/", async (req, res) => {
  const created = await createPlaylist(
    req.body.name,
    req.body.description
  );
  res.status(201).json(created);
});

playlistRouter.post("/:id/songs", async (req, res) => {
  const { songId } = req.body;

  const songExists = await Songs.findById(songId);
  if (!songExists) {
    return res.status(400).json({ message: "Song not found" });
  }

  const updated = await addSongToPlaylist(req.params.id, songId);
  if (!updated) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  res.json(updated);
});

playlistRouter.delete("/:id/songs/:songId", async (req, res) => {
  const updated = await removeSongFromPlaylist(
    req.params.id,
    req.params.songId
  );

  if (!updated) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  res.json(updated);
});

export default playlistRouter;
