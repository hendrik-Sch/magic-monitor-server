const headerLine = `-----------------------------------------------------------------+------------------------------------------------------------------|`;

function DecodeRunningInterfaces(cmdOutput) {
    try {
        const headerlineEndIndex = String(cmdOutput).lastIndexOf(headerLine) + headerLine.length;

        return String(cmdOutput)
            .substring(headerlineEndIndex)
            .split('|')
            .map(item => String(item).replaceAll('\n', '').trim())
            .filter(item => String(item).length > 0)
            .reduce((acc, curr, index) => {
                const isSecondCol = index % 2 === 1;
                if (isSecondCol) {
                    acc.push(curr);
                }

                return acc;
            }, []);
    } catch (error) {
        return [];
    }
}

module.exports = DecodeRunningInterfaces;