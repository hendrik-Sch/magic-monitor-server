const path = require('path');
const execSync = require('child_process').exec;

function StopInterface(interface) {
    return new Promise((res, rej) => {
        const { name, location } = interface;

        const cmd = `${location}${path.sep}${name}${path.sep}${name}${path.sep}Stop.lnk`;

        execSync(cmd, (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }
            if (stderr) {
                rej(stderr);
                return;
            }

            res(stdout);
        });
    });
}

module.exports = StopInterface;