<?php
require_once("endpoint/GetAllPuzzlesEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new GetAllPuzzlesEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
