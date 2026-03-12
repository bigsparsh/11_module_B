import {z} from "zod";
import {mg} from "./db";

const User = mg.model("User", {
    name: String,
    email: String,
    password: String,
    state: "CITIZEN" | "STAFF"
})

export const UserRegisterSchema = z.object({
    name: z.string("Name should be given as string"),
    email: z.email("Email should be correctely formatted."),
    password: z.string(),
    state: z.literal("CITIZEN" | "STAFF")
})