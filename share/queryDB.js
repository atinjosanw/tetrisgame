'use strict';
const findUser = function (query, db) {
    return db.one("SELECT user_email, user_password FROM users WHERE user_email=${email}", query);
};

const insertUser = function (query, db) {
    return db.one("INSERT INTO users(user_email, user_password)" +
                    "VALUES (${email}, ${password}) RETURNING *", query);
};

const deleteUser = function (query, db) {
    return db.result("DELETE FROM users where user_email=${email} " +
                        "AND user_password=${password}", query)
    .then(result => result.rowCount);
};

module.exports.findUser = findUser;
module.exports.insertUser = insertUser;
module.exports.deleteUser = deleteUser;

