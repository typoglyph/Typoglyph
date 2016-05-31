<?php
require_once("endpoint/GetCompletionGraphicsEndpoint.php");
require_once("endpoint/Request.php");


$endpoint = new GetCompletionGraphicsEndpoint();
$request = new Request($_GET);
$response = $endpoint->handleRequest($request);
$response->send();
?>
