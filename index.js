import express from "express";
import { UserRegisterSchema, User, UserLoginSchema } from "./model/User.js";
import { CategoryTypeSchema, RequestAssign, RequestAssignSchema, RequestStatus, ServiceRequest, ServiceRequestSchema } from "./model/Category.js";
import { z } from "zod";
import { authMiddleware, createToken } from "./controllers/auth.js";

const app = express();

app.use(express.json());

// Register user
app.post("/11_module_b/api/auth/register", async (req, res) => {
    const body = req.body;
    const verify = UserRegisterSchema.safeParse(body);
    if (verify.success) {
        const newUser = new User(verify.data);
        console.log(verify.data);
        await newUser.save();
        return res.json({
            success: true,
            message: "User registered successfully"
        })
    }
    return res.json({
        success: false,
        message: verify.error
    })
})

// Log in user and send back jwt
app.post("/11_module_b/api/auth/login", async (req, res) => {
    const body = req.body;
    const verify = UserLoginSchema.safeParse(body);
    if (verify.success) {
        const checkUser = await User.find({
            email: verify.data.email,
            password: verify.data.password
        }, ['_id'])
        if (checkUser.length != 0) {
            const token = createToken(checkUser._id);
            return res.json({
                success: true,
                access_token: "",
                token_type: "Bearer",
                expires_in: 0
            }).status(200)
        }
        return res.json({
            success: false,
            mesasge: "No User found with those credentials"
        }).status(401)
    }
    
    return res.json({
        success: false,
        mesasge: "Invalid data"
    }).status(401)
})

// Get logged in users profile
app.get("/11_module_b/api/auth/profile", async (req, res) => {
    const user_id = req.user_id;
    const user = await User.findById(req.user_id);
    if (user) {
        return res.json({
            success: true, 
            data: user
        }).status(200)
    }
    return res.json({
        success: true, 
        message: "No user found"
    }).status(402);
})

// Auth logout
app.post("/11_module_b/api/auth/logout", (req, res) => {
    res.json({
        success: "true",
        message: "You successfully logged out!"
    })
})

// List users (ADMIN ONLY)
app.get("/11_module_b/api/users",  async (req, res) => {
    const user_id = req.user_id;
    const user = await User.find({
        _id: user_id,
        role: "ADMIN"
    })
    if (user.length != 0) {
        const allUsers = await User.find({});
        res.json({
            success: true,
            data: allUsers
        }).status(200);
    }
    res.json({
        success: false,
        message: "User was not an ADMIN"
    }).status(403);
    
})

// View User Details
app.get("/11_module_b/api/users/:id", async (req, res) => {
    const searchUserId = req.params.id;
    const user_id = req.user_id;
    const user = await User.find({
        id: searchUserId
    })
    if (user.length != 0) {
        res.json({
            success: true,
            data: user
        }).status(200);
    }
    res.json({
        success: false,
        message: "User not found"
    }).status(404);
})

// Create Category (ADMIN ONLY)
app.post("/11_module_b/api/categories", async (req, res) => {
    const user_id = req.user_id;
    const user = await User.find({
        _id: user_id,
        role: "ADMIN"
    })
    if (user.length != 0) {
        const body = req.body;
        const verify = CategoryTypeSchema.safeParse(body);
        if (verify.success) {
            const newCategory = new CategoryType({
                name: verify.data.name,
                priority: verify.data.priority
            });
            res.json({
                success: true,
                message: "Category Created"
            }).status(200);
        }
        res.json({
            success: false,
            message: "Invlaid format sent"
        }).status(404);
    }

    res.json({
        success: false,
        message: "User was not an ADMIN"
    }).status(403);
})

// List Categories
app.get("/11_module_b/api/categories", async (req, res) => {
    const categories = await CategoryType.find({});
    res.json({
        success: true,
        data: categories
    }).status(200);
})

// Update Category
app.put("/11_module_b/api/categories/:id", async(req, res) => {
    const updateId = req.params.id;
    const body = req.body;
    const verify = CategoryTypeSchema.safeParse(body);

    if (verify.success) {
        await CategoryType.updateOne({
            _id: updateId,
        }, {
            ...verify.data
        });
        res.json({
            success: true,
            message: "Category Updated"
        }).status(200);
    }   
    res.json({
        success: false,
        message: "Category Updated"
    }).status(200);
})

