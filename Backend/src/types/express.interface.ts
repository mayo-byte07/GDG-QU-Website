import type { Response, Request } from "express";

declare global {
    namespace Express {
        interface Response {
            sendResponse: (
                statusCode: number,
                message: string,
                data?: any
            ) => void;
        }
        interface Request {
            user?: any;
        }
    }
}

export type { Response, Request };
