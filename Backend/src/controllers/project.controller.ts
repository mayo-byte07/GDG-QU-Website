import { validationResult } from "express-validator";
import Project from "../models/Project.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
    const projects = await Project.find();
    res.sendResponse(200, "Projects fetched successfully", projects);
});

export const createProject = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }
        const {
            name,
            description,
            createdBy,
            photosUrls,
            coverUrl,
            tags,
            githubUrl,
            readmeUrl,
            liveUrl,
        } = req.body;

        const newProject = await Project.create({
            name,
            description,
            createdBy,
            photosUrls,
            coverUrl,
            tags,
            githubUrl,
            readmeUrl,
            liveUrl,
        });

        if (!newProject) {
            throw new ApiError(500, "Failed to create project");
        }

        res.sendResponse(201, "Project created successfully", newProject);
    }
);

export const updateProject = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }
        const projectId = req.params.id;
        const updateableFields = [
            "name",
            "description",
            "createdBy",
            "photosUrls",
            "coverUrl",
            "tags",
            "githubUrl",
            "readmeUrl",
            "liveUrl",
        ];

        const updateData: { [key: string]: any } = {};
        updateableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true }
        );

        if (!updatedProject) {
            throw new ApiError(404, "Project not found");
        }

        res.sendResponse(200, "Project updated successfully", updatedProject);
    }
);

export const deleteProject = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }
        const projectId = req.params.id;

        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            throw new ApiError(404, "Project not found");
        }

        res.sendResponse(200, "Project deleted successfully", deletedProject);
    }
);
