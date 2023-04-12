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
    const reviews = await ReviewService.getReviewsByUserId(userId);
    res.json(reviews);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export { router as reviewRouter };
