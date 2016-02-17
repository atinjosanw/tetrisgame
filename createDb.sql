DROP DATABASE if exists tetris;
DROP ROLE if exists tetris;

CREATE USER tetris CREATEDB CREATEUSER password 'tetris';

CREATE DATABASE tetris owner tetris;

DROP TABLE if exists users;

CREATE TABLE users
(
    user_id bigserial NOT NULL,
    user_email varchar UNIQUE NOT NULL,
    user_password text NOT NULL,
    PRIMARY KEY (user_id)
)
WITH (OIDS = FALSE);

ALTER TABLE users OWNER TO tetris;
\connect tetris
