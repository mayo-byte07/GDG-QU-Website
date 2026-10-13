import { Router } from "express";
import {
    createContact,
    getAllContacts,
    getContactById,
    getLatestContact,
    deleteContactById,
} from "../controllers/contact.controller";
import { body, param } from "express-validator";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError";

const createContactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 create contact requests per `window` (here, per 15 minutes)
    message:
        "Too many contact requests created from this IP, please try again after 15 minutes",
    handler: (_req, _res, next) => {
        next(
            new ApiError(
                429,
                "Too many contact requests created from this IP, please try again after 15 minutes"
            )
        );
    },
});

const contactRouter = Router();

contactRouter.post(
    "/",
    [
        body("name")
            .isString()
            .withMessage("Name must be a string")
            .isLength({ min: 2, max: 100 })
            .withMessage("Name must be between 2 and 100 characters"),
        body("email").isEmail().withMessage("Invalid email address"),
        body("message")
            .isString()
            .withMessage("Message must be a string")
            .isLength({ min: 10, max: 1000 })
            .withMessage("Message must be between 10 and 1000 characters"),
    ],
    createContactLimiter,
    createContact
);

contactRouter.get("/latest", adminAuthMiddleware, getLatestContact);
contactRouter.get("/", adminAuthMiddleware, getAllContacts);
contactRouter.get(
    "/:id",
    adminAuthMiddleware,
    param("id").isMongoId().withMessage("Invalid contact ID"),
    getContactById
);
contactRouter.delete(
    "/:id",
    adminAuthMiddleware,
    param("id").isMongoId().withMessage("Invalid contact ID"),
    deleteContactById
);

export default contactRouter;
