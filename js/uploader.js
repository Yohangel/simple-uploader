// Script file upload
$(document).ready(function() {
	var divg = document.createElement('div'); 
		divg.id = ('inSide');
	var cerrar = document.createElement('a');
		cerrar.href = "#close";
		cerrar.className = "close";
		cerrar.innerHTML = "X";	
		cerrar.addEventListener('click', function(e) {  
			$.Jcrop('#modimagen').destroy();											   
			$('#modimagencont').html("");
			$('#divMod').html("");
			}, false);
	var divb = document.createElement('div'); 
		divb.style.clear = "both";
		divb.id = "divMod";
	var upload_img2  = document.createElement('div'); 
		upload_img2.id = "modimagencont";	
		cortar = document.getElementById('cortar');	
		divg.appendChild(cerrar);
		divg.appendChild(upload_img2);
		divg.appendChild(divb);
		cortar.appendChild(divg);	
});
// Delete progress bar's
function borrarBarras(){
	$( ".progresoCont" ).empty();
}
// When click on upload icon "+"
function HandleUploadClick(){
    var clickHandle = document.getElementById("testinput");
    clickHandle.click();
}
// Jcrop coords
function showCoords(c){
	$('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
}
// Upload the file
function addFile(){
	location.href = "#cortar";
	var file = document.getElementById('testinput').files[0];
	if ((/\.(jpg|png|gif)$/i).test(file.name)) {
		if (file.size < 1024 * 1024 * 2) {
			var progresss = document.createElement('div'); 
				progresss.className = "progreso";
		    var progressBarr = document.createElement('div'); 
				progressBarr.className = "barra";
				progressBarr.appendChild(progresss);
			var progreso = document.createElement('div');
				progreso.id = "progreso";
				progreso.className = "progresoCont";
				progreso.appendChild(progressBarr);
			var inSide = document.getElementById('inSide');
				inSide.appendChild(progreso);
			var xhr = new XMLHttpRequest();
			var formData = new FormData();
			formData.append('file', file);
			xhr.open('POST', 'fileuploader.php');
			xhr.upload.onprogress = function (e) {
				if (e.lengthComputable) {	
					progresss.style.width=(e.loaded/e.total)*100+"%"; } 
				}
			xhr.upload.onloadstart = function (e) { $(".barra").value = 0; }
			xhr.upload.onloadend = function (e) { $(".barra").value = e.loaded; }
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					borrarBarras(); 
					if (xhr.responseText.substring(0, 5) != "Error") { 
						$('#modimagencont').html('<img src="' + xhr.responseText + '" id="modimagen">');
						$('.jcrop-holder').remove();
						$('#modimagen').Jcrop({
		             		bgColor: 'transparent',
							addClass: 'jcrop-centered',
							onSelect: showCoords,
		           	 		onChange: showCoords,
							aspectRatio: 1,
					    	setSelect: [ 0, 0,100, 100 ],
							minSize: [ 50,50 ],
							maxSize: [ 200,200 ]
		        			},function(){
								jcrop_api = this;
		            		}
		            	);
						$('#src').val(xhr.responseText);
						var divCortar = document.createElement('div'); 
							divCortar.className = ('guardar');	
							divCortar.innerHTML = ('guardar');
							divCortar.addEventListener('click', function(e) {  			    
								cropFile();
								}, false);
						var divCancelar = document.createElement('div'); 
							divCancelar.className = ('cancelar');	
							divCancelar.innerHTML = ('cancelar');
							divCancelar.addEventListener('click', function(e) {  
						    	$.Jcrop('#modimagen').destroy();		
						 		$('.jcrop-holder').remove();
								$('#modimagencont').html("");
					        	$('#divMod').html("");
								location.href = "#close";	
								}, false);
						var divMod = document.getElementById('divMod'); 	
							divMod.appendChild(divCortar);
							divMod.appendChild(divCancelar);			 
					}
				}	
			}
			xhr.send(formData);
		} else { alert('Error, la imagen pesa mas de 2 mb'); }	
	} else { alert('Error, el archivo seleccionado no es una imagen valida'); }
}
 // Jcrop when file is uploaded
function cropFile(){
	var x = document.getElementById('x').value;
	var y = document.getElementById('y').value;
	var w = document.getElementById('w').value;
	var h = document.getElementById('h').value;
	var src = document.getElementById('src').value;
	var xhr2 = new XMLHttpRequest();
	var formData2 = new FormData();
	formData2.append('x', x);
	formData2.append('y', y);
	formData2.append('w', w);
	formData2.append('h', h);
	formData2.append('src', src);
	xhr2.open('POST', 'filecrop.php');
	xhr2.onreadystatechange = function() {
		if (xhr2.readyState == 4 && xhr2.status == 200) {		 
			if (xhr2.responseText.substring(0, 5) != "Error") {
				var eliminar  = document.createElement('div'); 
					eliminar.innerHTML = "X";	
					eliminar.className = "eliminar";
					eliminar.addEventListener('click', function(e) {  			    
					row_img.parentNode.removeChild(row_img);
					}, false);
				var	row_img = document.createElement('li');	
		    	var upload_img  = document.createElement('div'); 
				var d = new Date();
				upload_img.style.background = "url('"+ xhr2.responseText +"?"+ d.getTime();"')";
				upload_img.style.backgroundSize = "100px 100px";
				upload_img.className = "clasethumb";
				row_img.appendChild(upload_img);
				row_img.appendChild(eliminar);	
				list = document.getElementById('lista-imagenes');
				list.appendChild(row_img);
				$.Jcrop('#modimagen').destroy();	
				$('.jcrop-holder').remove();
				$('#modimagencont').html("");
				$('#divMod').html("");
				location.href = "#close";	
			}
		}	
	}
	xhr2.send(formData2);
}