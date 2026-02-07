import { prisma } from "../config/db.js";

const fetchMovies = async (req, res) => {
    const title = req.query.search;
    const genres = [].concat(req.query.genres || []);
    // const genres = req.query.genres ? (Array.isArray(req.query.genres) ? req.query.genres : [req.query.genres]) : [];


    // Pagination
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 8;
    // const skip = (page - 1) * limit;

    let queryOptions = {};
    if (title) {
        queryOptions.title = {
            contains: title,
            mode: "insensitive"
        }
    }

    if (genres.length > 0) {
        queryOptions.genres = {
            hasSome: genres,
        }
    }

    // Calculate the total number of pages
    // const total = await prisma.movie.count({
    //     where: {
    //         ...queryOptions,
    //         deleteAt: null
    //     }
    // });
    // const totalPages = Math.ceil(total / limit);

    // orderBy sorts it by the latest movies first
    const result = await prisma.movie.findMany({
        where: {
            ...queryOptions,
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            creator: {
                select: {
                    name: true,
                    email: true,
                    profileUrl: true
                }
            }
        },
        // skip: skip,
        // take: limit
    });

    if (result.length === 0) {
        return res.status(200).json({ error: "Movie not found." });
    }

    res.status(200).json({
        status: "Success",
        // totalPages,
        data: {
            result
        },
    })
};

const fetchSingleMovie = async (req, res) => {
    const movie = await prisma.movie.findFirst({
        where: {
            id: req.params.id,
        },
        include: {
            creator: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
    });

    if (!movie) {
        return res.status(404).json({
            error: "Movie not found."
        })
    }
    
    res.status(200).json({
        status: "Success",
        data: {
            movie
        },
    })
}

export { fetchMovies, fetchSingleMovie };