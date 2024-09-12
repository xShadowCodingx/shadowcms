// This file handles the logic for user accounts

const datahandler = require('./datahandler');

const create_first_user = async (user) => {
    if(await datahandler.check_for_user() === false) {
        if(user.Email === user.VerifyEmail && user.Password === user.VerifyPassword) {
            datahandler.create_first_user(user.Email, user.Password)
        } else {
            return undefined
        }
    } else {
        return undefined;
    }
}

module.exports = {
    create_first_user
}