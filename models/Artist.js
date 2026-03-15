import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 2
        } 
    }, {timestamps: true}
);

export const Artist = mongoose.model("Artist", artistSchema);