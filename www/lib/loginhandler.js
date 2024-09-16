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

const login_user = async (user) => {
    const result = await datahandler.check_email(user)
    return result
}

module.exports = {
    create_first_user,
    login_user
}