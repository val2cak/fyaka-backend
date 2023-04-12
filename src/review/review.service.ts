import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createReview = async (
  authorId: number,
  userId: number,
  rating: number,
  text: string
) => {
  try {
    const review = await prisma.review.create({
      data: {
        authorId,
        userId,
        rating,
        text,
      },
    });
    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

export const getReviewsByUserId = async (userId: number) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
    });
    return reviews;
  } catch (error) {
    console.error('Error getting reviews by userId:', error);
    throw new Error('Failed to get reviews');
  }
};
