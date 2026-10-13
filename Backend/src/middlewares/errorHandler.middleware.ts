import type { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _: NextFunction
) => {
    console.error(err);
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: false,
            message: err.message,
            data: process.env.NODE_ENV === "development" ? err.stack : {},
        });
    } else {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

export default errorHandler;
