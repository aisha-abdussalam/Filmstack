import express from "express";
import { createMovie, updateMovie, removeFromMovies } from "../controllers/movieControllers.js";
import { fetchMovies, fetchSingleMovie } from "../controllers/fetchMoviesControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createMovieSchema, updateMovieSchema } from "../validators/movieValidators.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// router.use(authMiddleware);

router.get("/", fetchMovies)

router.get("/:id", fetchSingleMovie)

router.post("/", authMiddleware, upload.single('posterUrl'), validateRequest(createMovieSchema), createMovie);

router.put("/:id", authMiddleware, upload.single('posterUrl'), validateRequest(updateMovieSchema), updateMovie);

router.delete("/:id", authMiddleware, removeFromMovies);

export default router;