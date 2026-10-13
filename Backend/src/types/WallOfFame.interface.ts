import { Document } from "mongoose";

export interface IWallOfFameSocial {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
}

export interface IWallOfFame extends Document {
    name: string;
    position: string;
    bio: string;
    image?: string;
    badge?: string;
    skills: string[];
    social: IWallOfFameSocial;
    color: "blue" | "red" | "yellow" | "green";
    year: string; // e.g. "2024-2025"
}
