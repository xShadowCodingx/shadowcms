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
                message: "API key created."
            })
        case 'key_deleted':
            return ({
                type: 'success',
                message: "API key deleted successfully."
            })
        case 'user_already_exists':
            return ({
                type: 'error',
                message: "This user already exists."
            })
        case 'user_created':
            return ({
                type: 'success',
                message: "User created successfully."
            })
        case 'user_deleted':
            return ({
                type: 'success',
                message: "User deleted successfully."
            })
        case 'user_deactivated':
            return ({
                type: 'success',
                message: "User deactivated successfully."
            })
        case 'key_categories_assigned':
            return ({
                type: 'success',
                message: "Categories assigned successfully."
            })
        case 'project_created':
            return ({
                type: 'success',
                message: "Project created successfully."
            })
        case 'project_deleted':
            return ({
                type: 'success',
                message: "Project deleted successfully."
            })
            case 'project_edited':
                return ({
                    type: 'success',
                    message: "Project edited successfully."
                })
    }
}

module.exports = message_handler