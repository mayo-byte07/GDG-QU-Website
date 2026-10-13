import { Schema, model } from "mongoose";
import type { IProject } from "../types/Project.interface";

const ProjectSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        createdBy: { type: String, required: true },
        photosUrls: { type: [String], default: [] },
        coverUrl: { type: String, default: "" },
        tags: { type: [String], default: [] },
        githubUrl: { type: String, default: "" },
        readmeUrl: { type: String, default: "" },
        liveUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

export default model<IProject>("Project", ProjectSchema);
