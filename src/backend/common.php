<?php
require_once("configuration.php");
require_once("databaseio.php");

$HTTP_STATUS_SUCCESS = 200;
$CONTENT_TYPE_JSON = "application/json";
$CONTENT_TYPE_TEXT = "text/plain";


/**
 * @return DatabaseWrapper
 */
function getDatabaseConnection() {
	$dbConfig = (new ApplicationConfig())->getDatabaseConfig();
	$dbConnString = $dbConfig->getConnectionString();
	$dbUsername = $dbConfig->getUsername();
	$dbPassword = $dbConfig->getPassword();
	return new DatabaseWrapper($dbConnString, $dbUsername, $dbPassword);
}

/**
 * @return DatabaseWrapper
 */
function getPrivilegedDatabaseConnection() {
	$dbConfig = (new ApplicationConfig())->getPrivilegedDatabaseConfig();
	$dbConnString = $dbConfig->getConnectionString();
	$dbUsername = $dbConfig->getUsername();
	$dbPassword = $dbConfig->getPassword();
	return new DatabaseWrapper($dbConnString, $dbUsername, $dbPassword);
}


/**
 * @param string $name
 * @param boolean $required
 * @return string
 */
function getStringRequestParam($name, $required) {
	$value = array_key_exists($name, $_REQUEST) ? $_REQUEST[$name] : Null;
	if ($value == Null || $value == "") {
		if ($required)
			throw new Exception("The '$name' argument must be supplied");
		else
			return Null;
	}
	return $value;
}

/**
 * @param string $name
 * @param boolean $required
 * @return int
 */
function getIntRequestParam($name, $required) {
	$value = getStringRequestParam($name, $required);
	if ($value != Null && !is_numeric($value))
		throw new Exception("The '$name' argument must be an integer: $value");
	return (int) $value;
}

/**
 * @param string $name
 * @param boolean $required
 * @return boolean
 */
function getBooleanRequestParam($name, $required) {
	$value = getStringRequestParam($name, $required);
	if ($value === Null)
		return Null;
	if (strcasecmp($value, "true") === 0)
		return True;
	if (strcasecmp($value, "false") === 0)
		return False;
	throw new Exception("The '$name' argument must be a boolean: $value");
}

/**
 * Sets the HTTP content type header, prints the given reply and then exits the script with the
 * given HTTP status code
 *
 * IMPORTANT: No further code will be executed after this function has returned
 * 
 * @param string $reply
 * @param string $contentType
 * @param int $statusCode
 */
function sendReply($reply, $contentType, $statusCode) {
	header("Content-type:" . $contentType);
	print($reply);
	exit($statusCode);
}
?>
