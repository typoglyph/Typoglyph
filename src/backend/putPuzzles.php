<?php
require_once("endpoint/PutPuzzlesEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new PutPuzzlesEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
