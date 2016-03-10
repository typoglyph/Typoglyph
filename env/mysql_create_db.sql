CREATE DATABASE IF NOT EXISTS `typoglyph`;
USE `typoglyph`;

DROP TABLE IF EXISTS `puzzles`;
CREATE TABLE `puzzles` (
--	Field name		Type		Allow null?	Default value				Is a PK?		Comment
	`_id`			BIGINT		NOT NULL	AUTO_INCREMENT				PRIMARY KEY
COMMENT 'Used to identify a given puzzle',
	`_timestamp`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP
COMMENT 'When this puzzle was added',
	`sentence`		TEXT		NOT NULL
COMMENT 'Use a character wrapped in curly braces "{.}" anywhere in the sentence to represent a gap
for the user to fill in. The character used will represent the correct answer for that gap. Just an
open and close brace "{}" means the correct answer will be to leave the gap blank. Open/close
braces and backslashes must be escaped with a preceding backslash if you want them to be
interpreted literally. Note that some characters (esp. backslashes and quotes) may need to be
further escaped when updating this field via SQL.',
	`options`		TEXT		NOT NULL
COMMENT 'The choices the user will be able to pick from, one after the other (only single character
options are supported). Note: Backslashes and curly braces don\'t need to be escaped here (other
than the normal escaping needed for SQL statements).' );
