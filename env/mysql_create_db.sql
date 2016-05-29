-- Don't drop the database as we'll lose all user privilege configuration
CREATE DATABASE IF NOT EXISTS `typoglyph`;
USE `typoglyph`;

-- Limitations:
--  Can't use NoSQL store as the host environment doesn't support it
--  Can't use MySQL's JSON datatype as the host environment uses v5.5
--
-- Storing JSON in MySQL TEXT fields isn't exactly the prettiest solution but it's the easiest to
-- implement. The backend can easily be modified in the future if a different storage format is
-- required.
-- 
-- In this schema, the "id" field stored on the JSON graph must always match the SQL `id` field.
--
DROP TABLE IF EXISTS `puzzles`;
CREATE TABLE `puzzles` (
	`id`   INT  NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Used to identify a given puzzle. Must always match the 'id' field on the JSON.",
	`data` TEXT NOT NULL                            COMMENT "The puzzle stored in JSON format"
);
