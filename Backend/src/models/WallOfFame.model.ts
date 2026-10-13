import { Schema, model } from "mongoose";
import type { IWallOfFame } from "../types/WallOfFame.interface";

const WallOfFameSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        position: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        bio: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
        },
        image: {
            type: String,
            trim: true,
        },
        badge: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        skills: {
            type: [String],
            default: [],
        },
        social: {
            linkedin: { type: String, trim: true, default: null },
            github: { type: String, trim: true, default: null },
            twitter: { type: String, trim: true, default: null },
            instagram: { type: String, trim: true, default: null },
        },
        color: {
            type: String,
            enum: ["blue", "red", "yellow", "green"],
            default: "blue",
        },
        year: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const WallOfFameModel = model<IWallOfFame>("WallOfFame", WallOfFameSchema);

export default WallOfFameModel;
