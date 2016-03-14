<?php
require_once("logger.php");


class ApplicationConfig {
	private static $CONFIG_FILE_PATH = "../../config/default.ini";
	private static $config;
	private static $logger;
	
	static function initStatic() {
		static::$logger = LoggerFactory::getLogger(__CLASS__);
		static::$logger->info("Parsing config for the first time: " . static::$CONFIG_FILE_PATH);
		static::$config = parse_ini_file(static::$CONFIG_FILE_PATH, true, INI_SCANNER_TYPED);
	}
	
	function getDatabaseConfig() {
		$dbConfig = static::$config["DatabaseConnection"];
		return new DatabaseConfig($dbConfig["ConnectionString"], $dbConfig["Username"], $dbConfig["Password"]);
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
