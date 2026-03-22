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

artistSchema.post(
  "deleteOne",
  { document: false, query: true },
  async function (result) {
    const Song = mongoose.model("Song");
    const Album = mongoose.model("Album");

    const id = this.getFilter()._id; // Get the ID of the deleted artist

    await Song.deleteMany({ artist: id });
    await Album.deleteMany({ artist: id });
  }
);

export const Artist = mongoose.model("Artist", artistSchema);