import express from "express";
import { addToWatchlist, removeFromWatchlistItem, updateWatchlistItem, getMyWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema, updateWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware)

router.get("/", getMyWatchlist);

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

router.put("/:id", validateRequest(updateWatchlistSchema), updateWatchlistItem);

router.delete("/:id", removeFromWatchlistItem);

export default router;