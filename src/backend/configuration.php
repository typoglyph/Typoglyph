<?php
class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config = Null;
	
	function getDatabaseConfig() {
		$dbConfig = $this->parseConfigFile()["DatabaseConfig"];
		return new DatabaseConfig($dbConfig["PdoConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
	}
	
	private function parseConfigFile() {
		if ($this::$config == Null) {
			$this::$config = parse_ini_file($this::$CONFIG_FILE_PATH, True);
		}
		return $this::$config;
	}
}

class DatabaseConfig {
	private $connString;
	private $uname;
	private $pword;
	
	function __construct($connString, $uname, $pword) {
		$this->connString = $connString;
		$this->uname = $uname;
		$this->pword = $pword;
	}
	
	function getPdoConnectionString() {
		return $this->connString;
	}
	
	function getUsername() {
		return $this->uname;
	}
	
	function getPassword() {
		return $this->pword;
	}
}
?>
