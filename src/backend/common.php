<?php
require_once("configuration.php");
require_once("databaseio.php");

$HTTP_STATUS_SUCCESS = 200;


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
 * Sets the content type header to "application/json", converts the given reply to JSON and prints
 * it and then exits the script with the given HTTP status code
 *
 * IMPORTANT: No further code will be executed after this function has returned
 * 
 * @param mixed $reply
 * @param int $statusCode
 */
function sendJsonReply($reply, $statusCode) {
	$json = toJson($reply, False);
	sendReply($json, "application/json", $statusCode);
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

/**
 * @param mixed $value
 * @param boolean $prettyHtml Should usually be false. Setting to true can make debugging easier as
 *     new lines will be replaced with <br/> tags etc. The result of this function with $prettyHtml
 *     as true is not compatible with the fromJson function.
 * @return string
 */
function toJson($value, $prettyHtml) {
	$json = $prettyHtml ? json_encode($value, JSON_PRETTY_PRINT) : json_encode($value);
	if ($prettyHtml) {
		$json = str_replace(" ", "&nbsp;", $json);
		$json = nl2br($json);
	}
	return $json;
}

/**
 * @param string $json
 * @return mixed
 */
function fromJson($json) {
	return json_decode($json);
}
?>
