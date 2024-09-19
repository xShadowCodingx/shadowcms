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
        case 'table_created':
            return ({
                type: 'success',
                message: "Table created successfully."
            })
        case 'table_deleted':
            return ({
                type: 'success',
                message: "Table deleted successfully."
            })
        case 'key_created':
            return ({
                type: 'success',
                message: "API key created successfully."
            })
        case 'key_deleted':
            return ({
                type: 'success',
                message: "API key deleted successfully."
            })
    }
}

module.exports = message_handler