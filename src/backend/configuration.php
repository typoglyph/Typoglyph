<?php
class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config;
	
	static function initStatic() {
		static::$config = parse_ini_file(static::$CONFIG_FILE_PATH, true, INI_SCANNER_TYPED);
	}
	
	function getDatabaseConfig() {
		$dbConfig = static::$config["DatabaseConnection"];
		return new DatabaseConfig($dbConfig["PdoConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
	}
}
ApplicationConfig::initStatic();


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
