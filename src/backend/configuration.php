<?php


class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config;
	private static $logger;
	
	static function initStatic() {
		static::$config = parse_ini_file(static::$CONFIG_FILE_PATH, true, INI_SCANNER_TYPED);
	}
	
	function getLoggerConfig() {
		$logConfig = static::$config["Logger"];
		return new LoggerConfig($logConfig["FilePath"], $logConfig["Level"]);
	}
	
	function getDatabaseConfig() {
		$dbConfig = static::$config["DatabaseConnection"];
		return new DatabaseConfig($dbConfig["ConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
	}
}
ApplicationConfig::initStatic();


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


class DatabaseConfig {
	private $connString;
	private $uname;
	private $pword;
	
	function __construct($connString, $uname, $pword) {
		$this->connString = $connString;
		$this->uname = $uname;
		$this->pword = $pword;
	}
	
	function getConnectionString() {
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
