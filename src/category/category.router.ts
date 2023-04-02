import express from 'express';
import type { Request, Response } from 'express';

import * as CategoryService from './category.service';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.listCategories();
    return res.status(200).json({ categories });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const categories = req.body as Omit<CategoryService.Category[], 'id'>;
    const createdCategories = await CategoryService.createCategories(
      categories
    );
    return res.status(201).json({ categories: createdCategories });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const categories = req.body as CategoryService.Category[];
    const updatedCategories = await CategoryService.updateCategories(
      categories
    );
    return res.status(200).json({ categories: updatedCategories });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export { router as categoryRouter };
