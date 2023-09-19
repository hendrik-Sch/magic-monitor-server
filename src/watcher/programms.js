const { watch } = require('fs');

const EventEmitter = require('events');

const Logger = require("../logger");
const Config = require('../../config/config.json');

const eventHub = new EventEmitter();

// Config.programmLocations.forEach((directory) => {
//     try {
//         watch(directory, async () => {
//             eventHub.emit(`programms:change`);
//         });
//     } catch (error) {
//         Logger.error(`Watcher for programm directory "${directory}" failed: ${error.message}`);
//     }
// });

module.exports = eventHub;