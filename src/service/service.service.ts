import { Prisma } from '@prisma/client';
import { User } from '../user/user.service';
import { db } from '../utils/db.server';

export type ServiceRead = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
  author: Omit<User, 'password'>;
  categoryId: number;
};

type ServiceWrite = {
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
  authorId: number;
  categoryId: number;
};

export const selectService = {
  id: true,
  title: true,
  description: true,
  location: true,
  price: true,
  date: true,
  people: true,
  author: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  categoryId: true,
};

export const listServices = async (
  authorId?: number,
  skip?: number,
  take?: number,
  searchTerm?: string,
  minPrice?: number,
  maxPrice?: number,
  minDate?: Date,
  maxDate?: Date,
  categoryIds?: number[],
  location?: string,
  people?: number
): Promise<ServiceRead[]> => {
  const where: Prisma.ServiceWhereInput = {
    AND: [
      authorId ? { author: { id: { equals: authorId } } } : {},
      searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm } },
              { description: { contains: searchTerm } },
              { location: { contains: searchTerm } },
              { author: { username: { contains: searchTerm } } },
            ],
          }
        : {},
      minPrice ? { price: { gte: minPrice } } : {},
      maxPrice ? { price: { lte: maxPrice } } : {},
      minDate ? { date: { gte: new Date(minDate) } } : {},
      maxDate ? { date: { lte: new Date(maxDate) } } : {},
      categoryIds ? { categoryId: { in: categoryIds } } : {},
      location ? { location: { contains: location } } : {},
      people ? { people: { gte: people } } : {},
    ].filter(Boolean),
  };

  return db.service.findMany({ where, skip, take, select: selectService });
};

export const countServices = async (
  authorId?: number,
  searchTerm?: string,
  minPrice?: number,
  maxPrice?: number,
  minDate?: Date,
  maxDate?: Date,
  categoryIds?: number[],
  location?: string,
  people?: number
): Promise<number> => {
  const where: Prisma.ServiceWhereInput = {
    AND: [
      authorId ? { author: { id: { equals: authorId } } } : {},
      searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm } },
              { description: { contains: searchTerm } },
              { location: { contains: searchTerm } },
              { author: { username: { contains: searchTerm } } },
            ],
          }
        : {},
      minPrice ? { price: { gte: minPrice } } : {},
      maxPrice ? { price: { lte: maxPrice } } : {},
      minDate ? { date: { gte: new Date(minDate) } } : {},
      maxDate ? { date: { lte: new Date(maxDate) } } : {},
      categoryIds ? { categoryId: { in: categoryIds } } : {},
      location ? { location: { contains: location } } : {},
      people ? { people: { gte: people } } : {},
    ].filter(Boolean),
  };

  return db.service.count({ where });
};

export const getService = async (id: number): Promise<ServiceRead | null> => {
  return db.service.findUnique({
    where: { id },
    select: selectService,
  });
};

export const createService = async (
  service: ServiceWrite
): Promise<ServiceRead> => {
  const {
    title,
    description,
    location,
    price,
    date,
    people,
    authorId,
    categoryId,
  } = service;
  return db.service.create({
    data: {
      title,
      description,
      location,
      price,
      date,
      people,
      authorId,
      categoryId,
    },
    select: selectService,
  });
};

export const updateService = async (
  service: ServiceWrite,
  id: number
): Promise<ServiceRead> => {
  const {
    title,
    description,
    location,
    price,
    date,
    people,
    authorId,
    categoryId,
  } = service;
  return db.service.update({
    where: { id },
    data: {
      title,
      description,
      location,
      price,
      date,
      people,
      authorId,
      categoryId,
    },
    select: selectService,
  });
};

export const deleteService = async (id: number): Promise<void> => {
  await db.service.delete({ where: { id } });
};
