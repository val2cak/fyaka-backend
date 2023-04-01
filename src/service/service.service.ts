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
};

type ServiceWrite = {
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
  authorId: number;
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
};

export const listServices = async (
  authorId?: number,
  skip?: number,
  take?: number,
  searchTerm?: string
): Promise<ServiceRead[]> => {
  const where: Prisma.ServiceWhereInput =
    authorId || searchTerm
      ? {
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
          ].filter(Boolean),
        }
      : {};
  return db.service.findMany({ where, skip, take, select: selectService });
};

export const countServices = async (
  authorId?: number,
  searchTerm?: string
): Promise<number> => {
  const where: Prisma.ServiceWhereInput =
    authorId || searchTerm
      ? {
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
          ].filter(Boolean),
        }
      : {};
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
  const { title, description, location, price, date, people, authorId } =
    service;
  return db.service.create({
    data: { title, description, location, price, date, people, authorId },
    select: selectService,
  });
};

export const updateService = async (
  service: ServiceWrite,
  id: number
): Promise<ServiceRead> => {
  const { title, description, location, price, date, people, authorId } =
    service;
  return db.service.update({
    where: { id },
    data: { title, description, location, price, date, people, authorId },
    select: selectService,
  });
};

export const deleteService = async (id: number): Promise<void> => {
  await db.service.delete({ where: { id } });
};