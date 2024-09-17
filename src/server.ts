import { log } from 'console';
import app from './app';
// import { HttpError } from "http-errors".

const startServer = () => {
    try {
        app.listen(8000, () => log('server is listening on port 8000'));
    } catch (error: unknown) {
        if (error instanceof Error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            log.error(`Error starting server: ${error.message}`);
        }
        process.exit(1);
    }
};

startServer();