// Create request
app.post("/11_module_b/api/requests", async(req, res) => {
    const body = req.body;
    const verify = ServiceRequestSchema.safeParse(body);

    if (verify.success) {
        const newRequest = new ServiceRequest(verify.data);
        const res = newRequest.save();
        res.json({
            success: true,
            // TODO: Update this and add the request ID itself
            message: "Request Created"
        }).status(200);
    }
    res.json({
        success: false,
        message: "Invalid format"
    }).status(403);
});

// List requests
app.post("/11_module_b/api/requests", async(req, res) => {
    const user_id = req.user_id;
    const reqs = await ServiceRequest.find({
        user_id,
    })
    if (reqs.length != 0) {
        return res.json({
            success: true,
            data: reqs
        }).status(200)
    }
    return res.json({
        success: false,
        message: "No request with this user found"
    }).status(404)
});

// View Request details
app.get("/11_module_b/api/requests/:id", async (req, res) => {
    const requestId = req.params.id;
    const reqStatus = await RequestStatus.find({
        request_id: requestId
    });
    if (reqStatus.length != 0) {
        return res.json({
            success: true,
            data: reqStatus
        }).status(200)
    }
    return res.json({
        success: false,
        message: "No request with this id found"
    }).status(404)
})

// Assign Request
app.put("/11_module_b/api/requests/:id/assign", async (req, res) => {
    const requestId = req.params.id;
    const body = req.body;
    const verify = RequestAssignSchema.safeParse(body);
    if (verify.success) {
        const newAssign = new RequestAssign(verify.data);
        return res.json({
            success: true,
            message: "ASSIGNED"
        }).status(200)
    }
    return res.json({
        success: false,
        message: "Invalid format for data"
    }).status(402)
});

// Update Status
app.put("/11_module_b/api/requests/:id/status", async (req, res) => {
    const requestId = req.params.id;
    const body = req.body;
    const verify = z.object({status: z.string()}).safeParse(body);
    if (verify.success) {
        await RequestAssign.update({
            request_id: requestId
        }, {
            status: verify.data.status
        });
        return res.json({
            success: true,
            message: "Status Updated"
        }).status(200)
    }
    return res.json({
        success: false,
        message: "Invalid format for data"
    }).status(402)
})

// Cancel REquest
app.put("/11_module_b/api/requests/:id/cancel", async (req, res) => {
    const requestId = req.params.id;
    const body = req.body;
    const verify = z.object({reason: z.string()}).safeParse(body);
    if (verify.success) {
        await RequestStatus.update({
            request_id: requestId
        }, {
            status: "CANCELLED",
            reason: verify.data.reason
        });
        return res.json({
            success: true,
            message: "Cancelled"
        }).status(200)
    }
    return res.json({
        success: false,
        message: "Invalid format for data"
    }).status(402)
})

app.post("/11_module_b/api/requests/:id/comments", async (req, res) => {
    const requestId = req.params.id;
    const user_id = req.user_id;
    const body = req.body;
    const verify = z.object({comment: z.string()}).safeParse(body);
    if (verify.success) {
        const newComment = new Comment({
            user_id,
            request_id: requestId,
            message: verify.data.comment
        })
        newComment.save();
        return res.json({
            success: true,
            message: "Comment Added"
        }).status(200)
    }
    return res.json({
        success: false,
        message: "Invalid format for data"
    }).status(402)
});

app.get("/11_module_b/api/requests/:id/comments", async (req, res) => {
    const requestId = req.params.id;
    const comments = await Comments.find({
        request_id: requestId
    })
    if (comments.length != 0) {
        res.json({
            success: true,
            data: comments
        }).status(200);
    }
    res.json({
        success: false,
        message: "No comments found with this ID"
    }).status(402);
});

app.get("/11_module_b/api/reports/summary", async (req, res) => {
    const open = await RequestStatus.aggregate({
        status: "OPEN"
    })
    const inProg = await RequestStatus.aggregate({
        status: "IN-PROGRESS"
    })
    const resolved = await RequestStatus.aggregate({
        status: "RESOLVED"
    })

    res.json({
        "OPEN": open,
        "IN_PROGRESS": inProg,
        "RESOLVED": resolved
    }).status(200);
});


app.listen(3000);