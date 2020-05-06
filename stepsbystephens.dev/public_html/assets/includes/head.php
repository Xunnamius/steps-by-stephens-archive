<?php
	//error_reporting(0);
	$product_price = '55.00';
	$tax_price = '4.40';
	$shipping_price = '10.00';
	$grandtotal = number_format($product_price+$tax_price+$shipping_price, 2);
	$currency = 840;
	$baseurl = 'http://stepsbystephens.dev';
	$storeId = '1001309157';
	$sharedSecret = '39343439333538383733393938383734323233333435373939373038393736353735383934353036333538323832323633353230383133383232343738353533';
	
	@session_start();
	$_SESSION['BUYNOW'] = false;
	$_SESSION['saledate'] = isset($_SESSION['saledate']) ? $_SESSION['saledate'] : '(not available)';
	$_SESSION['supersecret'] = isset($_SESSION['supersecret']) ? $_SESSION['supersecret'] : '(not available)';
	
	date_default_timezone_set('America/New_York');
	$timezone = "EST";
	$dateTime = date('Y:m:d-H:i:s');
	
	function getDateTime()
	{
		global $dateTime;
		$_SESSION['saledate'] = $dateTime;
		return $dateTime;
	}
	
	function getTimezone()
	{
		global $timezone;
		return $timezone;
	}
	
	function getStorename()
	{
		global $storeId;
		return $storeId;
	}
	
	function createHash($chargetotal)
	{
		global $sharedSecret;
		$str = getStorename() . getDateTime() . $chargetotal . $sharedSecret;
		for($i = 0; $i < strlen($str); $i++)
			$hex_str .= dechex(ord($str[$i]));
		$_SESSION['supersecret'] = hash('sha256', $hex_str);
		return $_SESSION['supersecret'];
	}
?>