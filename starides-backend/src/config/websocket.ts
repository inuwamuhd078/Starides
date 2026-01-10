import { Server } from 'http';

export const initializeWebSocket = (httpServer: Server) => {
    // Mock WebSocket server
    return {
        getConnectedUsersCount: () => 0
    };
};
