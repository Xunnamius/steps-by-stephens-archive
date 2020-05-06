<?php
	include_once('assets/includes/head.php');
?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
		<meta charset="UTF-8" />
		
		<title>Steps By Stephens</title>
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta name="author" content="Xunnamius of Dark Gray" />
		<meta name="copyright" content="&copy; Copyright Dark Gray 2012. All Rights Reserved." />
		<meta name="license" content="Twitter Bootstrap: https://github.com/twitter/bootstrap/blob/master/LICENSE" />
		<meta name="keywords" content="steps,by,stephen,stephens,stepsbystephens,shoes,ecommerce,morehouse,cart,sell,buy,cool,dark,gray,darkgray" />
		<meta name="description" content="Premium high-class shoe shopping site based out of the ATL-AUC." />
		
		<link rel="icon" type="image/png" href="assets/img/logo-small.png">
		
		<script type="text/javascript">
			/* <![CDATA[ */
			var gBaseURL = '<?php echo $baseurl; ?>';
			/* ]]> */
		</script>
		
		<!-- CSS includes -->
		<link rel="stylesheet" type="text/css" href="assets/css/bootstrap/bootstrap.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/boot-global.css" />
		
		<!-- Browser Hax -->
		<!-- IE<9 specific CSS -->
		<!--[if lt IE 9]>
			<link rel="stylesheet" type="text/css" href="assets/css/boot-forie.css" />
		<![endif]-->
		
		<!-- IE6-8 support of HTML5 elements -->
		<!--[if lt IE 9]>
			<script type="text/javascript" src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	
	<body>
		<p id="loading" class="absolute-center"></p>
		<div id="wrapper">
			<div id="moresbs">
				<a id="moresbs-dropdown" class="smallcaps" href="#" data-uri="more">more sbs</a>
				<div class="float-right">
					<h3 id="privacy-policy">Privacy Policy</h3>
					<pre>Steps By Stephens ensures the privacy of all visitors to this website and is fully committed to protect the privacy and security of all visitors' personal information.</pre>
					<h3 id="exchange-policy">Exchanges/Returns</h3>
					<pre>Refunds, Returns & Exchanges

Returns:

Returns are accepted under the following conditions:

The returns must be received by Steps by Stephens with in 30 days of the shipping date. In order to be in consideration for full refund of your order, we require the following:
- A copy of your invoice or order form
- Items must be returned in new unworn condition
- No signs of use and in original packaging
All returns are subject to a 5.00 restocking fee per package.

Refunds:

After receiving the returned item your purchase will be credited back to your account. Steps by Stephens will not refund any customer whose order is not received because the shipping address provided during the checkout procedure was inaccurate or incomplete unless that order is classified as undeliverable and returned to Steps by Stephens.

Exchanges:

To exchange an item, the customer must return the unwanted item according to the return procedures listed above.

Once you receive the conformation email, please mail the product along with a note describing your desired exchange item along with any applicable corrections or suggestions.

Please send items to:

Steps by Stephens LLC
2221 PEACHTREE RD NE, STE D #556
ATLANTA, GA 30309-1106

