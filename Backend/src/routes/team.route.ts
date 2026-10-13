import { Router } from "express";
import {
    createTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    getTeamMembers,
    updateTeamMember,
} from "../controllers/team.controller";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import { body, param } from "express-validator";

const teamRouter = Router();

teamRouter.get("/", getTeamMembers);
teamRouter.get("/:id", param("id").exists().isMongoId(), getTeamMemberById);

// ADMIN ONLY ROUTES
teamRouter.use(adminAuthMiddleware);
teamRouter.post(
    "/create",
    [
        body("name").exists().isString().trim().isLength({ min: 2, max: 50 }),
        body("position")
            .exists()
            .isString()
            .trim()
            .isLength({ min: 2, max: 20 }),
        body("bio").exists().isString().trim().isLength({ min: 10, max: 500 }),
        body("fullBio")
            .exists()
            .isString()
            .trim()
            .isLength({ min: 10, max: 500 }),
        body("image").optional().isURL(),
        body("linkedinUrl").optional().isURL(),
        body("githubUrl").optional().isURL(),
        body("twitterUrl").optional().isURL(),
        body("instagramUrl").optional().isURL(),
        body("badge").optional().isString(),
        body("skills").optional().isArray(),
    ],
    createTeamMember
);
teamRouter.put(
    "/:id",
    [
        param("id").exists().isMongoId(),
        body("name").optional().isString().trim().isLength({ min: 2, max: 50 }),
        body("position")
            .optional()
            .isString()
            .trim()
            .isLength({ min: 2, max: 20 }),
        body("bio")
            .optional()
            .isString()
            .trim()
            .isLength({ min: 10, max: 500 }),
        body("fullBio")
            .optional()
            .isString()
            .trim()
            .isLength({ min: 10, max: 500 }),
        body("image").optional().isURL(),
        body("linkedinUrl").optional().isURL(),
        body("githubUrl").optional().isURL(),
        body("twitterUrl").optional().isURL(),
        body("instagramUrl").optional().isURL(),
        body("badge").optional().isString(),
        body("skills").optional().isArray(),
    ],
    updateTeamMember
);
teamRouter.delete("/:id", param("id").exists().isMongoId(), deleteTeamMember);

export default teamRouter;
