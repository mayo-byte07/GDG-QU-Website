import type { Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    description: string;
    createdBy: string;
    photosUrls: string[];
    coverUrl: string;
    tags: string[];
    githubUrl: string;
    readmeUrl: string;
    liveUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
