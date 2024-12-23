import express, { Express } from 'express';
import { Logger } from './utils/logger'; // Assuming Logger is a singleton class or a utility class.
import TrackerModule from './app'; // Assuming this is the Express app instance.
import app from './app';
import router from './routes';
import cors from 'cors';


export class Server {
  private trackerModule: Express;
  private port: number;
  private logger: Logger;

  constructor(logger: Logger, trackerModule: Express) {
    this.trackerModule = trackerModule;
    this.port = parseInt(process.env.PORT || '3000');
    this.logger = logger;
  }

  public async start(): Promise<void> {
    try {
      this.startServer();
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private startServer(): void {
    // Starting the Express server
    this.trackerModule.listen(this.port, () => {
      this.logger.info(`Server running on port ${this.port}`);
    });
  }
}

// Export the tracker module for external use if needed (like in another file).
export const trackerModule = express();

// Example route
trackerModule.get("/", (req, res) => {
  return res.send("We are running well now...");
});


trackerModule.use(cors());
trackerModule.use(express.json());  

trackerModule.use('/api', router);


// Run the server if this file is executed directly
if (require.main === module) {
  const logger = Logger.getInstance(); // Assuming Logger has a singleton pattern.
  const server = new Server(logger, trackerModule);
  server.start();
}
