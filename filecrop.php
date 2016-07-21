<?php 
// Jcrop file save
$x = $_POST["x"];
$y = $_POST["y"];
$w = $_POST["w"];
$h = $_POST["h"];
$img_path = $_POST["src"];
$isImg = getimagesize($img_path);
if($isImg !== false) {
	$ext = explode('.', $img_path);
	$type = $ext[count($ext) - 1];
	if ($type=="jpeg"){$type="jpg";}
	$width  = $isImg[0]; $height = $isImg[1]; 
		switch ($type) {
			case "jpg": $img = imagecreatefromjpeg($img_path); break;
			case "png": $img = imagecreatefrompng($img_path); break;
			case "gif": $img = imagecreatefromgif($img_path); break;
		}
	imagealphablending($img, true);		
	$img_cropped = imagecreatetruecolor($w, $h);
	imagesavealpha($img_cropped, true);
	imagealphablending($img_cropped, false);
	$transparent = imagecolorallocatealpha($img_cropped, 0, 0, 0, 127);
	imagefill($img_cropped, 0, 0, $transparent);
	imagecopyresampled($img_cropped, $img, 0, 0, $x, $y, $w, $h, $w, $h); 
		switch ($type) {
			case "jpg": $img = imagejpeg($img_cropped, $img_path); break;
			case "png": $img = imagepng($img_cropped, $img_path); break;
			case "gif": $img = imagegif($img_cropped, $img_path); break;
		}
	die($img_path); 
} else {
	echo ("error");
	die();
} ?>