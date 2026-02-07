import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    // Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId }
    });

    if (!movie) {
        return res.status(404).json({
            error: "Movie not found."
        })
    }

    const existingInWatchlist = await prisma.watchListItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId
            }
        }
    });

    if (existingInWatchlist) {
        return res.status(400).json({
            error: "Movie already in the watchlist."
        })
    }

    const watchListItem = await prisma.watchListItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes
        }
    });

    res.status(201).json({
        status: "Success",
        data: {
            watchListItem
        }
    })
};

    // Update watchlist item
    // Updates status, rating, or notes
    // Ensures only owner can update
    // Requires protect middleware

const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body

    const watchListItem = await prisma.watchListItem.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (!watchListItem) {
        return res.status(404).json({
            error: "Watchlist item not found."
        })
    }

    // Ensure only owner can update
    if (watchListItem.userId !== req.user.id) {
        return res.status(403).json({
            error: "Not allowed to update this watchlist item."
        })
    }

    // Build update data
    const updateData = {};

    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    
    const updatedItem = await prisma.watchListItem.update({
        where: {
            id: req.params.id,
        },
        data: updateData
    })

    res.status(200).json({
        status: "Success",
        data: {
            watchListItem: updatedItem
        }
    });
};

const removeFromWatchlistItem = async (req, res) => {
    const watchListItem = await prisma.watchListItem.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (!watchListItem) {
        return res.status(404).json({
            error: "Watchlist item not found."
        })
    }

    // Ensure only owner can delete
    if (watchListItem.userId !== req.user.id) {
        return res.status(403).json({
            error: "Not allowed to delete this watchlist item."
        })
    }

    await prisma.watchListItem.delete({
        where: {
            id: req.params.id,
        }
    })

    res.status(200).json({
        status: "Success",
        message: "Movie removed from watchlist."
    });
};

// const getMyWatchlist = async (req, res) => {
//     const watchlist = await prisma.watchListItem.findMany({
//         where: { userId: req.user.id },
//         include: {
//             movie: true
//         }
//     });

//     res.status(200).json({ status: "Success", data: { watchlist } });
// };

const getMyWatchlist = async (req, res) => {
    const title = req.query.search;
    const genres = [].concat(req.query.genres || []);

    let movieFilters = {};

    if (title) {
        movieFilters.title = {
            contains: title,
            mode: "insensitive"
        };
    }

    if (genres.length > 0) {
        movieFilters.genres = {
            hasSome: genres,
        };
    }

    const watchlist = await prisma.watchListItem.findMany({
        where: {
            userId: req.user.id,
            movie: {
                ...movieFilters,
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            movie: true
        },
    });

    if (watchlist.length === 0) {
        return res.status(200).json({
            status: "Success",
            message: "No movies found matching your criteria.",
            data: { watchlist: [] }
        });
    }

    res.status(200).json({
        status: "Success",
        data: { watchlist },
    });
};

export { addToWatchlist, updateWatchlistItem, removeFromWatchlistItem, getMyWatchlist }; 