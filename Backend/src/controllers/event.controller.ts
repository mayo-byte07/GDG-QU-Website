import { validationResult } from "express-validator";
import Event from "../models/Event.model";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { fetchGdgMedia } from "../utils/eventFetcher";
import EventParticipant from "../models/EventParticipant.model";
import mongoose, { isValidObjectId, Types } from "mongoose";

// TODO: pagenation
export const getAllEvents = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            const events = await Event.find().sort({ date_from: -1 });
            res.sendResponse(200, "Events fetched successfully", events);
        } else {
            const userId = req.user._id;
            const events = await Event.aggregate([
                {
                    $sort: { date_from: -1 },
                },
                {
                    $lookup: {
                        from: "eventparticipants",
                        let: { eventId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$eventId", "$$eventId"] },
                                            {
                                                $eq: [
                                                    "$userId",
                                                    new Types.ObjectId(userId),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "enrollments",
                    },
                },
                {
                    $addFields: {
                        isEnrolled: {
                            $gt: [{ $size: "$enrollments" }, 0],
                        },
                    },
                },
                {
                    $project: {
                        enrollments: 0,
                    },
                },
            ]);
            res.sendResponse(200, "Events fetched successfully", events);
        }
    }
);

export const getEventById = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        if (!req.user) {
            const eventId = req.params.id;
            const event = await Event.findById(eventId);
            if (!event) {
                throw new ApiError(404, "Event not found");
            }
            res.sendResponse(200, "Event fetched successfully", event);
        } else {
            const eventId = req.params.id;
            const userId = req.user._id;

            const events = await Event.aggregate([
                {
                    $match: { _id: new Types.ObjectId(eventId) },
                },
                {
                    $lookup: {
                        from: "eventparticipants",
                        let: { eventId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$eventId", "$$eventId"] },
                                            {
                                                $eq: [
                                                    "$userId",
                                                    new Types.ObjectId(userId),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "enrollments",
                    },
                },
                {
                    $addFields: {
                        isEnrolled: {
                            $gt: [{ $size: "$enrollments" }, 0],
                        },
                    },
                },
                {
                    $project: {
                        enrollments: 0,
                    },
                },
            ]);

            if (events.length === 0) {
                throw new ApiError(404, "Event not found");
            }

            res.sendResponse(200, "Event fetched successfully", events[0]);
        }
    }
);

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, JSON.stringify(errors.array()));
    }
    const {
        title,
        description,
        speakers,
        type,
        venue,
        date_from,
        date_to,
        gdgUrl,
        maxParticipants,
    } = req.body;

    // Fetching CoverImage, gdgEventId and photos from GDG URL
    const { coverImageUrl, gdgEventId, eventPhotos } =
        await fetchGdgMedia(gdgUrl);

    // Check if an event with the same gdgEventId already exists
    const existingEvent = await Event.findOne({ gdgEventId: gdgEventId });
    if (existingEvent) {
        throw new ApiError(
            409,
            "An event with the same GDG Event ID already exists"
        );
    }

    const newEvent = await Event.create({
        title,
        description,
        speakers,
        type,
        venue,
        date_from,
        date_to,
        cover: coverImageUrl,
        photos: eventPhotos,
        gdgUrl,
        gdgEventId: Number(gdgEventId),
        maxParticipants: maxParticipants ?? 100,
    });

    if (!newEvent) {
        throw new ApiError(500, "Failed to create event");
    }

    res.sendResponse(201, "Event created successfully", newEvent);
});

export const refreshEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        // Fetching updated CoverImage and photos from GDG URL
        const { coverImageUrl, eventPhotos } = await fetchGdgMedia(
            event.gdgUrl
        );

        event.cover = coverImageUrl;
        event.photos = eventPhotos;
        await event.save();

        res.sendResponse(200, "Event refreshed successfully", event);
    }
);

export const enrollForEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        const user = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!user.isProfileComplete) {
            throw new ApiError(
                400,
                "Complete your profile to enroll for events"
            );
        }

        if (event.participantCount >= event.maxParticipants) {
            throw new ApiError(400, "Event has reached maximum participants");
        }

        // Check if the user is already enrolled
        const isAlreadyEnrolled = await EventParticipant.findOne({
            eventId: event._id,
            userId: user._id,
        });
        if (isAlreadyEnrolled) {
            throw new ApiError(409, "User is already enrolled for this event");
        }

        const enrollment = await EventParticipant.create({
            eventId: event._id,
            userId: user._id,
        });

        if (!enrollment) {
            throw new ApiError(500, "Failed to enroll for event");
        }

        event.participantCount += 1;
        await event.save();

        res.sendResponse(201, "Enrolled for event successfully", enrollment);
    }
);

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, JSON.stringify(errors.array()));
    }

    const eventId = req.params.id;
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }
    await EventParticipant.deleteMany({ eventId: event._id });

    res.sendResponse(200, "Event deleted successfully", null);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, JSON.stringify(errors.array()));
    }

    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    const updatableFields = [
        "title",
        "description",
        "speakers",
        "type",
        "venue",
        "date_from",
        "date_to",
        "maxParticipants",
    ];

    updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            (event as any)[field] = req.body[field];
        }
    });

    await event.save();
    const updatedEvent = await Event.findById(eventId);

    res.sendResponse(200, "Event updated successfully", updatedEvent);
});

export const getEventParticipants = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        const participants = await EventParticipant.find({ eventId: event._id })
            .populate("userId", "name email photo")
            .exec();

        res.sendResponse(
            200,
            "Event participants fetched successfully",
            participants
        );
    }
);

export const getEnrolledEvents = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        const enrollments = await EventParticipant.find({ userId: user._id })
            .populate("eventId")
            .exec();

        const enrolledEvents = enrollments.map(
            (enrollment) => enrollment.eventId
        );

        res.sendResponse(
            200,
            "Enrolled events fetched successfully",
            enrolledEvents
        );
    }
);

export const unenrollFromEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const eventId = req.params.id;

        if (!isValidObjectId(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        const enrollment = await EventParticipant.findOneAndDelete({
            eventId,
            userId: req.user!._id,
        });

        if (!enrollment) {
            throw new ApiError(404, "Enrollment not found");
        }

        await Event.findByIdAndUpdate(
            eventId,
            { $inc: { participantCount: -1 } },
            { new: true }
        );

        res.sendResponse(200, "Unenrolled from event successfully", null);
    }
);
