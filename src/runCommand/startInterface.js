const execSync = require('child_process').exec;

function StartInterface(interface) {
    return new Promise((res, rej) => {
        const { name, location } = interface;

        const cmd = `${location}\\${name}\\${name}\\Start.lnk`;

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

module.exports = StartInterface;