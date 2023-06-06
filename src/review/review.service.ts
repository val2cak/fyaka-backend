import { Prisma, PrismaClient } from '@prisma/client';
import { db } from '../utils/db.server';

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

    // Calculate average user rating
    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
    });
    const totalRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings / reviews.length;

    // Update user's rating
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        rating: averageRating,
      },
    });

    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

export const getReviewsByUserId = async (
  userId: number,
  skip?: number,
  take?: number
) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
      skip,
      take,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        userId: true,
        rating: true,
        text: true,
      },
    });
    return reviews;
  } catch (error) {
    console.error('Error getting reviews by userId:', error);
    throw new Error('Failed to get reviews');
  }
};

export const countReviews = async (userId: number): Promise<number> => {
  const where: Prisma.ReviewWhereInput | undefined = userId
    ? { userId: { equals: userId } }
    : {};

  const count = await db.review.count({ where });
  return count;
};

prisma.$disconnect();
