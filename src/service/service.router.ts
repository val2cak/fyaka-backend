import express from 'express';
import type { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

import * as ServiceService from './service.service';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const authorId = req.query.authorId
      ? parseInt(req.query.authorId as string, 10)
      : undefined;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const skip = pageSize ? (page - 1) * pageSize : undefined;
    const searchTerm = req.query.searchTerm
      ? (req.query.searchTerm as string)
      : undefined;
    const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;

    // New filter options
    const minPrice = req.query.minPrice
      ? parseInt(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseInt(req.query.maxPrice as string)
      : undefined;
    const minDate = req.query.minDate
      ? new Date(req.query.minDate as string)
      : undefined;
    const maxDate = req.query.maxDate
      ? new Date(req.query.maxDate as string)
      : undefined;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string, 10)
      : undefined;
    const location = req.query.location
      ? (req.query.location as string)
      : undefined;
    const people = req.query.people
      ? parseInt(req.query.people as string, 10)
      : undefined;

    const [services, totalCount] = await Promise.all([
      ServiceService.listServices(
        authorId,
        skip,
        pageSize,
        decodedSearchTerm,
        minPrice,
        maxPrice,
        minDate,
        maxDate,
        categoryId,
        location,
        people
      ),
      ServiceService.countServices(
        authorId,
        decodedSearchTerm,
        minPrice,
        maxPrice,
        minDate,
        maxDate,
        categoryId,
        location,
        people
      ),
    ]);
    const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;
    return res.status(200).json({ services, totalPages });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const service = await ServiceService.getService(id);
    if (service) {
      return res.status(200).json(service);
    }
    return res.status(404).json('Service could not be found');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

const validateService = [
  check('title').isString(),
  check('description').isString(),
  check('location').isString(),
  check('price').isInt(),
  check('date').isISO8601(),
  check('people').isInt(),
  check('authorId').isInt(),
];

router.post('/', validateService, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const service = req.body;
    const newService = await ServiceService.createService(service);
    return res.status(201).json(newService);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.put('/:id', validateService, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = parseInt(req.params.id, 10);
  try {
    const service = req.body;
    const updatedService = await ServiceService.updateService(service, id);
    return res.status(201).json(updatedService);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await ServiceService.deleteService(id);
    return res.status(204).json('Service has been successfully deleted');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export { router as serviceRouter };
