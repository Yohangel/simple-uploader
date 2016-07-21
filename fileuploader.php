<?php  
$target = 'images/'.$_FILES['file']['name'];
$ext = explode('.', $target);
$type = $ext[count($ext) - 1]; if ($type=="jpeg"){$type="jpg";}
$isImg = getimagesize($_FILES["file"]["tmp_name"]);
$width  = $isImg[0]; $height = $isImg[1]; 
define("MAXWIDTH",200); 
define("MAXHEIGHT",200); 
define("MAXFILEMB",2); 
	if($isImg !== false) {
		if(($type == "png") or ($type == "gif") or ($type == "jpg") ) {
			if($_FILES['file']['size'] < MAXFILEMB*1048576) {
				move_uploaded_file( $_FILES['file']['tmp_name'],$target);
				if (($width > MAXWIDTH) or ($height > MAXHEIGHT)){
					if ($width == $height) {
						$nWidth = $nHeight = MAXWIDTH;
					}
					elseif ($width > $height) {
						$nWidth = MAXWIDTH;
						$nHeight = $nWidth * $height / $width;
					} else {
						$nHeight = MAXHEIGHT;
						$nWidth = $nHeight * $width / $height;
					}
					switch ($type) {
						case "jpg": $img = imagecreatefromjpeg($target); break;
						case "png": $img = imagecreatefrompng($target); break;
						case "gif": $img = imagecreatefromgif($target); break;
					}
					imagealphablending($img, true);		
					$img_cropped = imagecreatetruecolor($nWidth, $nHeight);
					imagesavealpha($img_cropped, true);
					imagealphablending($img_cropped, false);
					$transparent = imagecolorallocatealpha($img_cropped, 0, 0, 0, 127);
					imagefill($img_cropped, 0, 0, $transparent);
					imagecopyresampled($img_cropped, $img, 0, 0, 0, 0, $nWidth, $nHeight, $width, $height);
					switch ($type) {
						case "jpg": $img = imagejpeg($img_cropped, $target); break;
						case "png": $img = imagepng($img_cropped, $target); break;
						case "gif": $img = imagegif($img_cropped, $target); break;
					}
				}
				die($target); 
			} else { echo 'Error, la imagen pesa mas de '.MAXFILEMB.' mb'; die(); }
		} else { echo 'Error, el archivo seleccionado no es una imagen valida'; die(); }
	} else { echo 'Error, el archivo seleccionado no es una imagen valida'; die(); } 
?>