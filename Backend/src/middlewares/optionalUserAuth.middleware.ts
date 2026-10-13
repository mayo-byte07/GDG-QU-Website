import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import User from "../models/User.model";

const optionalUserAuth = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        const rawToken =
            req.cookies?.authToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (rawToken) {
            let decoded: JwtPayload;
            try {
                decoded = jwt.verify(
                    rawToken,
                    process.env.JWT_SECRET as string
                ) as JwtPayload;
            } catch (err) {
                console.error(err);
                return next();
            }

            // Avoid repeated DB calls by checking req.user first
            if (!req.user) {
                const user = await User.findById(decoded.id);
                if (user) {
                    req.user = user;
                }
            }
        }

        next();
    }
);

export default optionalUserAuth;
