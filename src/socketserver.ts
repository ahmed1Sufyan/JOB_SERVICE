/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import http from 'http';
import { Server, Socket } from 'socket.io';
import logger from './config/logger';

// Create the HTTP server
const socketServer: http.Server = http.createServer();

// Setup the Socket.IO server
const io: Server = new Server(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Handle socket connections
io.on('connection', (socket: Socket) => {
    // Handle events here, for example:
    socket.on('updateCandidateStatus', (data) => {
        logger.info(data);
        io.emit('updateApplicationStatus', data);
    });

    socket.on('disconnect', () => {});
});

// Start the WebSocket server
export default socketServer;
