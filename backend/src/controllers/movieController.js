const prisma = require("../lib/prisma");
const { createPosterUrl } = require("../services/tmdbService");

function averageScore(ratings) {
  if (!ratings.length) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return Number((total / ratings.length).toFixed(1));
}

function serializeMovie(movie, options = {}) {
  const ratings = movie.ratings || [];
  const siteRating =
    options.siteRating !== undefined ? options.siteRating : averageScore(ratings);
  const ratingsCount =
    options.ratingsCount !== undefined ? options.ratingsCount : ratings.length;

  return {
    id: movie.id,
    tmdbId: movie.tmdbId,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.releaseDate ? movie.releaseDate.toISOString().split("T")[0] : null,
    tmdbRating: movie.tmdbRating,
    popularity: movie.popularity,
    isNowPlaying: movie.isNowPlaying,
    isPopular: movie.isPopular,
    posterUrl: createPosterUrl(movie.posterPath),
    siteRating,
    ratingsCount
  };
}

function parsePagination(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 12), 1), 24);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

async function listMovies(req, res, next, options) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { where, orderBy } = options;

    const movies = await prisma.movie.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        ratings: {
          select: {
            score: true
          }
        }
      }
    });

    return res.json({
      page,
      limit,
      movies: movies.map((movie) => serializeMovie(movie))
    });
  } catch (error) {
    return next(error);
  }
}

async function getNowPlayingMovies(req, res, next) {
  return listMovies(req, res, next, {
    where: {
      isNowPlaying: true
    },
    orderBy: [{ releaseDate: "desc" }, { popularity: "desc" }]
  });
}

async function getPopularMovies(req, res, next) {
  return listMovies(req, res, next, {
    where: {
      isPopular: true
    },
    orderBy: [{ popularity: "desc" }, { tmdbRating: "desc" }]
  });
}

async function getRecommendedMovies(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 24);
    const movies = await prisma.movie.findMany({
      take: 48,
      orderBy: [{ isPopular: "desc" }, { isNowPlaying: "desc" }, { popularity: "desc" }],
      include: {
        ratings: {
          select: {
            score: true
          }
        }
      }
    });

    const rankedMovies = movies
      .map((movie) => {
        const siteRating = averageScore(movie.ratings);
        const recommendationScore =
          (siteRating || 0) * 1.4 + (movie.tmdbRating || 0) * 0.7 + (movie.popularity || 0) / 100;

        return {
          ...serializeMovie(movie, {
            siteRating,
            ratingsCount: movie.ratings.length
          }),
          recommendationScore
        };
      })
      .sort((left, right) => right.recommendationScore - left.recommendationScore)
      .slice(0, limit)
      .map(({ recommendationScore, ...movie }) => movie);

    return res.json({
      movies: rankedMovies
    });
  } catch (error) {
    return next(error);
  }
}

async function getMovieDetail(req, res, next) {
  try {
    const movieId = Number(req.params.id);

    if (Number.isNaN(movieId)) {
      return res.status(400).json({ message: "电影 ID 无效。" });
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId
      },
      include: {
        ratings: {
          select: {
            score: true,
            userId: true
          }
        },
        comments: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    if (!movie) {
      return res.status(404).json({ message: "电影不存在。" });
    }

    const siteRating = averageScore(movie.ratings);
    const currentUserRating = req.user?.id
      ? movie.ratings.find((rating) => rating.userId === req.user.id)
      : null;

    return res.json({
      movie: {
        ...serializeMovie(movie, {
          siteRating,
          ratingsCount: movie.ratings.length
        }),
        userRating: currentUserRating ? currentUserRating.score : null,
        comments: movie.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          user: comment.user
        }))
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function upsertRating(req, res, next) {
  try {
    const movieId = Number(req.params.id);
    const score = Number(req.body.score);

    if (Number.isNaN(movieId)) {
      return res.status(400).json({ message: "电影 ID 无效。" });
    }

    if (!Number.isInteger(score) || score < 1 || score > 10) {
      return res.status(400).json({ message: "评分必须是 1 到 10 的整数。" });
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId
      }
    });

    if (!movie) {
      return res.status(404).json({ message: "电影不存在。" });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_movieId: {
          userId: req.user.id,
          movieId
        }
      },
      update: {
        score
      },
      create: {
        score,
        movieId,
        userId: req.user.id
      }
    });

    const ratings = await prisma.rating.findMany({
      where: {
        movieId
      },
      select: {
        score: true
      }
    });

    return res.json({
      message: "评分已保存。",
      rating,
      siteRating: averageScore(ratings),
      ratingsCount: ratings.length
    });
  } catch (error) {
    return next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const movieId = Number(req.params.id);
    const content = (req.body.content || "").trim();

    if (Number.isNaN(movieId)) {
      return res.status(400).json({ message: "电影 ID 无效。" });
    }

    if (!content) {
      return res.status(400).json({ message: "评论内容不能为空。" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "评论内容请控制在 500 字以内。" });
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId
      }
    });

    if (!movie) {
      return res.status(404).json({ message: "电影不存在。" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        movieId,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return res.status(201).json({
      message: "评论发布成功。",
      comment
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNowPlayingMovies,
  getPopularMovies,
  getRecommendedMovies,
  getMovieDetail,
  upsertRating,
  addComment
};
