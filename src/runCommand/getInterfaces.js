const { readdir } = require('fs/promises');
const Config = require('../../config/config.json');

async function GetInterfaces() {
    const interfaces = {};

    const prom = Config.programmLocations.map(async (location) => {
        const dirContent = await readdir(location);
        dirContent.forEach(content => {
            if (content !== '.DS_Store' && !content.endsWith('_')) {
                interfaces[content] = { location };
            }
        });
    });

    await Promise.all(prom);

    return interfaces;
}

module.exports = GetInterfaces;