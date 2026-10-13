import { Schema, model } from "mongoose";
import type { TeamMember } from "../types/TeamMember.interface";

const TeamMemberSchema = new Schema(
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
            minlength: 2,
            maxlength: 20,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
        },
        fullBio: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
        },
        linkedinUrl: {
            type: String,
            trim: true,
        },
        githubUrl: {
            type: String,
            trim: true,
        },
        twitterUrl: {
            type: String,
            trim: true,
        },
        instagramUrl: {
            type: String,
            trim: true,
        },
        badge: {
            type: String,
            trim: true,
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);

export default model<TeamMember>("TeamMember", TeamMemberSchema);
