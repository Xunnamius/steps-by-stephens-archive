<?php
	include_once('../assets/includes/head.php');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
		<meta charset="UTF-8" />
		
		<title>Success!</title>
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta name="author" content="Xunnamius of Dark Gray" />
		<meta name="copyright" content="&copy; Copyright Dark Gray 2012. All Rights Reserved." />
		<meta name="license" content="Twitter Bootstrap: https://github.com/twitter/bootstrap/blob/master/LICENSE" />
		<meta name="keywords" content="steps,by,stephen,stephens,stepsbystephens,shoes,ecommerce,morehouse,cart,sell,buy,cool,dark,gray,darkgray" />
		<meta name="description" content="Premium high-class shoe shopping site based out of the ATL-AUC." />
		
		<style type="text/css">
			body { text-align: center; margin: 0; }
			header {
				margin: 0;
				background-color: lightgreen;
				padding: 10px;
			}
			
			header h1 { margin: 0; }
			
			p { margin-top: 25px; }
		</style>
	</head>
	
	<body>
<?php
	if(isset($_POST['status']) && strtolower($_POST['status']) == 'approved')
	{/*
		if(!isset($_POST['shoe_select'], $_POST['gender_select'], $_POST['size_select'], $_POST['approval_code'], $_POST['oid'], $_POST['response_hash'], $_POST['currency'], $_POST['chargetotal']))
			echo '<p>Malformed approval, redirecting...</p><script type="text/javascript">location.href="', $baseurl, '/buy/failure.php?badsuccess";</script>';
		else
		{
			// don't forget address2!
			$datetime_processed = isset($_POST['txndate_processed']) ? $_POST['txndate_processed'] : '(not available)';
			$chargeamnt = isset($_POST['chargetotal']) ? $_POST['chargetotal'] : '(not available)';
			$shipping_name = isset($_POST['sname']) ? $_POST['sname'] : '(not available)';
			$shipping_addr = (isset($_POST['saddr1']) ? $_POST['saddr1'] : '(line 1 not provided)').' '.(isset($_POST['saddr2']) ? $_POST['saddr2'] : '(line 2 not provided)');
			$shipping_city = isset($_POST['scity']) ? $_POST['scity'] : '(not available)';
			$shipping_state = isset($_POST['sstate']) ? $_POST['sstate'] : '(not available)';
			$shipping_zip = isset($_POST['szip']) ? $_POST['szip'] : '(not available)';
			$shipping_country = isset($_POST['scountry']) ? $_POST['scountry'] : '(not available)';
			$billing_company = isset($_POST['bcompany']) ? $_POST['bcompany'] : '(not available)';
			$billing_name = isset($_POST['bname']) ? $_POST['bname'] : '(not available)';
			$billing_addr = (isset($_POST['baddr1']) ? $_POST['baddr1'] : '(line 1 not provided)').' '.(isset($_POST['baddr2']) ? $_POST['baddr2'] : '(line 2 not provided)');
			$billing_city = isset($_POST['bcity']) ? $_POST['bcity'] : '(not available)';
			$billing_state = isset($_POST['bstate']) ? $_POST['bstate'] : '(not available)';
			$billing_zip = isset($_POST['bzip']) ? $_POST['bzip'] : '(not available)';
			$billing_country = isset($_POST['bcountry']) ? $_POST['bcountry'] : '(not available)';
			$billing_phone = isset($_POST['phone']) ? $_POST['phone'] : '(not available)';
			$billing_fax = isset($_POST['fax']) ? $_POST['fax'] : '(not available)';
			$billing_email = isset($_POST['email']) ? $_POST['email'] : '(not available)';
			$card_method = isset($_POST['paymentMethod']) ? $_POST['paymentMethod'] : '(not available)';
			$card_number = isset($_POST['cardnumber']) ? $_POST['cardnumber'] : '(not available)';
			$card_expdate = isset($_POST['expmonth'], $_POST['expyear']) ? $_POST['expmonth'].'/'.$_POST['expyear'] : '(not available)';
			
			$str = $sharedSecret . $_POST['approval_code'] . $chargeamnt . $_POST['currency'] . $_SESSION['saledate'] . getStorename();
			for($i = 0; $i < strlen($str); $i++)
				$control_hash .= dechex(ord($str[$i]));
			$control_hash = hash('sha256', $control_hash);
			
			$msg = <<<MSG
WARNING: BE SURE TO CONFIRM THE SALE WITH YOUR GATEWAY (and process the
associated "postauth"/"Ticket Only" transaction) BEFORE SHIPPING ANY PRODUCTS.
Check out the "Ticket Only" transaction method, available from your administrator
virtual terminal, in the guide pdf available below.

Hello, Administrator!
Congratulations, you just made a(nother) sale. The details are as follows:

Order ID: {$_POST['oid']}
Approval code: {$_POST['approval_code']}

Sale date: {$_SESSION['saledate']}
Processing date: {$datetime_processed}
Charge dollar amount (USD): {$chargeamnt}

Customer (shipping) name: {$shipping_name}
Customer (shipping) address: {$shipping_addr}
Customer (shipping) city: {$shipping_city}
Customer (shipping) state/province: {$shipping_state}
Customer (shipping) zip code: {$shipping_zip}
Customer (shipping) country: {$shipping_country}

Customer (billing) company: {$billing_company}
Customer (billing) name: {$billing_name}
Customer (billing) address: {$billing_addr}
Customer (billing) city: {$billing_city}
Customer (billing) state/province: {$billing_state}
Customer (billing) zip code: {$billing_zip}
Customer (billing) country: {$billing_country}
Customer (billing) phone number: {$billing_phone}
Customer (billing) fax number: {$billing_fax}
Customer (billing) email: {$billing_email}

Payment Method (check below documentation for elaboration): {$card_method}
Purchasing Card Number: {$card_number}
Purchasing Card Expiration Date: {$card_expdate}

Selected product: {$_POST['shoe_select']}
Selected gender: {$_POST['gender_select']}
Selected size: {$_POST['size_select']}

Customer hash: {$_SESSION['supersecret']}
Security hash response: {$_POST['response_hash']}
Security hash control: {$control_hash}

Note: if the two hashes above do NOT match EXACTLY, then there is a high chance
that the information contained herein is UNRELIABLE and should NOT be TRUSTED.
BE SURE TO CONFIRM THAT THIS SALE ACTUALLY TOOK PLACE by logging in to your
Gateway administrator account and contrasting the info in this email with
what the gateway reports. If the data contained herein proves to be inaccurate,
please contact Dark Gray (http://darkgray.org/support) as soon as possible.

To complete this transaction: first, ship off the product, and then perform a "Ticket Only"
transaction from your administrator virtual terminal interface, accessible from your gateway.

For more information on the results returned and "Ticket Only" transactions, be sure to read
this guide pdf:

http://www.firstdata.com/downloads/marketing-merchant/fdgg-connect-2.0-integration-guide.pdf
MSG;

			mail('purchase@stepsbystephens.com', 'STEPS BY STEPHENS LLC : PURCHASE', $msg, 'From: Steps By Stephens LLC <donotreply@stepsbystephens.com>'."\r\n");
			echo '<header><h1>Success!</h1></header><p>You order has been received and will be processed ASAP! <a href="/#!/shop">Click here</a> to return to Steps By Stephens.</p>';
		}
	}
	
	else echo '<p>Error, redirecting...</p><script type="text/javascript">location.href="', $baseurl, '/buy/failure.php";</script>';*/
		echo '<header><h1>Success!</h1></header><p>You order has been received and will be processed ASAP!<br/>Be sure to check your email for a receipt.<br /><a href="/#!/shop">Click here</a> to return to Steps By Stephens, or <a href="/#!/contact">contact us</a> if you have any questions or concerns.</p>';
	}
?>
	</body>
</html>