import { Prisma } from '@prisma/client';
import { selectService } from '../service/service.service';
import { db } from '../utils/db.server';

type Favorite = {
  id: number;
  serviceId: number;
  userId: number;
};

const selectFavorite = {
  id: true,
  userId: true,
  serviceId: true,
  service: {
    select: selectService,
  },
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

export const listFavorites = async (
  userId: number,
  skip?: number,
  take?: number,
  searchTerm?: string
): Promise<Favorite[]> => {
  const where: Prisma.FavoriteWhereInput | undefined = {
    userId: { equals: userId },
    service: {
      OR: [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { location: { contains: searchTerm } },
        { author: { username: { contains: searchTerm } } },
      ].filter(Boolean),
    },
  };
  const favorites = await db.favorite.findMany({
    where,
    skip,
    take,
    include: {
      service: {
        select: selectService,
      },
    },
  });
  return favorites;
};

export const countFavorites = async (
  userId: number,
  searchTerm?: string
): Promise<number> => {
  const where: Prisma.FavoriteWhereInput | undefined =
    userId || searchTerm
      ? {
          AND: [
            userId ? { userId: { equals: userId } } : {},
            searchTerm
              ? {
                  OR: [
                    { service: { title: { contains: searchTerm } } },
                    { service: { description: { contains: searchTerm } } },
                    { service: { location: { contains: searchTerm } } },
                    {
                      service: {
                        author: { username: { contains: searchTerm } },
                      },
                    },
                  ],
                }
              : {},
          ].filter(Boolean),
        }
      : {};
  const count = await db.favorite.count({ where });
  return count;
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
