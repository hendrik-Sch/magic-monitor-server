const https = require('https');
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const { Server } = require("socket.io");

const Logger = require('./logger');
const InitWebsocket = require('./websocket');
// const middlewares = require('./middlewares/');
// const routes = require('./routes/');
require('./scheduler/');

const Config = require('../config/config.json');
// require('./models/associations');

moment.locale(Config.i10n.moment);

const app = express();

// app.use(middlewares);
// app.use(routes);

const options = {
    key: fs.readFileSync(Config.https.keyPath, 'utf-8'),
    cert: fs.readFileSync(Config.https.certPath, 'utf-8')
};

if (Config.https.ca) {
    options.ca = fs.readFileSync(Config.https.caPath, 'utf-8');
}

const server = https.createServer(options, app);
const io = new Server(server, {
    cors: Config.cors
});

InitWebsocket(io);

server.listen(Config.port, () => {
    Logger.info(`managerServer is listening on port ${Config.port} since ${moment().format("L LTS UTCZ")}`);
});