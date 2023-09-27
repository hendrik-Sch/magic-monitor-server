const { readdir } = require('fs/promises');
const Config = require('../../config/config.json');

async function GetInterfaces() {
    const interfaces = {};

    const prom = Config.hosts.map(async (host) => {
        const location = `\\\\${host}\\xpiProjects`;

        const dirContent = await readdir(location);
        dirContent.forEach(content => {
            if (!content.startsWith('.') && !content.endsWith('_')) {
                interfaces[content] = { location, host };
            }
        });
    });

    await Promise.all(prom);

    return interfaces;
}

module.exports = GetInterfaces;