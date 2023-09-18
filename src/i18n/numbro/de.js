module.exports = {
    languageTag: "de",
    delimiters: {
        thousands: ".",
        decimal: ","
    },
    abbreviations: {
        thousand: "k",
        million: "mio",
        billion: "mrd",
        trillion: "bio"
    },
    ordinal: function () {
        return ".";
    },
    spaceSeparated: true,
    currency: {
        symbol: "€",
        position: "postfix",
        code: "EUR"
    },
    currencyFormat: {
        thousandSeparated: true,
        spaceSeparated: true,
        mantissa: 2
    },
    formats: {
        fourDigits: {
            totalLength: 4,
            spaceSeparated: true,
            average: true
        },
        fullWithTwoDecimals: {
            output: "currency",
            mantissa: 2,
            spaceSeparated: true,
            thousandSeparated: true
        },
        fullWithTwoDecimalsNoCurrency: {
            mantissa: 2,
            thousandSeparated: true
        },
        fullWithNoDecimals: {
            output: "currency",
            spaceSeparated: true,
            thousandSeparated: true,
            mantissa: 0
        }
    }
};
