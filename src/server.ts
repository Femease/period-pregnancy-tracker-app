import TrackerModule from './app';
import { Logger } from './utils/logger';

export class Server {
  private trackerModule: typeof TrackerModule;
  private port: number;
  private logger: Logger;
  constructor(logger: Logger, trackerModule: typeof TrackerModule) {
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
    this.trackerModule.listen(this.port, () => {
      this.logger.info(`Server running on port ${this.port}`);
    });
  }
}

if (require.main === module) {
  const logger = Logger.getInstance();
  const server = new Server(logger, TrackerModule);
  server.start();
}