<?php
require_once("puzzle/SentenceFragment.php");


class Character extends SentenceFragment {
	public $value;
	
	public function __construct($value = Null) {
		$this->value = $value;
	}
}
?>
