// This file handles any settings conditionals

const cms_settings = require('./settings');

module.exports = {
    port: cms_settings.port || 3000,
    mode: () => {
        if(cms_settings.mode === 'development' || cms_settings.mode === 'production') {
            return cms_settings.mode;
        } else {
            return 'development';
        }
    },
};