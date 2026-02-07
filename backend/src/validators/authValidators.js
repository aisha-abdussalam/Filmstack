import { z } from "zod";

// Validation schema for user registration
//Validates name, email format, and password strength
const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least two characters"),
    email: z.string().min(1, "Email is required").email("Please provide a valid email").toLowerCase(),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least six characters")
})

// Validation schema for user login
// Validates email format and ensures password is provided
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please provide a valid email").toLowerCase(),
    password: z.string().min(1, "Password is required")
})


// Validation schema for user update
const updateUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least two characters"),
    username: z.string().toLowerCase().optional(),
    bio: z.string().trim().optional()
})

export { registerSchema, loginSchema, updateUserSchema };