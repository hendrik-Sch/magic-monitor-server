const execSync = require('child_process').exec;

const DecodeIdleInterfaces = require('../decoder/decodeIdleInterfaces');
const DecodeRunningInterfaces = require('../decoder/decodeRunningInterfaces');

async function queryIdleInterfaces() {
    return new Promise((res, rej) => {
        execSync('cat /Users/schuermann/Downloads/idle_cmd_output.txt', (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }
            if (stderr) {
                rej(stderr);
                return;
            }

            const interfaces = DecodeIdleInterfaces(stdout);

            res(interfaces);
        });
    });
}

async function queryRunningInterfaces() {
    return new Promise((res, rej) => {
        execSync('cat /Users/schuermann/Downloads/running_cmd_output.txt', (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }
            if (stderr) {
                rej(stderr);
                return;
            }

            const interfaces = DecodeRunningInterfaces(stdout);

            res(interfaces);
        });
    });
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