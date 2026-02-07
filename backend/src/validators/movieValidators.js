import { z } from "zod";

const createMovieSchema = z.object({
    title: z.string().trim().min(1, "Movie title is required"),
    overview: z.string().trim().optional(),
    releaseYear: z.coerce.number().int("Release year must be an integer").min(1888, "Release year must be a valid year").max(new Date().getFullYear() + 10, "Release year must be a valid year"),
    // genres: z.array(z.string(), { message: "All genres must be strings" }).optional(),
    genres: z.string().optional().transform((str) => {
        if (!str) return [];
        try {
            return JSON.parse(str);
        } catch {
            return [];
        }
    }),
    runtime: z.coerce.number().int("Runtime must be an integer").positive("Runtime must be a positive number (in minutes)").optional(),
    // posterUrl: z.string().url("Poster url must be a valid url").optional()
    rating: z.coerce.number().int("Rating must be an integer").min(1, "Rating must be between 1 and 10").max(5, "Rating must be between 1 and 5").optional(),
});

const updateMovieSchema = z.object({
    title: z.string().trim().min(1, "Movie title is required"),
    overview: z.string().trim().optional(),
    releaseYear: z.coerce.number().int("Release year must be an integer").min(1888, "Release year must be a valid year").max(new Date().getFullYear() + 10, "Release year must be a valid year"),
    genres: z.string().optional().transform((str) => {
        if (!str) return [];
        try {
            return JSON.parse(str);
        } catch {
            return [];
        }
    }),
    runtime: z.coerce.number().int("Runtime must be an integer").positive("Runtime must be a positive number (in minutes)").optional(),
    rating: z.coerce.number().int("Rating must be an integer").min(1, "Rating must be between 1 and 10").max(5, "Rating must be between 1 and 5").optional(),
    comment: z.string().trim().optional()
});

export { createMovieSchema, updateMovieSchema };