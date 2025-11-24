import express from 'express';
import routes from './presentation/routes';
import swaggerRoutes from './presentation/routes/swagger';
import { errorHandler } from './presentation/middlewares/errorHandler';
import './container';

const app = express();

app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use('/api-docs', swaggerRoutes);
app.use(errorHandler);

export default app;

