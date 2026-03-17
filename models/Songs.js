import mongoose from 'mongoose';

const songsSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true
        }
    }, {timestamps: true}
)

export const Songs = mongoose.model("Song", songsSchema)