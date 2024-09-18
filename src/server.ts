import app from './app';
import { Config } from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';

const startServer = async () => {
    try {
        const port = Config.PORT;
        await AppDataSource.initialize();
        app.listen(port, () =>
            logger.info('server is listening on port ' + port),
        );
    } catch (error: unknown) {
        if (error instanceof Error) logger.error(error.message);
        process.exit(1);
    }
};

void startServer();
