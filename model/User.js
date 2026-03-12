import {z} from "zod";
import {mg} from "./db.js";

export const User = mg.model("User", {
    name: String,
    email: String,
    password: String,
    role: String
})

export const UserRegisterSchema = z.object({
    name: z.string("Name should be given as string"),
    email: z.email("Email should be correctely formatted."),
    password: z.string(),
    role: z.string(),
})

export const UserLoginSchema = z.object({
    email: z.email("Email should be correctely formatted."),
    password: z.string(),
})