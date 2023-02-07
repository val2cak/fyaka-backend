import { db } from '../utils/db.server';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
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
      username: true,
      email: true,
      password: true,
    },
  });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { username, email, password } = user;
  return db.user.create({
    data: { username, email, password },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, 'id'>,
  id: number
): Promise<User> => {
  const { username, email, password } = user;
  return db.user.update({
    where: {
      id,
    },
    data: {
      username,
      email,
      password,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
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
