import express from "express";
import { register, login, logout, myDetails, updateUser } from "../controllers/authController.js";
import { registerSchema, loginSchema, updateUserSchema } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout)
router.get("/me", authMiddleware, myDetails)
router.put("/me", authMiddleware, upload.single('profileUrl'), validateRequest(updateUserSchema), updateUser)

export default router;