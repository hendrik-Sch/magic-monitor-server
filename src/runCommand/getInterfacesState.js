const execSync = require('child_process').exec;

const Config = require('../../config/config.json');

const DecodeIdleInterfaces = require('../decoder/decodeIdleInterfaces');
const DecodeRunningInterfaces = require('../decoder/decodeRunningInterfaces');

const idleCmd = `"C:\\Magic xpi 4.13\\Runtime\\Gigaspaces-xpi\\bin\\magicxpi-setenv.bat" && "C:\\Magic xpi 4.13\\Runtime\\Gigaspaces\\bin\\gs" --cli-version=1 space sql -url jini://*/*/MAGIC_SPACE -multispace -query "select projectKey from com.magicsoftware.xpi.server.data.project.ProjectData"`;
const runningCmd = `"C:\\Magic xpi 4.13\\Runtime\\Gigaspaces-xpi\\bin\\magicxpi-setenv.bat" && "C:\\Magic xpi 4.13\\Runtime\\Gigaspaces\\bin\\gs" --cli-version=1 space sql -url jini://*/*/MAGIC_SPACE -multispace -query "select messageStatus,projectKey from com.magicsoftware.xpi.server.messages.FlowRequest"`;

async function queryIdleInterfaces() {
    const proms = Config.hosts.map(async host => {
        return new Promise((res, rej) => {
            const cmd = `winrs /r:${host} '${idleCmd}'`;
            execSync(cmd, { shell: 'powershell' }, (error, stdout, stderr) => {
                if (error) {
                    rej(error);
                    return;
                }
                if (!stdout && stderr) {
                    rej(stderr);
                    return;
                }

                const interfaces = DecodeIdleInterfaces(stdout);

                res(interfaces);
            });
        });
    });

    const result = await Promise.all(proms);

    return result.flat();
}

async function queryRunningInterfaces() {
    const proms = Config.hosts.map(async host => {
        return new Promise((res, rej) => {
            const cmd = `winrs /r:${host} '${runningCmd}'`;
            execSync(cmd, { shell: 'powershell' }, (error, stdout, stderr) => {
                if (error) {
                    rej(error);
                    return;
                }
                if (!stdout && stderr) {
                    rej(stderr);
                    return;
                }

                const interfaces = DecodeRunningInterfaces(stdout);

                res(interfaces);
            });
        });
    });

    const result = await Promise.all(proms);

    return result.flat();
}

async function GetInterfacesState() {
    const idleInterfacesProm = queryIdleInterfaces();
    const runningInterfacesProm = queryRunningInterfaces();

    const [idleInterfaces, runningInterfaces] = await Promise.all([idleInterfacesProm, runningInterfacesProm])

    const interfaces = {};
    idleInterfaces.forEach(name => {
        interfaces[name] = {
            idle: true,
            running: runningInterfaces.includes(name)
        };
    });

    return interfaces;
}

module.exports = GetInterfacesState;