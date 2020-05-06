<?php
	function directoryToArray($directory, $recursive = true, $listDirs = false, $listFiles = true, $exclude = '')
	{
		$arrayItems = array();
		$skipByExclude = false;
		$handle = opendir($directory);
		
		if($handle)
		{
			while(false !== ($file = readdir($handle)))
			{
				preg_match("/(^(([\.]){1,2})$|(\.(svn|git|md))|(Thumbs\.db|\.DS_STORE))$/iu", $file, $skip);
				if($exclude)
					preg_match($exclude, $file, $skipByExclude);
				
				if(!$skip && !$skipByExclude)
				{
					if(is_dir($directory. DIRECTORY_SEPARATOR . $file))
					{
						if($recursive)
							$arrayItems = array_merge($arrayItems, directoryToArray($directory. DIRECTORY_SEPARATOR . $file, $recursive, $listDirs, $listFiles, $exclude));
						
						if($listDirs)
						{
							$file = $directory . DIRECTORY_SEPARATOR . $file;
							$arrayItems[] = $file;
						}
					}
					
					else
					{
						if($listFiles)
						{
							$file = $directory . DIRECTORY_SEPARATOR . $file;
							$arrayItems[] = $file;
						}
					}
				}
			}
		
			closedir($handle);
		}
		
		return $arrayItems;
	}
	
	function alter($item, $key)
	{
		global $newarr;
		$bn = basename(dirname($item));
		
		if($bn == 'web_photos_thumbs')
			return;
		
		if(!array_key_exists($bn, $newarr))
			$newarr[$bn] = array();
		
		$newarr[$bn][] = $item;
	}
	
	function sizesort($a, $b)
	{
		$asize = filesize($a);
		$bsize = filesize($b);
		
		if($asize == $bsize)
			return 0;
		
		return $asize > $bsize ? 1 : -1;
	}
	
	if(isset($_GET['ajax']) && $_GET['ajax'] == 'yes')
	{
		$return = array('result' => 'error', 'data' => 'bad request');
		
		if(isset($_GET['action'], $_GET['data']))
		{
			$action = $_GET['action'];
			$data = json_decode(stripslashes($_GET['data']));
			
			if($action == 'request')
			{
				if(isset($data) && $data->target == 'slideshowData')
				{
					$newarr = array();
					array_walk(directoryToArray('assets/img/web_photos_thumbs'), 'alter');
					
					foreach($newarr as &$arr)
						usort($arr, 'sizesort');
					
					$return = array('result' => 'ok', 'data' => $newarr);
				}
				
				else $return = array('result' => 'error', 'data' => 'bad data');
			}
			
			else $return = array('result' => 'error', 'data' => 'bad action');
		}
		
		exit(json_encode($return));
	}
	
	header('Location: http://stepsbystephens.com');
?>