const headerLine = `
-----------------------------------------------------------------|
projectKey                                                       |
-----------------------------------------------------------------|
`;

function DecodeIdleInterfaces(cmdOutput) {
    try {
        const headerlineEndIndex = String(cmdOutput).indexOf(headerLine) + headerLine.length;

        return String(cmdOutput)
            .substring(headerlineEndIndex)
            .split('|')
            .map(item => String(item).replaceAll('\n', '').trim())
            .filter(item => String(item).length > 0);
    } catch (error) {
        return [];
    }
}

module.exports = DecodeIdleInterfaces;