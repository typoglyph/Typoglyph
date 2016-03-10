USE `typoglyph`;

TRUNCATE `puzzles`;
INSERT INTO `puzzles` (`options`, `sentence`) VALUES
	-- Backslashes and single quotes must be escaped with a preceding backslash if you want them to appear literally in the table
	(',;#!',	'Hello world{!}'),
	('.,?#',	'This is a test sentence{.} Can you work out which punctuation to use{?}'),
	('{}',		'{\\{} Example wrapped in curly brackets to ensure escaping works right {\\}}'),
	('\\',		'{\\\\} Example wrapped in backslashes to ensure escaping works right {\\\\}'),
	('',		'What{} if{} no{} punctuation{} is{} needed?'),
	('',		'What if there aren\'t even any gaps?'),
	('.,?#',	'Hello{,} my name is Jake{.} How are you today{?}');
