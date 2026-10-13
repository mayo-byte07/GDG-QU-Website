import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { isValidObjectId } from "mongoose";
import { validationResult } from "express-validator";

export const getAllUsers = asyncHandler(async (_: Request, res: Response) => {
    const users = await User.find();
    const data = {
        count: users.length,
        users,
    };
    res.sendResponse(200, "Users fetched successfully", data);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, JSON.stringify(errors.array()));
    }
    const userId = req.params.userId;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.sendResponse(200, "User fetched successfully", user);
});

export const updateUser = asyncHandler(async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, JSON.stringify(errors.array()));
    }
    const _id: string = req.user._id;
    if (!req.body) {
        throw new ApiError(400, "No data provided for update");
    }
    const { realName, qid, course, branch } = req.body;

    const user = await User.findById(_id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (realName) user.realName = realName;
    if (qid) user.qid = qid;
    if (course) user.course = course;
    if (branch) user.branch = branch;

    // Save the updated user, then check if profile is complete
    const updatedUser = await user.save();
    if (
        updatedUser.realName &&
        updatedUser.qid &&
        updatedUser.course &&
        updatedUser.branch
    ) {
        updatedUser.isProfileComplete = true;
        await updatedUser.save();
    }

    res.sendResponse(200, "User updated successfully", updatedUser);
});

export const getSelf = asyncHandler(async (req: any, res: Response) => {
    const user = {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        photo: req.user.photo,
        realName: req.user.realName,
        qid: req.user.qid,
        course: req.user.course,
        branch: req.user.branch,
        isProfileComplete: req.user.isProfileComplete,
        role: req.user.role,
    };
    return res.sendResponse(200, "User fetched successfully", user);
});