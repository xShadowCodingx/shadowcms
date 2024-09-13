// This file handles hashing and checking passwords

const bcrypt = require('bcryptjs');

const hash_password = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const pw = bcrypt.hashSync(password, salt)
    return pw
}

module.exports = {
    hash_password
}