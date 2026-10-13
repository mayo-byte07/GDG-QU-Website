import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import type { IUser } from "../types/User.interface";

const UserSchema = new Schema(
    {
        // COMMON FIELDS
        name: { type: String, minlength: 2, maxlength: 50, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        photo: { type: String, trim: true },
        isAdmin: { type: Boolean, default: false },
        isProfileComplete: { type: Boolean, default: false },
        qid: { type: Number, unique: true, sparse: true },
        realName: { type: String, trim: true, minlength: 2, maxlength: 50 },
        course: { type: String, trim: true },
        branch: { type: String, trim: true },

        // GOOGLE LOGIN FIELDS
        googleId: { type: String, unique: true, sparse: true },
        verifiedEmail: { type: Boolean },

        // GITHUB LOGIN FIELDS
        githubId: { type: Number, unique: true, sparse: true },
        githubUsername: { type: String },
        githubProfileUrl: { type: String },
    },
    { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
    const payload = {
        id: this._id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

export default model<IUser>("User", UserSchema);
