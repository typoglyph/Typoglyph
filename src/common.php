<?php

function getDatabaseConnection() {
    $dbname = "dot_dash";
    $hostname = "localhost";
    $username = "";
    $password = "";

    $db = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
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

function puzzleToJsonObject($puzzle) {
	return json_encode($puzzle);
}

function puzzlesToJsonArray($puzzles) {
	return json_encode($puzzles);
}

?>