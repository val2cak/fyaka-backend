import { db } from '../utils/db.server';

export type Category = {
  id: number;
  name: string;
};

export const selectCategory = {
  id: true,
  name: true,
};

export const listCategories = async (): Promise<Category[]> => {
  return db.category.findMany({ select: selectCategory });
};

export const getCategory = async (id: number): Promise<Category | null> => {
  return db.category.findUnique({
    where: { id },
    select: selectCategory,
  });
};

export const createCategories = async (
  categories: Omit<Category[], 'id'>
): Promise<Category[]> => {
  const createData = categories.map((category) => ({
    name: category.name,
  }));
  await db.category.createMany({
    data: createData,
  });
  return db.category.findMany({
    select: selectCategory,
  });
};

export const updateCategories = async (
  categories: Category[]
): Promise<Category[]> => {
  const updateData = categories.map((category) => ({
    where: { id: category.id },
    data: { name: category.name },
  }));
  const updatedCategories = await Promise.all(
    updateData.map((data) =>
      db.category.update({
        where: data.where,
        data: data.data,
        select: selectCategory,
      })
    )
  );
  return updatedCategories;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await db.category.delete({ where: { id } });
};
