const execSync = require('child_process').exec;

const Config = require('../../config/config.json');

const stdErrorNoti = "Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.";

function StartInterface(interface) {
    return new Promise((res, rej) => {
        const { name, host } = interface;

        const cmd = `winrs /r:${host} '${Config.program_dir}\\${name}\\${name}\\Start.lnk'`;

        execSync(cmd, { shell: 'powershell' }, (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }
            if (stderr && !String(stderr).startsWith(stdErrorNoti)) {
                rej(stderr);
                return;
            }

            res(stdout);
        });
    });
}

module.exports = StartInterface;