<?php
require_once("logging/BaseLogger.php");
require_once("logging/LogLevel.php");


/**
 * Logger implementation which appends messages to the end of a specified file
 */
class FileLogger extends BaseLogger {
	private $filePath;
	
	/**
	 * @param string $name
	 * @param string $filePath
	 */
	function __construct($name, $filePath) {
		parent::__construct($name);
		$this->filePath = $filePath;
	}
	
	function log(LogLevel $level, $msg) {
		$msg = "$msg\n";
		$timestamp = date("Y-m-d H:i:s");
		$level = static::strAlignRight(strtoupper($level->getName()), 4);
		$logger = static::strAlignRight($this->getName(), 25);
		
		$message = "$timestamp | $level | $logger | $msg";
		file_put_contents($this->filePath, $message, FILE_APPEND);
	}
	
	/**
	 * Returns a string part of $str which is exactly $len characters long, by either truncating or
	 * left padding with spaces.
	 *
	 * @param string $str
	 * @param int $len
	 */
	private static function strAlignRight($str, $len) {
		$str = str_pad($str, $len, " ", STR_PAD_LEFT);
		$str = substr($str, 0, $len);
		return $str;
	}
}
?>
