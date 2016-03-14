<?php
require_once("configuration.php");
require_once("databaseio.php");


/**
 * @return DatabaseWrapper
 */
function getDatabaseConnection() {
	$dbConfig = (new ApplicationConfig())->getDatabaseConfig();
	$dbConnString = $dbConfig->getPdoConnectionString();
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
	$value = $_REQUEST[$name];
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
 * @param mixed $value
 * @param boolean $prettyHtml
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
