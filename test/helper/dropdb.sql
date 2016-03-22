DROP DATABASE IF EXISTS tetris_testdb ;

DO
$body$
BEGIN
    IF NOT EXISTS(
        SELECT *
        FROM pg_catalog.pg_user
        WHERE usename = 'tetris_testdb') THEN

        CREATE ROLE tetris_testdb LOGIN PASSWORD 'tetris_testdb';
    END IF;
END
$body$;

CREATE DATABASE tetris_testdb owner tetris_testdb;
