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
    const favorites = await FavoriteService.listFavorites(userId);
    return res.status(200).json(favorites);
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
