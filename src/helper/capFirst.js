function CapFirst(str) {

    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

module.exports = CapFirst;