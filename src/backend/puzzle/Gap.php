<?php
require_once("puzzle/SentenceFragment.php");


class Gap extends SentenceFragment {
	public $solution;
	
	public function __construct($solution = Null) {
		$this->solution = $solution;
	}
}
?>
