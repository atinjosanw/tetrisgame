const newuser = {
    email: 'newuser@email.com',
    password: '123456'
};

const existingUser = {
    email: 'user0@email.com',
    password: '123456'
};

const existingUser2 = {
    email: 'user1@email.com',
    password: '123456'
};

const illegalUser = {
    email: 'user1@email.com',
    password: '123333'
};

const nonexistingUser = {
    email: 'nonexistinguser@email.com',
    password: '123456'
};

module.exports = {newuser, existingUser, existingUser2, illegalUser, nonexistingUser};
