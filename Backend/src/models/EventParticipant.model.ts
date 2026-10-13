import { Schema, model } from "mongoose";
import type { IEventParticipant } from "../types/EventParticipant.interface";

const EventParticipantSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const EventParticipant = model<IEventParticipant>(
    "EventParticipant",
    EventParticipantSchema
);

export default EventParticipant;
