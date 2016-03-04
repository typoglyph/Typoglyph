<?php
class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config = Null;
	
	function getDatabaseConfig() {
		$dbConfig = $this->parseConfigFile()["DatabaseConnection"];
		return new DatabaseConfig($dbConfig["PdoConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
	}
	
	private function parseConfigFile() {
		if (ApplicationConfig::$config == Null) {
			$path = ApplicationConfig::$CONFIG_FILE_PATH;
			ApplicationConfig::$config = parse_ini_file($path, true, INI_SCANNER_TYPED);
		}
		return ApplicationConfig::$config;
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
