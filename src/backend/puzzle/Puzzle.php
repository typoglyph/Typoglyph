<?php
/**
 * Very basic translations of Puzzle.js, SentenceFragment.js, Character.js, Gap.js and Option.js,
 * to be used by the server-side.
 */
class Puzzle {
	public $id;
	public $sentenceFragments;
	public $options;
	
	public function __construct($id = Null, $sentenceFragments = array(), $options = array()) {
		$this->id = $id;
		$this->sentenceFragments = $sentenceFragments;
		$this->options = $options;
	}
}
?>
