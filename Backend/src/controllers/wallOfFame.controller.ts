import { validationResult } from "express-validator";
import WallOfFame from "../models/WallOfFame.model";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

// GET /api/wof — returns entries grouped by year
export const getWallOfFameEntries = asyncHandler(
    async (req: Request, res: Response) => {
        const entries = await WallOfFame.find().sort({ createdAt: -1 });

        // Group entries by year (e.g. { "2024-2025": [...], "2023-2024": [...] })
        const grouped: Record<string, any[]> = {};
        for (const entry of entries) {
            const year = entry.year;
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(entry);
        }

        // Derive available years sorted descending
        const availableYears = Object.keys(grouped).sort().reverse();

        res.sendResponse(200, "Wall of Fame entries fetched successfully", {
            grouped,
            availableYears,
        });
    }
);

// POST /api/wof — create a new entry (admin only)
export const addWallOfFameEntry = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        const {
            name,
            position,
            bio,
            image,
            badge,
            skills,
            social,
            color,
            year,
        } = req.body;

        const newEntry = await WallOfFame.create({
            name,
            position,
            bio,
            image,
            badge,
            skills,
            social,
            color,
            year,
        });

        if (!newEntry) {
            throw new ApiError(500, "Failed to add Wall of Fame entry");
        }

        res.sendResponse(
            201,
            "Wall of Fame entry added successfully",
            newEntry
        );
    }
);

// PUT /api/wof/:id — update an entry (admin only)
export const updateWallOfFameEntry = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }
        const { id } = req.params;

        const updatableFields = [
            "name",
            "position",
            "bio",
            "image",
            "badge",
            "skills",
            "social",
            "color",
            "year",
        ];

        const updateData: any = {};
        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const updatedEntry = await WallOfFame.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedEntry) {
            throw new ApiError(404, "Wall of Fame entry not found");
        }

        res.sendResponse(
            200,
            "Wall of Fame entry updated successfully",
            updatedEntry
        );
    }
);

// DELETE /api/wof/:id — delete an entry (admin only)
export const deleteWallOfFameEntry = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }
        const { id } = req.params;

        const deletedEntry = await WallOfFame.findByIdAndDelete(id);
        if (!deletedEntry) {
            throw new ApiError(404, "Wall of Fame entry not found");
        }

        res.sendResponse(
            200,
            "Wall of Fame entry deleted successfully",
            deletedEntry
        );
    }
);
