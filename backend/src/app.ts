import express from 'express';
import cors from 'cors';
import routes from './presentation/routes';
import swaggerRoutes from './presentation/routes/swagger';
import { errorHandler } from './presentation/middlewares/errorHandler';
import './container';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use('/api-docs', swaggerRoutes);
app.use(errorHandler);

export default app;

