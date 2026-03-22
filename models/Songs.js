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
        }, 
        album:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            required: false
        }, 
    }, {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)
// Virtual property to determine if the song is a single (not part of an album)
songsSchema.virtual('isSingle').get(function() {
    return !this.album; 
});

// Make sure albums belong to the same artist
songsSchema.pre("save", async function () {
    if (!this.album) return;

    const Album = mongoose.model("Album");
    const album = await Album.findById(this.album);

    if (!album) {
        throw new Error("Album does not exist");
    }

    if (!album.artist.equals(this.artist)) {
        throw new Error("Song artist must match the album artist");
    }
});

export const Songs = mongoose.model("Song", songsSchema)