const fs = require('fs');
const fsPromises = fs.promises;

async function PrepareDirectory(path) {
    try {
        await fsPromises.mkdir(path, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

function PrepareDirectorySync(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

module.exports = { PrepareDirectory, PrepareDirectorySync };