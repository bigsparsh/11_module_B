import express from "express";
import { UserRegisterSchema } from "./model/User";

const app = express();

app.use(express.json());

app.use("/11_module_b/api");

app.post("/auth/register", async (req, res) => {
    const body = req.body;
    const verify = UserRegisterSchema.safeParse(body);
    if (verify.success) {
        const newUser = new User(verify.data);
        await newUser.save();
        return res.json({
            success: true,
            message: "User registered successfully"
        })
    }
})

app.post("/auth/login", (req, res) => {
    
})

app.listen(3000);