// This file handles displaying messages to users

const cms_settings = require('./settings')

const message_handler = (message) => {
    switch (message) {
        case 'incorrect_login':
            return ({
                found: false,
                type: 'error',
                message: cms_settings.messages.incorrect_login || "No user was found with that username and password."
            })
    }
}

module.exports = message_handler