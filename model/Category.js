import {z} from "zod";
import {mg} from "./db.js";

export const CategoryType = mg.model("CategoryType", {
    name: String,
    priority: String,
})

export const ServiceRequest = mg.model("ServiceRequest", {
    category_id: String,
    title: String,
    location: String,
    description: String,
    user_id: String,
})

export const RequestStatus = mg.model("RequestStatus", {
    request_id: String,
    status: String,
    reason: String,
})

export const Comment = mg.model("Comment", {
    user_id: String,
    request_id: String,
    message: String
})

export const RequestAssign = mg.model("RequestAssign", {
    request_id: String,
    staff_id: String,
    due_date: Date,
})

export const CategoryTypeSchema = z.object({
    name: z.string(),
    priority: z.string
})

export const ServiceRequestSchema = z.object({
    category_id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
})

export const RequestAssignSchema = z.object({
    staff_id: z.string(),
    due_date: z.date(),
})
