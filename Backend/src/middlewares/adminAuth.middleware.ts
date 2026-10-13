import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/User.model";

const adminAuthMiddleware = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        const rawToken =
            req.cookies?.authToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!rawToken) {
            throw new ApiError(401, "Authentication token is missing");
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                rawToken,
                process.env.JWT_SECRET as string
            ) as JwtPayload;
        } catch (err) {
            console.error(err);
            throw new ApiError(401, "Invalid or expired token");
        }

        // Avoid repeated DB calls by checking req.user first
        if (!req.user) {
            const user = await User.findById(decoded.id);
            if (!user) {
                throw new ApiError(401, "User not found");
            }
            if (!user.isAdmin) {
                throw new ApiError(403, "Admin privileges required");
            }
            req.user = user;
        }

        next();
    }
);

export default adminAuthMiddleware;
