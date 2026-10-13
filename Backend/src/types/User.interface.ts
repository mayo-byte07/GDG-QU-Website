import { Document } from "mongoose";

export interface IUser extends Document {
    // COMMON FIELDS
    name?: string;
    email: string;
    photo?: string;
    isAdmin: boolean;
    isProfileComplete: boolean;
    qid?: number;
    realName?: string;
    course?: string;
    branch?: string;

    // GOOGLE LOGIN FIELDS
    googleId?: string;
    verifiedEmail?: boolean;

    // GITHUB LOGIN FIELDS
    githubId?: number;
    githubUsername?: string;
    githubProfileUrl?: string;

    createdAt?: Date;
    updatedAt?: Date;

    // METHODS
    generateJWT: () => string;
}
