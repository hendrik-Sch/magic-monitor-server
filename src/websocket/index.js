const Logger = require("../logger");

const InterfaceController = require('../controller/interface');
const LogfileController = require('../controller/logfile');

function InitWebsocket(io) {
    InterfaceController.watcher.on(`interfaces:change`, async () => {
        io.emit('interfaces:list', InterfaceController.getInterfaces());
    });
    LogfileController.watcher.on(`logs:change`, ({ interfaceName, content }) => {
        io.to(interfaceName).emit(`logs:list`, content);
    });

    io.on('connection', (socket) => {
        Logger.debug(`client ${socket.id} connected`);

        socket.on('join', (room) => {
            Logger.debug(`client ${socket.id} joined room "${room}"`);
            socket.join(room);
        });
        socket.on('leave', (room) => {
            Logger.debug(`client ${socket.id} left room "${room}"`);
            socket.leave(room);
        });

        socket.on(`logs:list`, async ({ interfaceName, date }) => {
            const logs = await LogfileController.getLogs(interfaceName, date);
            socket.emit(`logs:list`, logs);
        });

        socket.on('interfaces:list', () => {
            socket.emit('interfaces:list', InterfaceController.getInterfaces());
        });
        socket.on('interface:stop', async (name) => {
            await InterfaceController.stopInterface(name);
        });
        socket.on('interface:start', async (name) => {
            await InterfaceController.startInterface(name);
        });

        socket.on('disconnect', () => {
            Logger.debug(`client ${socket.id} disconnected`);
            socket.removeAllListeners();
        });
    });
}

module.exports = InitWebsocket;