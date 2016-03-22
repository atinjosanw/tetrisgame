DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id bigserial NOT NULL,
    user_email varchar UNIQUE NOT NULL,
    user_password text NOT NULL,
    PRIMARY KEY (user_id)
)
WITH (OIDS = FALSE);

INSERT INTO users (user_email, user_password) VALUES
    ('user0@email.com', '123456'),
    ('user1@email.com', '123456'),
    ('user2@email.com', '123456'),
    ('user3@email.com', '123456'),
    ('user4@email.com', '123456'),
    ('user5@email.com', '123456'),
    ('user6@email.com', '123456');

ALTER TABLE users OWNER TO tetris_testdb;
-- \connect tetris_testdb
