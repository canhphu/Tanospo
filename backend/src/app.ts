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

// Increase JSON body size limit to handle base64 images and larger payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use('/api-docs', swaggerRoutes);
app.use(errorHandler);

export default app;

 