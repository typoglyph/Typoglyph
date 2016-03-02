USE `dot_dash`;

TRUNCATE `puzzles`;
INSERT INTO `puzzles` (`options`, `sentence`) VALUES
	(',;#!',	'Hello world{!}'),
	('.,?#',	'This is a test sentence{.} Can you work out which punctuation to use{?}'),
	('{}',		'{{} Example wrapped in curly brackets to ensure escaping works right {}}'),
	('',		'Better check the edge cases... What if no punctuation is needed?'),
	('.,?#',	'Hello{,} my name is Jake{.} How are you today{?}');
