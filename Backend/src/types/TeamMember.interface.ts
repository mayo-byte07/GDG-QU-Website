import type { Document } from "mongoose";

export interface TeamMember extends Document {
    name: string;
    position: string;
    bio: string;
    fullBio: string;
    image: string;
    linkedinUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    badge?: string;
    skills?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
