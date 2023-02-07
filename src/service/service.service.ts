import { User } from '../user/user.service';
import { db } from '../utils/db.server';

type ServiceRead = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
  author: User;
  //   authorId: number;
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

export const listServices = async (): Promise<ServiceRead[]> => {
  return db.service.findMany({
    select: {
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
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getService = async (id: number): Promise<ServiceRead | null> => {
  return db.service.findUnique({
    where: {
      id,
    },
    select: {
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
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createService = async (
  service: ServiceWrite
): Promise<ServiceRead> => {
  const { title, description, location, price, date, people, authorId } =
    service;
  const parsedDate: Date = new Date(date);

  return db.service.create({
    data: {
      title,
      description,
      location,
      price,
      date: parsedDate,
      people,
      authorId,
    },
    select: {
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
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateService = async (
  service: ServiceWrite,
  id: number
): Promise<ServiceRead> => {
  const { title, description, location, price, date, people, authorId } =
    service;
  return db.service.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      location,
      price,
      date,
      people,
      authorId,
    },
    select: {
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
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteService = async (id: number): Promise<void> => {
  await db.service.delete({
    where: {
      id,
    },
  });
};
