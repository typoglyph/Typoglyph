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

function puzzleToJsonObject($puzzle) {
	return json_encode($puzzle);
}

function puzzlesToJsonArray($puzzles) {
	return json_encode($puzzles);
}
?>
