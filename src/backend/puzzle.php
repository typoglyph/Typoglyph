<?php
class Puzzle {
	public $sentence = "";
	public $gaps = array();
	public $options = array();
}


class Gap {
	public $position = Null;
	public $solution = Null;
	public $currentChoice = Null;
}


class Option {
	public $value = Null;
}
?>
