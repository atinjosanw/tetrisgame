'use strict';
const findUser = function (query, db) {
    return Promise
    .resolve(db.one("SELECT user_email, user_password FROM users WHERE user_email=${email}", query))
    .then(user => {
        return user;
    })
    .catch(error => {
        throw new Error(error);
    });
};

const insertUser = function (query, db) {
    return Promise
    .resolve(db.none("INSERT INTO users(user_email, user_password)" +
                    "VALUES (${email}, ${password})", query))
    .then(() => {
        return {user_email: query.email, user_password: query.password};
    })
    .catch(error => {
        throw new Error(error);
    });
};

const deleteUser = function (query, db) {
    return Promise
    .resolve(db.result("DELETE FROM users where user_email=${email} " +
                        "AND user_password=${password}", query))
    .then(function (result) {
        return result.rowCount;
    })
    .catch(function (error) {
        throw new Error(error);
    });
};

module.exports.findUser = findUser;
module.exports.insertUser = insertUser;
module.exports.deleteUser = deleteUser;

