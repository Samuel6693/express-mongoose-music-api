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
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  const created = await createPlaylist(name.trim(), description);
  res.status(201).json(created);
});

playlistRouter.post("/:id/songs", async (req, res) => {
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }

  const songExists = await Songs.findById(songId);
  if (!songExists) {
    return res.status(400).json({ message: "Song not found" });
  }

  const result = await addSongToPlaylist(req.params.id, songId);
  if (result.error === "playlist_not_found") {
    return res.status(404).json({ message: "Playlist not found" });
  }
  if (result.error === "song_already_in_playlist") {
    return res.status(409).json({ message: "Song is already in playlist" });
  }

  res.json(result.playlist);
});

playlistRouter.delete("/:id/songs/:songId", async (req, res) => {
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

export default playlistRouter;
