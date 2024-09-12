// This file handles the logs that are shown

const loghandler = (log, message) => {
    switch(log) {
        case 'error':
            console.log(`\x1b[41m${message}\x1b[0m`);
            break;
        case 'info':
            console.log(`\x1b[36m${message}\x1b[0m`);
            break;
        case 'warning':
            console.log(`\x1b[33m${message}\x1b[0m`);
            break;
        case 'general':
            console.log(`\x1b[34m${message}\x1b[0m`);
            break;
        case 'success':
            console.log(`\x1b[32m${message}\x1b[0m`);
            break;
    }
};

module.exports = loghandler;