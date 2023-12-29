import { Schema, model, SchemaTypes } from "mongoose";

const SupportTicketSchema = new Schema({
    title: {
        type: SchemaTypes.String,
        required: true
    },
    description: {
        type: SchemaTypes.String,
        required: true
    },
    status: {
        type: SchemaTypes.String,
        enum: ["pending" , "ongoing" , "resolved" , "cancelled"],
        required: true
    },
    homeowner: {
        type: SchemaTypes.ObjectId,
        ref: "Homeowner",
        required: true
    },
}, { timestamps: true })


export const SupportTicketModel = model<any>("SupportTicket", SupportTicketSchema);