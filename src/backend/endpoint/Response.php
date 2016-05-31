<?php
class Response {
	public static $STATUS_SUCCESS = 200;
	
	public static $CONTENT_TYPE_JSON = "application/json";
	public static $CONTENT_TYPE_TEXT = "text/plain";
	
	private $contentType;
	private $status;
	private $data;
	
	
	public function send() {
		header("Content-type:" . $this->contentType);
		print($this->data);
		exit($this->status);
	}
	
	
	/**
	 * @param string $data
	 * @param string $contentType
	 * @param int $status
	 */
	public function __construct($data, $contentType, $status = Null) {
		if ($status === Null) {
			$status = static::$STATUS_SUCCESS;
		}
		$this->contentType = $contentType;
		$this->status = $status;
		$this->data = $data;
	}
	
	public function __toString() {
		return get_class() . "[contentType={$this->contentType}, status={$this->status}, data={$this->data}]";
	}
}
?>
