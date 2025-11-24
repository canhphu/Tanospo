import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../docs/swagger.json';

const router = Router();

// Swagger UI options
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tanospo API Documentation',
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

export default router;

