import app from './app';
import { Config } from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';
import socketServer from './socketserver';
// import { Jobs } from './entity/Jobs';

const startServer = async () => {
    try {
        const port = Config.PORT;
        await AppDataSource.initialize();
        logger.info('Database Connected Successfully');
        app.listen(port, () =>
            logger.info('server is listening on port ' + port),
        );
        socketServer.listen(4002, () => {
            logger.info('WebSocket server listening on port 4002');
        });
    } catch (error: unknown) {
        if (error instanceof Error) logger.error(error.message);
        process.exit(1);
    }
};

void startServer();
