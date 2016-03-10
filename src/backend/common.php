<?php
require_once("configuration.php");


function getDatabaseConnection() {
	$dbConfig = (new ApplicationConfig())->getDatabaseConfig();
	$dbConnString = $dbConfig->getPdoConnectionString();
	$dbUsername = $dbConfig->getUsername();
	$dbPassword = $dbConfig->getPassword();

	$db = new PDO($dbConnString, $dbUsername, $dbPassword);
    return $db;
}

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

function getIntRequestParam($name, $required) {
	$value = getStringRequestParam($name, $required);
	if ($value != Null && !is_numeric($value))
		throw new Exception("The '$name' argument must be an integer");
	return (int) $value;
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
