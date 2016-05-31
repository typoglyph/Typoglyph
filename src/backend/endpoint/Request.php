<?php
class Request {
	private $params;
	
	
	/**
	 * @param string $name
	 * @param boolean $required
	 * @return string
	 */
	public function getStringParameter($name, $required = True) {
		$param = isset($this->params[$name]) ? $this->params[$name] : Null;
		if ($param === Null && $required) {
			throw new Exception("Required parameter '$name' not specified");
		}
		return $param;
	}
	
	/**
	 * @param string $name
	 * @param boolean $required
	 * @return int
	 */
	public function getIntParameter($name, $required = True) {
		$param = $this->getStringParameter($name, $required);
		if ($param != Null && !is_numeric($param)) {
			throw new Exception("The '$name' parameter must be an integer: $param");
		}
		return (int) $param;
	}
	
	/**
	 * @param string $name
	 * @param boolean $required
	 * @return boolean
	 */
	public function getBooleanParameter($name, $required = True) {
		$param = $this->getStringParameter($name, $required);
		if ($param === Null)
			return Null;
		if (strcasecmp($param, "true") === 0)
			return True;
		if (strcasecmp($param, "false") === 0)
			return False;
		throw new Exception("The '$name' parameter must be a boolean: $param");
	}
	
	
	public function __construct($params) {
		$this->params = $params;
	}
	
	public function __toString() {
		$paramsStr = "[" . implode(", ", $this->params) . "]";
		return get_class() . "[params=$paramsStr]";
	}
}
?>
