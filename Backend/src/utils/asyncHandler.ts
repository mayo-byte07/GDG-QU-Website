import type { Request, NextFunction } from "express";
import { ApiResponse } from "./ApiResponse";
import type { Response } from "../types/express.interface";

export const asyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        // Trying something new this time.
        // Adding a custom method to res object because I had to send status code twice normally (once in res.status and once in the ApiResponse class).
        // This way, I can just call res.sendResponse and it handles both.
        res.sendResponse = (
            statusCode: number,
            message: string,
            data: any = null
        ) => {
            res.status(statusCode).json(
                new ApiResponse(statusCode, message, data)
            );
        };
        Promise.resolve(fn(req, res, next)).catch(next);
    };
