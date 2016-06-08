<?php
class Response {
	public static $STATUS_SUCCESS = 200;
	
	public static $CONTENT_TYPE_CSV = "text/csv";
	public static $CONTENT_TYPE_JSON = "application/json";
	public static $CONTENT_TYPE_TEXT = "text/plain";
	public static $CONTENT_TYPE_XML = "application/xml";
	
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
		$dataStr = static::truncateStr($this->data, 50);
		return get_class() . "[contentType={$this->contentType}, status={$this->status}, data=$dataStr]";
	}
	
	/**
	 * @param string $str
	 * @param int $maxLen
	 * @param string [$ellipses]
	 * @return string
	 */
	private static function truncateStr($str, $maxLen, $ellipses="...") {
		$sLen = strlen($str);
		$eLen = strlen($ellipses);
		if ($sLen > $maxLen) {
			return substr($str, 0, $maxLen - $eLen) . $ellipses;
		}
		return $str;
	}
}
?>
