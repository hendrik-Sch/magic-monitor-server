const { readFile, readdir } = require('fs/promises');
const path = require('path');

const Config = require('../../config/config.json');
const Watcher = require('../watcher/logfiles');
const DecodeLogfile = require('../decoder/decodeLogfile');
const Logger = require('../logger');

// const LogfileStore = {};

// function FillLogfileStore(interfaceName, date, content) {
//     if (!LogfileStore[interfaceName]) {
//         LogfileStore[interfaceName] = {};
//     }

//     LogfileStore[interfaceName][date] = content;
// }

// Config.logfileLocations.forEach(async directory => {
//     const files = await readdir(directory);

//     const prom = files.map(async file => {
//         const filePath = path.join(directory, file);
//         const csvContent = await readFile(filePath);
//         const content = await DecodeLogfile(csvContent, filePath);

//         if (content) {
//             const [date, interfaceName] = file.split('-');
//             FillLogfileStore(interfaceName, date, content);
//         }
//     });

//     await Promise.all(prom);

//     Logger.debug(`Successfully loaded logfiles`)
// });

async function LoadLog(interfaceName, date) {
    try {
        const fileName = `${date}-${interfaceName}-Log.txt`;

        for (let i = 0; i < Config.logfileLocations.length; i++) {
            const directory = Config.logfileLocations[i];
            try {
                const filePath = path.join(directory, fileName);
                const csvContent = await readFile(filePath);
                const content = await DecodeLogfile(csvContent, filePath);

                return content;
            } catch (error) {
            }
        }
    } catch (error) {
        Logger.error(`Failed to load log ${error.message}`);
    }

    return null;
}

// Watcher.on('logs:change', ({ date, interfaceName, content }) => {
//     FillLogfileStore(interfaceName, date, content);
// });

class LogfileController {
    static watcher = Watcher;

    static async getLogs(interfaceName, date) {
        const logContent = await LoadLog(interfaceName, date);

        if (!logContent) {

            return [];
        }

        return logContent;
    }
}

module.exports = LogfileController;