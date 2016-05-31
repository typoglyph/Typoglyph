<?php
require_once("config/ApplicationConfig.php");
require_once("dbio/DatabaseWrapper.php");
require_once("endpoint/Endpoint.php");


abstract class DatabaseAwareEndpoint extends Endpoint {
	
	/**
	 * @return DatabaseWrapper
	 */
	static function getDatabaseConnection() {
		$dbConfig = (new ApplicationConfig())->getDatabaseConfig();
		$dbConnString = $dbConfig->getConnectionString();
		$dbUsername = $dbConfig->getUsername();
		$dbPassword = $dbConfig->getPassword();
		return new DatabaseWrapper($dbConnString, $dbUsername, $dbPassword);
	}

	/**
	 * @return DatabaseWrapper
	 */
	static function getPrivilegedDatabaseConnection() {
		$dbConfig = (new ApplicationConfig())->getPrivilegedDatabaseConfig();
		$dbConnString = $dbConfig->getConnectionString();
		$dbUsername = $dbConfig->getUsername();
		$dbPassword = $dbConfig->getPassword();
		return new DatabaseWrapper($dbConnString, $dbUsername, $dbPassword);
	}
}
?>
