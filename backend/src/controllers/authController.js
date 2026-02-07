import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { tr } from "zod/v4/locales";

const register = async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await prisma.user.findUnique({
        where: { email: email }
    });

    // Check if user already exists
    if (userExists) {
        return res.status(400).json({
            error: "User already exists with that email."
        })
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    // Generate JWT
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "Success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email
            }
        },
        token
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    // Check if user email exists in the table
    if (!user) {
        return res.status(401).json({
            error: "Invalid email or password."
        });
    };

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            error: "Invalid email or password."
        });
    };

    // Generate JWT
    const token = generateToken(user.id, res);

    res.status(200).json({
        status: "Success",
        data: {
            user: {
                id: user.id,
                email: email
            }
        },
        token
    });
};

const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        status: "Success",
        message: "Logged out successfully"
    })
};

const myDetails = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profileUrl: true,
            bio: true,
            createdAt: true
        }
    });

    if (!user) {
        return res.status(404).json({
            error: "User not found."
        });
    }

    res.status(200).json({
        status: "Success",
        data: {
            user
        },
    });
}

const updateUser = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    });

    if (!user) {
        return res.status(404).json({
            error: "User not found."
        });
    }

    const { name, username, bio } = req.body
    const profileUrl = req.file ? req.file.path : user.profileUrl;
    
    const updatedUserInfo = await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            username,
            bio,
            profileUrl
        }
    })

    res.status(200).json({
        status: "Success",
        data: {
            updatedUserInfo
        },
    });
}

export { register, login, logout, myDetails, updateUser };