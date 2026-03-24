import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
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

// Prevent changing artist after creation
albumSchema.pre("save", function () {
    if (!this.isNew && this.isModified("artist")) {
        throw new Error("Cannot change the artist of an existing album.");
    }
});

// When an album is deleted, set the album field to null for all songs that reference it
albumSchema.post(
    "deleteOne",
    {document: false, query: true }, 
    async function () {
        const Song = mongoose.model("Song");

        const id = this.getFilter()._id;

        await Song.updateMany(
            {album: id},
            {$set: {album: null}}
        );
});
albumSchema.index({ artist: 1, title:1 }, { unique: true }) ;

export const Album = mongoose.model("Album", albumSchema);
