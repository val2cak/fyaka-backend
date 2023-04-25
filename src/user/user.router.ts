import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as UserService from './user.service';
import { JWT_SECRET } from '../../config/config';

export const userRouter = express.Router();

const registerValidators = [
  body('username').isString(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
];

// POST: Register a User
// Params: username, email, password
userRouter.post(
  '/register',
  registerValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await UserService.getUserByEmail(req.body.email);
    if (user) {
      return res.status(401).json({ error: `User already registered!` });
    }

    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.createUser({
        username,
        email,
        password: hashedPassword,
      });

      return res
        .status(201)
        .json(`User ${newUser.username} registered successfully!`);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

const loginValidators = [
  body('username').isString(),
  body('password').isLength({ min: 8 }),
];

// POST: Login a User
// Params: username, password
userRouter.post(
  '/login',
  loginValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, password } = req.body;
      const user = await UserService.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: `User doesn't exist!` });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password!' });
      }
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1h',
      });
      const userData = { id: user.id, username: user.username };
      return res.status(200).json({ token, user: userData });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: List of all Users
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm
      ? (req.query.searchTerm as string)
      : undefined;
    const decodedSearchTerm = searchTerm ? decodeURI(searchTerm) : undefined;
    const users = await UserService.listUsers(decodedSearchTerm);
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: A single User by ID
userRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const user = await UserService.getUserWithoutPassword(id);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json('User could not be found');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// PUT: Updating a User
userRouter.put('/:id', async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id: number = parseInt(req.params.id, 10);
  try {
    const user = req.body;
    const updatedUser = await UserService.updateUser(user, id);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// DELETE: Delete a User based on the id
userRouter.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await UserService.deleteUser(id);
    return res.status(204).json('User has been successfully deleted');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

const passwordValidators = [
  body('currentPassword').isLength({ min: 8 }),
  body('newPassword').isLength({ min: 8 }),
];

// PUT: Change Password of a User
// Params: currentPassword, newPassword
userRouter.put(
  '/change-password',
  passwordValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, currentPassword, newPassword } = req.body;

    const user = await UserService.getUserWithPassword(id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user?.password ? user?.password : ''
    );
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password!' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await UserService.updateUserPassword(hashedNewPassword, id);

    return res.status(200).json('Password updated successfully');
  }
);
