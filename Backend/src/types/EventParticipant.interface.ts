import { Types, Document } from "mongoose";

export interface IEventParticipant extends Document {
    eventId: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
