import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { DatabaseModels } from "./model";

export interface IRequest {
    _id?: string;
    user: string;
    artist: string;
    song_title: string;
    request_date: number;
    ripped?: boolean;
    streamed?: number;
    stream_date?: Date;
    notes?: string;
}

const RequestSchema = new Schema<IRequest>({
    user: String,
    artist: String,
    song_title: String,
    request_date: Number,
    ripped: {
        type: Boolean,
        required: false,
    },
    streamed: {
        type: Number,
        required: false,
    },
    stream_date: {
        type: Date,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
});

export const RequestModel: Model<IRequest> =
    mongoose.models[DatabaseModels.Request] ||
    mongoose.model(DatabaseModels.Request, RequestSchema, "requests");
