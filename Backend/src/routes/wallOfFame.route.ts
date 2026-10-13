import { Router } from "express";
import {
    getWallOfFameEntries,
    addWallOfFameEntry,
    deleteWallOfFameEntry,
    updateWallOfFameEntry,
} from "../controllers/wallOfFame.controller";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import { body } from "express-validator";

const wallOfFameRouter = Router();

// Public
wallOfFameRouter.get("/", getWallOfFameEntries);

// Admin-only below
wallOfFameRouter.use(adminAuthMiddleware);

wallOfFameRouter.post(
    "/",
    [
        body("name").isString().notEmpty().isLength({ min: 2, max: 50 }),
        body("position").isString().notEmpty().isLength({ max: 100 }),
        body("bio").isString().notEmpty().isLength({ min: 10, max: 500 }),
        body("image").optional({ values: "null" }).isString(),
        body("badge").optional({ values: "null" }).isString().isLength({ max: 50 }),
        body("skills").optional().isArray(),
        body("skills.*").optional().isString(),
        body("social").optional().isObject(),
        body("social.linkedin").optional({ values: "null" }).isString(),
        body("social.github").optional({ values: "null" }).isString(),
        body("social.twitter").optional({ values: "null" }).isString(),
        body("social.instagram").optional({ values: "null" }).isString(),
        body("color")
            .optional()
            .isIn(["blue", "red", "yellow", "green"]),
        body("year").isString().notEmpty(),
    ],
    addWallOfFameEntry
);

wallOfFameRouter.put(
    "/:id",
    [
        body("name").optional().isString().notEmpty().isLength({ min: 2, max: 50 }),
        body("position").optional().isString().notEmpty().isLength({ max: 100 }),
        body("bio").optional().isString().notEmpty().isLength({ min: 10, max: 500 }),
        body("image").optional({ values: "null" }).isString(),
        body("badge").optional({ values: "null" }).isString().isLength({ max: 50 }),
        body("skills").optional().isArray(),
        body("skills.*").optional().isString(),
        body("social").optional().isObject(),
        body("social.linkedin").optional({ values: "null" }).isString(),
        body("social.github").optional({ values: "null" }).isString(),
        body("social.twitter").optional({ values: "null" }).isString(),
        body("social.instagram").optional({ values: "null" }).isString(),
        body("color")
            .optional()
            .isIn(["blue", "red", "yellow", "green"]),
        body("year").optional().isString().notEmpty(),
    ],
    updateWallOfFameEntry
);

wallOfFameRouter.delete("/:id", deleteWallOfFameEntry);

export default wallOfFameRouter;
