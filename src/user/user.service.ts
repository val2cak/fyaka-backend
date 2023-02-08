import { db } from '../utils/db.server';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

const selectUserFields = {
  id: true,
  username: true,
  email: true,
  password: true,
};

export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({ select: selectUserFields });
};

export const getUser = async (id: number): Promise<User | null> => {
  return db.user.findUnique({ where: { id }, select: selectUserFields });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return db.user.create({ data: user, select: selectUserFields });
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return db.user.findFirst({ where: { username }, select: selectUserFields });
};

export const updateUser = async (
  user: Omit<User, 'id'>,
  id: number
): Promise<User> => {
  return db.user.update({
    where: { id },
    data: user,
    select: selectUserFields,
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({ where: { id } });
};
