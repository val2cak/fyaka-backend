import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { userRouter } from './user/user.router';
import { serviceRouter } from './service/service.router';
import { favoriteRouter } from './favorite/favorite.router';
import { categoryRouter } from './category/category.router';
import { reviewRouter } from './review/review.router';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://fyaka.vercel.app',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/services', serviceRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/reviews', reviewRouter);

app.listen(() => {
  console.log('Server running on Vercel!');
});
