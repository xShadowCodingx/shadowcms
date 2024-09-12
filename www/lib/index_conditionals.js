// This file handles the conditional statements that are used in the index.js file.

const loghandler = require('./loghandler');
const cms_settings = require('./settings');

// This function is called when the server starts
const app_listener = (error, port) => {
    if(!error) {
        if(cms_settings.mode === 'development') {
            loghandler('success', `Development server is running...`);
            loghandler('info', `Current port is: ${port}`)
        } else if (cms_settings.mode === 'production') {
            loghandler('success', `Production server is running...`);
            loghandler('info', `Current port is: ${port}`)
        } else {
            loghandler('warning', `Production or development mode not specified, defaulting to development mode on port: ${port}`);
        }
    } else {
        loghandler('error', `Server can't start, error: ${error}`);
    }
};

module.exports = {
    app_listener
};