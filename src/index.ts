import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { userRouter } from './user/user.router';
import { serviceRouter } from './service/service.router';
import { favoriteRouter } from './favorite/favorite.router';
import { categoryRouter } from './category/category.router';
import { reviewRouter } from './review/review.router';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api/geonames',
  createProxyMiddleware({
    target: 'http://api.geonames.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/geonames': '/',
    },
  })
);

app.use('/api/users', userRouter);
app.use('/api/services', serviceRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/reviews', reviewRouter);

const port = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
