<?php
require_once("endpoint/GetCompletionSoundsEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new GetCompletionSoundsEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
