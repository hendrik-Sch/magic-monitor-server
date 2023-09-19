const { parse } = require('csv');
const moment = require('moment');
const Logger = require('../logger');

function TransformData(data) {
    return data.map(({ ID, Timestamp, TypID, TypeID, ...row }, index) => ({
        id: index,
        job: ID,
        TypeID: Number(TypeID || TypID || 0),
        Timestamp: moment(Timestamp, 'YYYY-MM-DD-HH.mm.ss.SSSSSS').format('YYYY-MM-DD HH:mm:ss.SSS'),
        ...row
    }));
}

async function DecodeLogfile(content, filePath) {
    return new Promise(async (res, rej) => {
        const options = {
            bom: true,
            delimiter: ';',
            skip_empty_lines: true,
            columns: true,
            quote: false
        };
        parse(content, options, (err, data) => {
            if (err) {
                const message = `Failed to parse log file "${filePath}". Skipping: ${err.message}`;
                Logger.error(message);
                res(null);
            } else {
                const result = TransformData(data);
                res(result);
            }
        });
    });
}

module.exports = DecodeLogfile;