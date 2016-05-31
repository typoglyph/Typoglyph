<?php
require_once("config/DatabaseConfig.php");
require_once("config/LoggerConfig.php");


class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config;
	
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
	
	function getPrivilegedDatabaseConfig() {
		$dbConfig = static::$config["PrivilegedDatabaseConnection"];
		return new DatabaseConfig($dbConfig["ConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
	}
}
ApplicationConfig::initStatic();
?>
