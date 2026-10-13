import { Router } from "express";
import {
    createEvent,
    deleteEvent,
    enrollForEvent,
    getAllEvents,
    getEnrolledEvents,
    getEventById,
    getEventParticipants,
    refreshEvent,
    updateEvent,
    unenrollFromEvent,
} from "../controllers/event.controller";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import { body, param } from "express-validator";
import userAuthMiddleware from "../middlewares/userAuth.middleware";
import optionalUserAuth from "../middlewares/optionalUserAuth.middleware";

const eventRouter = Router();

eventRouter.get("/", optionalUserAuth, getAllEvents);
eventRouter.get("/enrolled", userAuthMiddleware, getEnrolledEvents);
eventRouter.get(
    "/:id",
    param("id").isMongoId().withMessage("Invalid event ID"),
    optionalUserAuth,
    getEventById
);
eventRouter.post(
    "/enroll/:id",
    param("id").isMongoId(),
    userAuthMiddleware,
    enrollForEvent
);
eventRouter.post("/unenroll/:id", param("id").isMongoId(), userAuthMiddleware, unenrollFromEvent);

eventRouter.use(adminAuthMiddleware);
eventRouter.post(
    "/create",
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ min: 5 })
            .withMessage("Title must be at least 5 characters long"),
        body("description")
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Description is required"),
        body("speakers")
            .isArray({ min: 1 })
            .withMessage("At least one speaker is required"),
        body("type")
            .notEmpty()
            .isIn([
                "conference",
                "meetup",
                "workshop",
                "hackathon",
                "webinar",
                "seminar",
                "bootcamp",
            ])
            .withMessage("Invalid event type"),
        body("venue").notEmpty().withMessage("Venue is required"),
        body("date_from")
            .notEmpty()
            .isISO8601()
            .toDate()
            .withMessage("Invalid start date"),
        body("date_to").notEmpty().toDate().withMessage("Invalid end date"),
        body("gdgUrl")
            .notEmpty()
            .withMessage("GDG URL is required")
            .bail()
            .matches(
                /^https:\/\/gdg\.community\.dev\/(e\/[a-zA-Z0-9]+\/?|events\/details\/[a-z0-9-]+\/?)$/
            )
            .withMessage("Invalid GDG event URL format"),
        body("maxParticipants")
            .optional()
            .isInt({ min: 0 })
            .withMessage("maxParticipants must be a positive integer"),
    ],
    createEvent
);
eventRouter.post("/refresh/:id", param("id").isMongoId(), refreshEvent);
eventRouter.delete(
    "/:id",
    param("id").isMongoId().withMessage("Invalid event ID"),
    deleteEvent
);
eventRouter.put(
    "/:id",
    param("id").isMongoId().withMessage("Invalid event ID"),
    [
        body("title")
            .optional()
            .isLength({ min: 5 })
            .withMessage("Title must be at least 5 characters long"),
        body("description")
            .optional()
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters long"),
        body("speakers")
            .optional()
            .isArray({ min: 1 })
            .withMessage("At least one speaker is required"),
        body("type")
            .optional()
            .isIn([
                "conference",
                "meetup",
                "workshop",
                "hackathon",
                "webinar",
                "seminar",
                "bootcamp",
            ])
            .withMessage("Invalid event type"),
        body("venue")
            .optional()
            .notEmpty()
            .withMessage("Venue cannot be empty"),
        body("date_from")
            .optional()
            .isISO8601()
            .toDate()
            .withMessage("Invalid start date"),
        body("date_to")
            .optional()
            .isISO8601()
            .toDate()
            .withMessage("Invalid end date"),
        body("gdgUrl")
            .optional()
            .matches(
                /^https:\/\/gdg\.community\.dev\/(e\/[a-zA-Z0-9]+\/?|events\/details\/[a-z0-9-]+\/?)$/
            )
            .withMessage("Invalid GDG event URL format"),
        body("maxParticipants")
            .optional()
            .isInt({ min: 0 })
            .withMessage("maxParticipants must be a positive integer"),
    ],
    updateEvent
);
eventRouter.get(
    "/participants/:id",
    param("id").isMongoId(),
    getEventParticipants
);


export default eventRouter;
