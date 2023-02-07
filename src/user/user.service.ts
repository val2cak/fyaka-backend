import { db } from '../utils/db.server';

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const getUser = async (id: number): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { firstName, lastName } = user;
  return db.user.create({
    data: { firstName, lastName },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, 'id'>,
  id: number
): Promise<User> => {
  const { firstName, lastName } = user;
  return db.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};
