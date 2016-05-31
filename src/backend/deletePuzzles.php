<?php
require_once("endpoint/DeletePuzzlesEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new DeletePuzzlesEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
