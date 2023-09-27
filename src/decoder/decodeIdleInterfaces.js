const headerLine = `-----------------------------------------------------------------|`;

function DecodeIdleInterfaces(cmdOutput) {
    try {
        const headerlineEndIndex = String(cmdOutput).lastIndexOf(headerLine) + headerLine.length;

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