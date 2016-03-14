USE `typoglyph`;

TRUNCATE `puzzles`;
INSERT INTO `puzzles` (`options`, `sentence`) VALUES
	-- Backslashes and single quotes must be escaped with a preceding backslash if you want them to appear literally in the table
	('!',		'Hello{} world{!}'),
	('.,?',		'This{} is{} a{} test{} sentence{.} Can{} you{} work{} out{} which{} punctuation{} to{} use{?}'),
	('.,?',		'Hello{,} my{} name{} is{} Jake{.} How{} are{} you{} today{?}'),
	(',.;-:',	'The{} dog{} ran{} over{} the{} car{,} but{} the{} driver{} was{} able{} to{} walk{} away{} uninjured{.}'),
	('.,?',		'Have{} you{} tried{} turning{} it{} off{} and{} on{} again{?}'),
	('.,?',		'Are{} you{} sure{} it\'s{} plugged{} in{?}'),
	
	
	-- Specifically for testing edge cases
	('',		'What{} if{} no{} punctuation{} is{} needed{}'),
	('',		'What if there aren\'t even any gaps'),
	('{}',		'{\\{} Example wrapped in curly brackets to ensure escaping works right {\\}}'),
	('\\',		'{\\\\} Example wrapped in backslashes to ensure escaping works right {\\\\}');
