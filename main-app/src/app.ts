import express from 'express';
import mongoose from 'mongoose';
import { TrackerModule } from './modules/tracker';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

class MainApp {
  private app: express.Application;
  private trackerModule: TrackerModule;

  constructor() {
    this.app = express();
    this.trackerModule = new TrackerModule();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Mount tracker module routes
    this.app.use('/api/v1', this.trackerModule.getApp());

    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Error handling middleware
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('App Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname',);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

connectDB();

export default MainApp; 