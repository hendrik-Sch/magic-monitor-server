const path = require('path');

function GetSafePath(safePath, ...userInput) {
    const newPath = path.normalize(path.join(safePath, ...userInput));

    if (!String(newPath).startsWith(safePath)) {
        throw new Error(`Illegal path "${newPath}".`);
    }

    return newPath;
}

module.exports = GetSafePath;