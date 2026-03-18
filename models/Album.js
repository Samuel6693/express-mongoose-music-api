import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        }, 
        releaseDate: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }

);

albumSchema.index({ artist: 1, title:1 }, { unique: true }) ;

export const Album = mongoose.model("Album", albumSchema);