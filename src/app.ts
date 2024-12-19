import express from 'express';
import cors from 'cors';
import router from './routes';
import { Logger } from './utils/logger';

const app = express();
const logger = Logger.getInstance();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);


// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app; 