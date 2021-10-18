class PageTimeoutError extends Error {
    constructor(...args) {
        super(...args);
    }
}

module.exports = {PageTimeoutError};
