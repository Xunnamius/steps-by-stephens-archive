<?php
	include_once('../assets/includes/head.php');
?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
		<meta charset="UTF-8" />
		
		<title>Something went wrong...</title>
		
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
				background-color: tomato;
				padding: 10px;
			}
			
			header h1 { margin: 0; }
			
			p { margin-top: 25px; }
		</style>
		
		<script type="text/javascript">
			/* <![CDATA[ */
			var gBaseURL = '<?php echo $baseurl; ?>';
			/* ]]> */
		</script>
	</head>
	
	<body>
		<header>
			<h1>Sorry :(</h1>
		</header>
<?php
	if(isset($_GET['instant']))
		echo '<p>The link you followed either doesn\'t exist or has expired! <a href="/">Click here</a> to go back home.</p>';
	else if(isset($_GET['badsuccess']))
		echo '<p>The transaction response from the payment gateway was corrupted. Please <a href="/#!/contact">contact us</a> immediately to resolve this issue. You may also <a href="/">go back home</a>.</p>';
	else if(isset($_POST['status']) && strtolower($_POST['status']) != 'approved')
		echo '<p>Your transaction failed due to the following error:<br /><span style="font-weight: bold;">',
		isset($_POST['fail_reason']) ? $_POST['fail_reason'] : 'Your card was denied.',
		'</span><br /><br />Please <a href="/#!/shop">choose a different payment method</a>, or <a href="/#!/contact">contact us</a> if you have any concerns.</p>';
	else
		echo '<p>Oops, looks like we messed up! <a href="/">Click here</a> to return home.</p>';
?>
	</body>
</html>