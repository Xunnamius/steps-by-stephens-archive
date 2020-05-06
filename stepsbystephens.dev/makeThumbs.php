<?php
	define('GALLERY_THUMB_WIDTH', 1920);
	define('GALLERY_THUMB_HEIGHT', 0);
	define('SHOP_THUMB_WIDTH', 920);
	define('SHOP_THUMB_HEIGHT', 0);
	define('ORIG_DIR', '/home/xunnamius/Desktop/pics');
	define('THUMB_DIR', '/home/xunnamius/Desktop/thumbs');
	
	$folders = scandir(ORIG_DIR);
	
	foreach($folders as $folder)
	{
		if(!in_array($folder, array('.', '..')) && is_dir(ORIG_DIR.'/'.$folder))
		{
			$mode = 0;
			if($folder == 'gallery')
				$mode = 1;
			
			echo "\nEntered folder ", ORIG_DIR.'/'.$folder, ' ('.($mode ? 'gallery' : 'shop').'-thumb mode)';
			echo "\nFound: ";
			var_dump(glob(ORIG_DIR.'/'.$folder.'/*.jpg'));
			
			$images = new Imagick(glob(ORIG_DIR.'/'.$folder.'/*.jpg'));
			foreach($images as $image)
			{
				clearstatcache();
				
				echo "\nBegin iteration.";
				$dir = $image->getImageFileName();
				echo "\nProcessing \"", $dir, '" ...';
				
				if($mode)
					$image->thumbnailImage(GALLERY_THUMB_WIDTH, GALLERY_THUMB_HEIGHT);
				else
					$image->thumbnailImage(SHOP_THUMB_WIDTH, SHOP_THUMB_HEIGHT);
				
				$writeout = THUMB_DIR.'/'.basename(dirname($dir));
				
				if(!is_dir($writeout))
				{
					echo "\nPath \"$writeout\" does not exist, making...";
					mkdir($writeout, 0777, true);
				}
				
				echo "\nWriting out to \"", $writeout.'/'.basename($dir), '" ...';
				$image->writeImage($writeout.'/'.basename($dir));
			}
			
			echo "\n\n\n";
		}
	}
?>