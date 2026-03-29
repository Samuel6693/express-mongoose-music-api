import { Router } from "express";
import mongoose from "mongoose";
import {
  getAllPlaylists,
  getAllPlaylistsByUserId,
  getPlaylistById,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from "../db/playlists.js";
import { Songs } from "../models/Songs.js";
import { requireAuth } from "../middleware/auth.js";

const playlistRouter = Router();

playlistRouter.get("/", async (req, res) => {
  res.json(await getAllPlaylists());
});

// GET /api/playlists/my
playlistRouter.get("/my", requireAuth, async (req, res) => {

  res.json(await getAllPlaylistsByUserId(req.userId));
});

// GET /api/playlists/:id
playlistRouter.get("/:id", requireAuth, async (req, res) => {

  const playlist = await getPlaylistById(req.params.id);

  if (!playlist) return res.status(404).json({ message: "Not found" });

  res.json(playlist);
});

// POST /api/playlists
playlistRouter.post("/", requireAuth, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  const created = await createPlaylist(name.trim(), description, req.userId);
  res.status(201).json(created);
});

// add song to playlist, no duplicate songs allowed
playlistRouter.post("/:id/songs", requireAuth, async (req, res) => {
  const { songId } = req.body;
  const playlistId = req.params.id;

  if (!mongoose.isValidObjectId(playlistId)) {
    return res.status(400).json({ message: "Invalid playlist id" });
  }

  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }

  if (!mongoose.isValidObjectId(songId)) {
    return res.status(400).json({ message: "Invalid song id" });
  }

  const songExists = await Songs.findById(songId);
  if (!songExists) {
    return res.status(400).json({ message: "Song not found" });
  }

  const result = await addSongToPlaylist(playlistId, songId);
  if (result.error === "playlist_not_found") {
    return res.status(404).json({ message: "Playlist not found" });
  }
  if (result.error === "song_already_in_playlist") {
    return res.status(409).json({ message: "Song is already in playlist" });
  }

  res.json(result.playlist);
});

// PUT /api/playlsits/:id
playlistRouter.put("/:id", requireAuth, async (req, res) => {
  const { name, description } = req.body;
  const playlist = await getPlaylistById(req.params.id);

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner === null || playlist.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "You are not the owner of this playlist" });
  }
  
  if (name && name.trim()) {
    playlist.name = name.trim();
  }
  if (description) {
    playlist.description = description;
  }

  await playlist.save();
  res.json(playlist);
});


// DELETE /api/playlists/:id/songs/:songId
playlistRouter.delete("/:id/songs/:songId", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid playlist id" });
  }

  if (!mongoose.isValidObjectId(req.params.songId)) {
    return res.status(400).json({ message: "Invalid song id" });
  }

  const result = await removeSongFromPlaylist(
    req.params.id,
    req.params.songId
  );

  if (result.error === "playlist_not_found") {
    return res.status(404).json({ message: "Playlist not found" });
  }
  if (result.error === "song_not_in_playlist") {
    return res.status(404).json({ message: "Song not found in playlist" });
  }

  res.json(result.playlist);
});


// Delete playlist/:id
playlistRouter.delete("/:id", requireAuth, async (req, res) => {
  const playlist = await getPlaylistById(req.params.id);

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner === null || playlist.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "You are not the owner of this playlist" });
  }

  await playlist.deleteOne();
  res.json({ message: "Playlist deleted" });
});

export default playlistRouter;
