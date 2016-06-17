<?php
require_once("endpoint/UpdatePuzzlesEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new UpdatePuzzlesEndpoint();
$request = new Request($_GET, $_POST["data"]);
$response = $endpoint->handleRequest($request);
$response->send();
?>
