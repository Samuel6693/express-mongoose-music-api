import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScehma = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        }, 
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            select: false
        }
    }, { timestamps: true}
);

// Add method to comapre passwords
userScehma.methods.comparePassword = async function (plainpassword) {
    return await bcrypt.compare(plainpassword, this.password);
}

// Middleware
userScehma.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

    next();
});

export default mongoose.model("User", userScehma);
