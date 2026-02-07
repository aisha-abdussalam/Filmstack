import { prisma } from "../config/db.js";

const createMovie = async (req, res) => {
    const { title, overview, releaseYear, runtime, rating } = req.body;
    const genres = req.body.genres? JSON.parse(req.body.genres) : [];
    const posterUrl = req.file ? req.file.path : null;

    const movieExists = await prisma.movie.findFirst({
        where: {title: title}
    })

    if (movieExists) {
        return res.status(400).json({
            error: "Movie already exist.",
        })
    }
    
    const movie = await prisma.movie.create({
        data: {
            title,
            overview,
            releaseYear: parseInt(releaseYear),
            genres,
            runtime: runtime ? parseInt(runtime) : null,
            rating: parseInt(rating),
            posterUrl,
            createdBy: req.user.id
        }
    })

    res.status(201).json({
        status: "Success",
        data: movie
    })
};

const updateMovie = async (req, res) => {
    const existingMovie = await prisma.movie.findUnique({
        where: { id: req.params.id }
    })

    if (!existingMovie) {
        return res.status(404).json({
            error: "Movie not found."
        });
    };

    if (existingMovie.createdBy !== req.user.id) {
        return res.status(403).json({
            error: "Not allowed to update this movie."
        });
    };

    const { title, overview, releaseYear, runtime, rating, comment } = req.body;
    const genres = req.body.genres ? JSON.parse(req.body.genres) : [];
    const posterUrl = req.file ? req.file.path : existingMovie.posterUrl;
    
    const updatedMovieItem = await prisma.movie.update({
        where: {
            id: req.params.id,
        },
        data: {
            title,
            overview,
            releaseYear: parseInt(releaseYear),
            genres,
            runtime: runtime ? parseInt(runtime) : null,
            rating: parseInt(rating),
            posterUrl,
            comment
        }
    })

    res.status(200).json({
        status: "Success",
        data: updatedMovieItem
    })
};

// Delete movie
const removeFromMovies = async (req, res) => {
    const movie = await prisma.movie.findUnique({
        where: { id: req.params.id }
    })

    if (!movie) {
        return res.status(404).json({
            error: "Movie not found."
        })
    }

    // Ensure only owner can delete
    if (movie.createdBy !== req.user.id) {
        return res.status(403).json({
            error: "Not allowed to delete this movie."
        })
    }

    await prisma.movie.delete({
        where: {
            id: req.params.id,
        },
    });

    res.status(200).json({
        status: "Success",
        message: "Movie deleted from list."
    })
}

export { createMovie, updateMovie, removeFromMovies };