Once we receive customer returned merchandise we will immediately take care of corrections that need to be made. 
If at any time you are having trouble with your return, please send an email to support@stepsbystephens.com, thank you.</pre>
					<div class="credit">
						<p>&copy; <span class="smallcaps">Steps By Stephens</span> 2012</p>
						<p>Website developed by <a href="http://darkgray.org" rel="external">Dark Gray</a></p>
					</div>
				</div>
				<div class="float-left">
					<p id="logoworld" class="absolute-center"></p>
				</div>
			</div>
			<header>
				<div id="social">
					<ol>
						<li><a href="http://www.facebook.com/stepsbystephensllc" title="Like us on Facebook!" rel="external"><img src="assets/img/social/fb.png" alt="Like us on Facebook!" /></a></li>
						<li><a href="http://twitter.com/#!/stepsbystephens" title="Follow us on Twitter!" rel="external"><img src="assets/img/social/tw.png" alt="Follow us on Twitter!" /></a></li>
						<li><a href="http://web.stagram.com/n/stepsbystephens/" title="Check us out on Instagram!" rel="external"><img src="assets/img/social/in.png" alt="Check us out on Instagram!" /></a></li>
					</ol>
				</div>
				<a href="#" id="logohead" class="unselectable" data-uri="home"></a>
				<p id="takeabite"></p>
			</header>
			<div id="inner-wrapper">
				<div id="inner-slider" class="noexist">
					<div id="view-shop" class="container view-state loading">
						<div class="innermost-wrapper">
							<div class="float-left">
								<h1 id="shoe-title">Steps by Stephens Shop</h1>
								<p>The shoe is made of a canvas base, rubber sole, nylon pipping, and genuine leather with cotton shoe laces.
									A portion of your purchase also goes towards providing meals for a child in need!<br /><br />
									Subtotal: $<?php echo $product_price; ?><br />
									Shipping: $<?php echo $shipping_price; ?><br />
									Tax: $<?php echo $tax_price; ?><br />
									<span style="font-weight: bold;">Total: $<?php echo $grandtotal; ?></span>
								</p>
								<form id="shoe-select-form" method="get" action="#">
									<div>
										<select id="shoe-select-original" disabled="disabled">
											<option value="0">Choose your shoe...</option>
										</select>
									</div>
								</form>
								<div id="square4">
									<div id="square-1"><img /></div>
									<div id="square-2"><img /></div>
									<div id="square-3"><img /></div>
									<div id="square-4"><img /></div>
									<br class="clear-both" />
								</div>
								<div id="social-buttons">
									<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fstepsbystephens.com&amp;send=false&amp;layout=box_count&amp;width=60&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=61" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:60px; height:61px;" allowTransparency="true">
									</iframe>
									<div class="g-plusone" data-size="tall" data-href="http://stepsbystephens.com"></div>
									<a href="https://twitter.com/share" class="twitter-share-button" data-text="Help us combat childhood hunger in America! Quality shoes; Steps by Stephens http://stepsbystephens.com via @stepsbystephens" data-related="stepsbystephens" data-count="none">Tweet</a>
								</div>
							</div>
							<div class="float-right">
								<img id="shop-img" alt="  Loading some really high quality images, one sec..." />
								<form id="bottom-buttons-form" method="post" action="#">
									<input type="hidden" name="timezone" value="<?php echo getTimezone(); ?>" />
									<input type="hidden" name="authenticateTransaction" value="false" />
									<input type="hidden" name="paymentMethod" value="" />
									<input type="hidden" name="txntype" value="preauth" />
									<input type="hidden" name="txndatetime" value="<?php echo getDateTime(); ?>" />
									<input type="hidden" name="hash" value="<?php echo createHash($grandtotal); ?>" />
									<input type="hidden" name="mode" value="fullpay" />
									<input type="hidden" name="storename" value="<?php echo getStorename(); ?>" />
									<input type="hidden" name="chargetotal" value="<?php echo $grandtotal; ?>" />
									<input type="hidden" name="tax" value="<?php echo $tax_price; ?>" />
									<input type="hidden" name="shipping" value="<?php echo $shipping_price; ?>" />
									<input type="hidden" name="subtotal" value="<?php echo $product_price; ?>" />
									<input type="hidden" name="trxOrigin" value="ECI" />
									<input type="hidden" name="oid" value="" />
									<input type="hidden" name="tdate" value="" />
									
									<input type="hidden" id="shoe_select" name="shoe_select" value="0" />
									<div>
										<div>
											<select id="gender_select" name="gender_select" disabled="disabled">
												<option value="0">Gender...</option>
												<option value="male">Male</option>
												<option value="female">Female</option>
											</select>
											<select id="size_select" name="size_select" disabled="disabled">
												<option value="0">Size...</option>
											</select>
											<button type="button" id="slide-buynow" class="btn btn-warning" disabled="disabled">Buy Now!</button>
											<a href="#" class="btn btn-primary linkback">Go Back</a>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div id="view-contact" class="container view-state">
						<div class="innermost-wrapper">
							<div class="float-left">
								<img src="assets/img/web_photos_thumbs/contact.jpg" />
								<a href="#" class="btn btn-primary linkback">Back</a>
							</div>
							<div class="float-right">
								<h1>Contact Us</h1>
								<p><strong>Need some assistance?</strong><br />Please feel free to contact us anytime:</p>
								<p><em>General Inquiries</em><br /><a href="mailto:info@stepsbystephens.com">info@stepsbystephens.com</a></p>
								<p><em>Billing and Support</em><br /><a href="mailto:support@stepsbystephens.com">support@stepsbystephens.com</a></p>
								<p><br />Thank you for your continuing patience, support, and business.</p>
							</div>
							<br class="clearfix" />
						</div>
					</div> <!-- /view-contact -->
					<div id="view-home" class="container view-state">
						<div id="background-slide" class="slideshow">
							<img src="" alt="Product image failed to load!" class="absolute-center" />
						</div>
						<div class="absolute-center">
							<a href="#" class="circle smallcaps unselectable" data-uri="shop">shop<span></span></a>
							<a href="#" class="circle smallcaps unselectable" data-uri="contact">contact<span></span></a>
							<a href="#" class="circle smallcaps unselectable" data-uri="mission">our mission<span></span></a>
							<a href="#" class="circle smallcaps unselectable" data-uri="about">about<span></span></a>
						</div>
					</div> <!-- /view-home -->
					<div id="view-mission" class="container view-state">
						<div class="innermost-wrapper">
							<div class="float-left">
								<img src="assets/img/web_photos_thumbs/mission.jpg" />
								<a href="#" class="btn btn-primary linkback">Back</a>
							</div>
							<div class="float-right">
								<h1>Our Mission</h1>
								<p>We here at Steps by Stephens not only wanted to sell a product we loved and felt others would love as well, but we wanted to create a business model that would help those members of our community that are in need.</p>
								<p>We pride ourselves on getting involved. For every pair of shoes sold, a portion of that money will help provide meals to the children that need them the most. We will continue these efforts in the hope of eventually ending childhood hunger in America!</p>
							</div>
						</div>
						<br class="clearfix" />
					</div> <!-- /view-mission -->
					<div id="view-about" class="container view-state">
						<div class="innermost-wrapper">
							<div class="float-left">
								<img src="assets/img/web_photos_thumbs/about.jpg" />
								<a href="#" class="btn btn-primary linkback">Back</a>
							</div>
							<div class="float-right">
								<h1>About Us</h1>
								<p><strong>Steps by Stephens</strong> is a shoe company based in Atlanta, Georgia, founded by Thabiti Stephens. Our goal is to provide good quality fashionable shoes while still giving back to the community.<br /><br />Through collaborations with "Communities in Schools," we are able to provide food for inner-city youth whose parents are incapable of providing them with basic meals. <span class="underline">For every pair of shoes purchased, a portion of the proceeds will go towards providing a child in need with the nourishment they can't live without.</span><br /><br />Our end goal is to eventually expand our philanthropy nation-wide and help end childhood hunger everywhere!</p>
								<p>If you have any questions, feel free to <a href="#"  data-uri="contact">contact us</a>. Thanks, <br /><br />Thabiti Stephens<br />CEO Steps By Stephens</p>
							</div>
							<br class="clearfix" />
						</div>
					</div> <!-- /view-about -->
				</div> <!-- /view-slider -->
			</div> <!-- /inner-wrapper -->
		</div>
		<footer>
			<p>&copy; StepsByStephens 2012</p>
			<p><a href="http://darkgray.org" rel="external">Dark Gray</a></p>
			<p><a href="http://mootools.net" rel="external">MooTools</a></p>
			<p><a href="http://darkgray.org" rel="external">Find a glitch?</a></p>
		</footer>
		
		<!-- Google Analytics -->
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-32887501-1']);
		  _gaq.push(['_trackPageview']);
		
		  (function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
		
		<!-- JS includes -->
		<script type="text/javascript" src="assets/js/mootools/moo-core-1.4.5-compat.js"></script>
		<script type="text/javascript" src="assets/js/mootools/moo-more-1.4.0.1.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/HashNav/String.QueryStringImproved.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/HashNav/Object.compare.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/HashNav/HashNav.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/HashNav/HashNav.History.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/Slideshow3/slideshow.js"></script>
		<script type="text/javascript" src="assets/js/mootools/extensions/Slideshow3/slideshow.kenburns.js"></script>
		<script type="text/javascript" src="assets/js/global.js"></script>
		
		<!-- Google+ -->
		<script type="text/javascript">
		  (function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		  })();
		</script>
		
		<!-- Twitter -->
		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	</body>
</html>