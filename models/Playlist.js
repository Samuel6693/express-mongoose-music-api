import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: null
        },
        songs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    }, {timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;