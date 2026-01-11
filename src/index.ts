import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import notesRouter from './routes/notes';
import authRouter from './routes/auth';
import foldersRouter from './routes/folders';
import notebooksRouter from './routes/notebooks';
import profileRouter from './routes/profile';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Smart Notes API Documentation',
}));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Smart Notes API',
    version: '1.0.0',
    endpoints: {
      notes: '/api/notes',
      auth: '/api/auth',
      folders: '/api/folders',
      notebooks: '/api/notebooks',
      profile: '/api/profile',
      documentation: '/api-docs'
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/notebooks', notebooksRouter);
app.use('/api/profile', profileRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
