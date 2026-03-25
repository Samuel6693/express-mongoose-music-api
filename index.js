import express from "express";
import { connectDb } from "./db/connection.js";
import artistRouter from "./routes/artist.js";
import songsRouter from "./routes/songs.js";
import albumRouter from "./routes/album.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Music API is running" });
});

app.use("/api/artists", artistRouter);
app.use("/api/songs", songsRouter);
app.use("/api/albums", albumRouter);
app.use("/api/auth", authRouter);
app.use("/api", meRouter);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid id" });
  }

  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

async function startServer() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
