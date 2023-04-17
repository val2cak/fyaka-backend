import { db } from '../utils/db.server';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  rating?: number | null;
  biography?: string | null;
  phoneNumber?: number | null;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  imageUrl?: string | null;
};

const readUserFields = {
  id: true,
  username: true,
  email: true,
  rating: true,
  biography: true,
  phoneNumber: true,
  fullName: true,
  gender: true,
  dateOfBirth: true,
  imageUrl: true,
};

const writeUserFields = {
  id: true,
  username: true,
  email: true,
  password: true,
  rating: true,
  biography: true,
  phoneNumber: true,
  fullName: true,
  gender: true,
  dateOfBirth: true,
  imageUrl: true,
};

export const listUsers = async (
  searchTerm?: string
): Promise<Omit<User, 'password'>[]> => {
  let users;
  if (searchTerm) {
    users = await db.user.findMany({
      where: {
        username: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: readUserFields,
    });
  } else {
    users = await db.user.findMany({ select: readUserFields });
  }
  return users;
};

export const getUser = async (
  id: number
): Promise<Omit<User, 'password'> | null> => {
  return db.user.findUnique({ where: { id }, select: readUserFields });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return db.user.create({ data: user, select: writeUserFields });
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return db.user.findFirst({ where: { username }, select: writeUserFields });
};

export const getUserByEmail = async (
  email: string
): Promise<Omit<User, 'password'> | null> => {
  return db.user.findFirst({ where: { email }, select: writeUserFields });
};

export const updateUser = async (
  user: Omit<User, 'id'>,
  id: number
): Promise<User> => {
  const { ...rest } = user;

  return db.user.update({
    where: { id },
    data: {
      ...rest,
    },
    select: writeUserFields,
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({ where: { id } });
};
