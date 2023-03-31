import { db } from '../utils/db.server';

type Favorite = {
  id: number;
  serviceId: number;
  userId: number;
};

const selectFavorite = {
  id: true,
  serviceId: true,
  userId: true,
};

export const createFavorite = async (
  serviceId: number,
  userId: number
): Promise<Favorite> => {
  const existingFavorite = await db.favorite.findFirst({
    where: {
      serviceId,
      userId,
    },
  });

  if (existingFavorite) {
    return existingFavorite;
  }

  return db.favorite.create({
    data: {
      service: {
        connect: { id: serviceId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const listFavorites = async (userId: number): Promise<Favorite[]> => {
  return db.favorite.findMany({
    where: { userId },
    select: selectFavorite,
  });
};

export const getFavorite = async (
  serviceId: number,
  userId: number
): Promise<Favorite | null> => {
  return db.favorite.findFirst({
    where: {
      serviceId: serviceId,
      userId: userId,
    },
    select: selectFavorite,
  });
};

export const removeFavorite = async (
  serviceId: number,
  userId: number
): Promise<void> => {
  await db.favorite.deleteMany({
    where: {
      serviceId: serviceId,
      userId: userId,
    },
  });
};
