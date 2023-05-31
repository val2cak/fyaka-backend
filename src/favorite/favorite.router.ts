import express from 'express';
import type { Request, Response } from 'express';

import * as FavoriteService from './favorite.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { serviceId, userId } = req.body;
    const favorite = await FavoriteService.createFavorite(serviceId, userId);
    return res.status(201).json(favorite);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  try {
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 6;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const skip = !req.query.searchTerm
      ? pageSize
        ? (page - 1) * pageSize
        : undefined
      : undefined;
    const searchTerm = req.query.searchTerm
      ? (req.query.searchTerm as string)
      : undefined;
    const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;
    const favorites = await FavoriteService.listFavorites(
      userId,
      skip,
      pageSize,
      decodedSearchTerm
    );
    const totalCount = await FavoriteService.countFavorites(
      userId,
      decodedSearchTerm
    );
    const totalPages = Math.ceil(totalCount / pageSize);
    return res.status(200).json({ favorites, totalPages });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.get('/:userId/:serviceId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const serviceId = parseInt(req.params.serviceId, 10);

  try {
    const favorite = await FavoriteService.getFavorite(
      Number(serviceId),
      Number(userId)
    );

    return res.status(200).json(favorite);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const { serviceId, userId } = req.body;
    const favorite = await FavoriteService.removeFavorite(
      Number(serviceId),
      Number(userId)
    );
    res.json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete favorite' });
  }
});

export { router as favoriteRouter };
