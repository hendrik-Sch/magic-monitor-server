const { watch } = require('fs');
const { readFile } = require('fs/promises');
const path = require('path');

const EventEmitter = require('events');

const Logger = require("../logger");
const Config = require('../../config/config.json');

const DecodeLogfile = require('../decoder/decodeLogfile');

const eventHub = new EventEmitter();

Config.logfileLocations.forEach((directory) => {
    try {
        watch(directory, async (evt, filename) => {
            const [date, interfaceName] = filename.split('-');
            const filePath = path.join(directory, filename);
            const csvContent = await readFile(filePath);
            const content = await DecodeLogfile(csvContent, filePath);

            eventHub.emit(`logs:change`, { date, interfaceName, content });
        });
    } catch (error) {
        Logger.error(`Watcher for logfile directory "${directory}" failed: ${error.message}`);
    }
});

module.exports = eventHub;