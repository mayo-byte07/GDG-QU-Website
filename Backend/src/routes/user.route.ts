import { Router } from "express";
import {
    getAllUsers,
    getSelf,
    getUserById,
    updateUser,
} from "../controllers/user.controller";
import { body, param } from "express-validator";
import userAuthMiddleware from "../middlewares/userAuth.middleware";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

const userRouter = Router();

userRouter.get("/me", userAuthMiddleware, getSelf);
userRouter.get("/all", adminAuthMiddleware, getAllUsers);

userRouter.get(
    "/isAdmin",
    adminAuthMiddleware,
    asyncHandler(async (_: Request, res: Response) => {
        res.sendResponse(200, "User is an admin", { isAdmin: true });
    })
);

userRouter.get(
    "/:userId",
    param("userId").isMongoId(),
    adminAuthMiddleware,
    getUserById
);

userRouter.put(
    "/update",
    userAuthMiddleware,
    [
        body("realName")
            .optional()
            .trim()
            .isString()
            .isLength({ min: 2, max: 50 })
            .withMessage("Real name must be between 2 and 50 characters"),
        body("qid")
            .optional()
            .isInt({ gt: 20000000, lt: 25999999 })
            .withMessage(
                "QID must be a valid integer between 20000000 and 25999999"
            ),
        body("course")
            .optional()
            .trim()
            .isString()
            .withMessage("Course must be a string"),
        body("branch")
            .optional()
            .trim()
            .isString()
            .withMessage("Branch must be a string"),
    ],
    updateUser
);
export default userRouter;
