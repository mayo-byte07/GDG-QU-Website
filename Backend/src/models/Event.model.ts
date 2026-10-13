import { Schema, model } from "mongoose";
import type { IEvent } from "../types/Event.interface";

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 2000,
        },
        speakers: { type: [String], default: [], trim: true },

        type: {
            type: String,
            enum: [
                "conference",
                "meetup",
                "workshop",
                "hackathon",
                "webinar",
                "seminar",
                "bootcamp",
            ],
            required: true,
        },

        venue: { type: String, required: true, trim: true },

        date_from: { type: Date, required: true },

        date_to: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: IEvent, v: Date) {
                    return this.date_from < v;
                },
                message: "date_to must be after date_from",
            },
        },

        cover: { type: String, required: true, trim: true },
        photos: { type: [String], default: [] },
        gdgUrl: { type: String, required: true, unique: true, trim: true },
        gdgEventId: { type: Number, required: true, unique: true },
        participantCount: { type: Number, default: 0 },
        maxParticipants: { type: Number, default: 100 },
    },
    { timestamps: true }
);

export default model<IEvent>("Event", EventSchema);
