import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import TeamMember from "../models/TeamMember.model";
import { ApiError } from "../utils/ApiError";

export const createTeamMember = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            name,
            position,
            bio,
            fullBio,
            image,
            linkedinUrl,
            githubUrl,
            twitterUrl,
            instagramUrl,
            badge,
            skills,
        } = req.body;

        const newMember = await TeamMember.create({
            name,
            position,
            bio,
            fullBio,
            image,
            linkedinUrl,
            githubUrl,
            twitterUrl,
            instagramUrl,
            badge,
            skills,
        });

        if (!newMember) {
            throw new ApiError(500, "Failed to create team member");
        }

        res.sendResponse(201, "Team member created successfully", newMember);
    }
);

export const getTeamMembers = asyncHandler(
    async (req: Request, res: Response) => {
        const members = await TeamMember.find().sort({ createdAt: -1 });

        // Return empty array if no members, not 404
        res.sendResponse(200, "Team members retrieved successfully", members || []);
    }
);

export const updateTeamMember = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const updates = req.body;

        const updatedMember = await TeamMember.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!updatedMember) {
            throw new ApiError(404, "Team member not found");
        }

        res.sendResponse(
            200,
            "Team member updated successfully",
            updatedMember
        );
    }
);

export const deleteTeamMember = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const deletedMember = await TeamMember.findByIdAndDelete(id);

        if (!deletedMember) {
            throw new ApiError(404, "Team member not found");
        }

        res.sendResponse(
            200,
            "Team member deleted successfully",
            deletedMember
        );
    }
);
export const getTeamMemberById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const member = await TeamMember.findById(id);

        if (!member) {
            throw new ApiError(404, "Team member not found");
        }

        res.sendResponse(200, "Team member retrieved successfully", member);
    }
);
