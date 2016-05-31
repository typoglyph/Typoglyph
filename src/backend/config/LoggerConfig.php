<?php
class LoggerConfig {
	private $filePath;
	private $level;
	
	function __construct($filePath, $level) {
		$this->filePath = $filePath;
		$this->level = $level;
	}
	
	function getFilePath() {
		return $this->filePath;
	}
	
	function getLevel() {
		return $this->level;
	}
}
?>
