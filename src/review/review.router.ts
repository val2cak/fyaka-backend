import express from 'express';

import * as ReviewService from './review.service';

const router = express.Router();

router.post('/', async (req, res) => {
  const { authorId, userId, rating, text } = req.body;

  try {
    const review = await ReviewService.createReview(
      authorId,
      userId,
      rating,
      text
    );
    res.status(201).json(review);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 6;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const skip = (page - 1) * pageSize;
    const reviews = await ReviewService.getReviewsByUserId(
      userId,
      skip,
      pageSize
    );
    const totalCount = await ReviewService.countReviews(userId);
    const totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ reviews, totalPages, totalCount });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export { router as reviewRouter };
