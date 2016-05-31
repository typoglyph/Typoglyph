<?php
require_once("endpoint/GetRandomPuzzlesEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new GetRandomPuzzlesEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
