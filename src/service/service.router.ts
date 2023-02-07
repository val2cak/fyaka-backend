import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as ServiceService from './service.service';

export const serviceRouter = express.Router();

// GET: List of all Services
serviceRouter.get('/', async (request: Request, response: Response) => {
  try {
    const services = await ServiceService.listServices();
    return response.status(200).json(services);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// GET: A single Service by ID
serviceRouter.get('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const service = await ServiceService.getService(id);
    if (service) {
      return response.status(200).json(service);
    }
    return response.status(404).json('Service could not be found');
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// POST: Create a Service
// Params: title, description, location, price, date, people, authorId
serviceRouter.post(
  '/',
  body('title').isString(),
  body('description').isString(),
  body('location').isString(),
  body('price').isInt(),
  body('date').isDate().toDate(),
  body('people').isInt(),
  body('authorId').isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const service = request.body;
      const newService = await ServiceService.createService(service);
      return response.status(201).json(newService);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// PUT: Updating a User
// Params: title, description, location, price, date, people, authorId
serviceRouter.put(
  '/:id',
  body('title').isString(),
  body('description').isString(),
  body('location').isString(),
  body('price').isInt(),
  body('date').isDate().toDate(),
  body('people').isInt(),
  body('authorId').isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
      const service = request.body;
      const updatedService = await ServiceService.updateService(service, id);
      return response.status(201).json(updatedService);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// DELETE: Delete a Service based on the id
serviceRouter.delete('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await ServiceService.deleteService(id);
    return response.status(204).json('Service has been successfully deleted');
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
