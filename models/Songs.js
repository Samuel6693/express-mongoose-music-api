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

export const Songs = mongoose.model("Song", songsSchema)