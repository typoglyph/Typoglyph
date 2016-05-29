-- Note: Backslashes must be escaped for both JSON and SQL. A single, literal backslash in a JSON
--   string should be written as 4 consecutive backslashes. Other special JSON characters can be
--   escaped with 2 backslashes before the special character.
-- Note: Backslashes inside comments doesn't seem to be valid SQL.
USE `typoglyph`;

TRUNCATE `puzzles`;
INSERT INTO `puzzles` (`id`, `data`) VALUES
-- Hello world!
(1, '{
	"id": 1,
	"sentenceFragments": [
		{ "type": "Character", "value": "H" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "o" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "w" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "d" },
		{ "type": "Gap", "solution": { "value": "!" }}
	],
	"options": [
		{ "value": "." },
		{ "value": "," },
		{ "value": "!" },
		{ "value": "?" }
	]
}'),

-- Really exciting!!
(2, '{
	"id": 2,
	"sentenceFragments": [
		{ "type": "Character", "value": "R" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "y" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "x" },
		{ "type": "Character", "value": "c" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": "g" },
		{ "type": "Gap", "solution": { "value": "!!" }}
	],
	"options": [
		{ "value": "!!" }
	]
}'),

-- Hello, my name is Jake. How are you today?
(3, '{
	"id": 3,
	"sentenceFragments": [
		{ "type": "Character", "value": "H" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "o" },
		{ "type": "Gap", "solution": { "value": "," }},
		{ "type": "Character", "value": "m" },
		{ "type": "Character", "value": "y" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "m" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "s" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "J" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "k" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": { "value": "." }},
		{ "type": "Character", "value": "H" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "w" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "y" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "u" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "d" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "y" },
		{ "type": "Gap", "solution": { "value": "?" }}
	],
	"options": [
		{ "value": "." },
		{ "value": "," },
		{ "value": "!" },
		{ "value": "?" }
	]
}'),

-- The dog ran over the car, but the driver was able to walk away uninjured.
(4, '{
	"id": 4,
	"sentenceFragments": [
		{ "type": "Character", "value": "T" },
		{ "type": "Character", "value": "h" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "d" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "g" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "n" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "v" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "r" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "h" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "c" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "r" },
		{ "type": "Gap", "solution": { "value": "," }},
		{ "type": "Character", "value": "b" },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "t" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "h" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "d" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "v" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "r" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "w" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "s" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "b" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "e" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "o" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "w" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "k" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "w" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "y" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": "j" },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "d" },
		{ "type": "Gap", "solution": { "value": "." }}
	],
	"options": [
		{ "value": "." },
		{ "value": "," },
		{ "value": "!" },
		{ "value": "?" }
	]
}'),

-- No punctuation required
(5, '{
	"id": 5,
	"sentenceFragments": [
		{ "type": "Character", "value": "N" },
		{ "type": "Character", "value": "o" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": "c" },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": "n" },
		{ "type": "Gap", "solution": null },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "q" },
		{ "type": "Character", "value": "u" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "d" }
	],
	"options": []
}'),

-- No gaps to fill here
(6, '{
	"id": 6,
	"sentenceFragments": [
		{ "type": "Character", "value": "N" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "g" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "s" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "t" },
		{ "type": "Character", "value": "o" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "f" },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "h" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "e" }
	],
	"options": []
}'),

-- {Wrapped in braces}
(7, '{
	"id": 7,
	"sentenceFragments": [
		{ "type": "Gap", "solution": { "value": "{" }},
		{ "type": "Character", "value": "W" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "d" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "b" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "c" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "s" },
		{ "type": "Gap", "solution": { "value": "}" }}
	],
	"options": [
		{ "value": "{" },
		{ "value": "}" }
	]
}'),

-- /Wrapped in backslashes/
(8, '{
	"id": 8,
	"sentenceFragments": [
		{ "type": "Gap", "solution": { "value": "\\\\" }},
		{ "type": "Character", "value": "W" },
		{ "type": "Character", "value": "r" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "p" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "d" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "i" },
		{ "type": "Character", "value": "n" },
		{ "type": "Character", "value": " " },
		{ "type": "Character", "value": "b" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "c" },
		{ "type": "Character", "value": "k" },
		{ "type": "Character", "value": "s" },
		{ "type": "Character", "value": "l" },
		{ "type": "Character", "value": "a" },
		{ "type": "Character", "value": "s" },
		{ "type": "Character", "value": "h" },
		{ "type": "Character", "value": "e" },
		{ "type": "Character", "value": "s" },
		{ "type": "Gap", "solution": { "value": "\\\\" }}
	],
	"options": [
		{ "value": "\\\\" }
	]
}');
