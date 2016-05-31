<?php
require_once("logging/LoggerFactory.php");


abstract class Endpoint {
	private $logger;
	
	public function __construct() {
		// Non-static logger so we can use the name of the concrete endpoint class
		$this->logger = LoggerFactory::getLogger(get_class());
	}
	
	/**
	 * @param Request $req
	 * @return Response
	 */
	public function handleRequest($req) {
		$this->logger->info("Handling request: {(string) $req}");
		$resp = $this->_handleRequest($req);
		$this->logger->debug("Returning response: {(string) $resp}");
		return $resp;
	}
	
	/**
	 * @param Request $req
	 * @return Response
	 */
	abstract function _handleRequest($req);
}
?>
