//
//
// Программа позволяет строить фрактальные структуры, задавая начальные условия(точки на плоскости) путем ввода пользователем через текстовые поля или кликом мыши по холсту (канвасу). Подробнее на сайте: http://tm.spbstu.ru/Фрактал

//
//

window.addEventListener('load',main,false);
function main () {
	var x; var y;
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
	var scale = cnv.width;
	var a_11; var a_12; var a_21; var a_22;
	var numb1; var numb2; var decim;
	var interv;
	var clear;
	var sc;
	var butt = document.getElementById('downloadimg');
	var update = document.getElementById('refresh');
	var clearrect = document.getElementById('clearr');
	var adddot = document.getElementById('adot');
	var fileinput = document.getElementById('file');
	X = []; // массив начальных иксов
	Y = []; // массив начальных игриков
	var move = false;
	var numberof;
	var z = 1;
	var RGB = [];
	var z2 = 1;
	var iterations = document.getElementById('number_it');
	// начальные условия 
	a_11 = 1;
	a_12 = 1;
	a_21 = 1;
	a_22 = 1;
	var N = 200000;
	var x_min = 0; var y_min = 0;
	var x_max = 1; var y_max = 1;
	var x_move; var y_move;
	var x_oldmin = 0;
	var x_oldmax = scale;
	var y_oldmin = 0;
	var y_oldmax = scale;
	var x_relativemin = 0;
	var x_relativemax = scale;
	var y_relativemin = 0;
	var y_relativemax = scale;
	var intermid;
	var imageData = ctx.createImageData(w,h);
	var imageData2;
	var upd = false;
	
	fileinput.onchange = function () {
		var exfile = document.getElementById('file').files[0];
		var reader = new FileReader();
		reader.readAsText(exfile);
		var lengthxy = "";
		reader.onload = function () {
			RGB = [];
			X = [];
			Y = [];
			x0y0 = reader.result;
			for (j = 0;j<x0y0.length;j++) {
				if (x0y0[j] == "C") {
					break
				}
				lengthxy += x0y0[j];
			}
			var rgblen = lengthxy*3;
			var index1 = x0y0.indexOf('X')+3;
			var index2 = x0y0.indexOf('Y')+3;
			var index3 = x0y0.indexOf('B')+2;
			
			for (i = 0; i<lengthxy;i++) {
				X[i] = parseFloat(x0y0.slice(index1,(x0y0.indexOf(",",index1))));
				index1 = (x0y0.indexOf(",",index1)) + 1;
				Y[i] = parseFloat(x0y0.slice(index2,(x0y0.indexOf(",",index2))));
				index2 = (x0y0.indexOf(",",index2)) + 1;
			}
			for (k = 0; k<rgblen; k++) { 
				RGB[k] = parseInt(x0y0.slice(index3,(x0y0.indexOf(",",index3))));
				index3 = (x0y0.indexOf(",",index3)) + 1;
			}
			RGB[rgblen-1] += parseInt(x0y0[x0y0.length - 1]);
			var index4 = x0y0.indexOf('in:')+3;
			x_min = parseFloat(x0y0.slice(index4,x0y0.indexOf('x_max')));
			var index5 = x0y0.indexOf('ax:')+3;
			x_max = parseFloat(x0y0.slice(index5,x0y0.indexOf('y_min')));
			var index6 = x0y0.indexOf('y_min:')+6;
			y_min = parseFloat(x0y0.slice(index6,x0y0.length));
			y_max = y_min + (x_max - x_min);
			z = 1/(x_max - x_min);
			var index7 = x0y0.indexOf("C") + 2;
			a_11 = parseFloat(x0y0.slice(index7,(x0y0.indexOf(",",index7))));
			index7 = (x0y0.indexOf(",",index7)) + 1;
			a_12 = parseFloat(x0y0.slice(index7,(x0y0.indexOf(",",index7))));
			index7 = (x0y0.indexOf(",",index7)) + 1;
			a_21 = parseFloat(x0y0.slice(index7,(x0y0.indexOf(",",index7))));
			index7 = (x0y0.indexOf(",",index7)) + 1;
			a_22 = parseFloat(x0y0.slice(index7,(x0y0.indexOf("X",index7))));
			a11.value = a_11;
			a12.value = a_12; 
			a21.value = a_21;   
			a22.value = a_22;
			z2 = 1;
		}
	}
	
	x_minim.onchange = function () {
		x_min = parseFloat(document.getElementById('x_minim').value);
		z = 1/(x_max - x_min);
		z2 = 1;
		y_max = y_min + x_max - x_min;
		x_relativemin = 0;
		x_relativemax = scale;
		y_relativemin = 0;
		y_relativemax = scale;
	}
	x_maxim.onchange = function () {
		x_max = parseFloat(document.getElementById('x_maxim').value);
		z = 1/(x_max - x_min);
		z2 = 1;
		y_max = y_min + x_max - x_min;
		x_relativemin = 0;
		x_relativemax = scale;
		y_relativemin = 0;
		y_relativemax = scale;
	}
	y_minim.onchange = function () {
		y_min = parseFloat(document.getElementById('y_minim').value);
		z = 1/(x_max - x_min);
		z2 = 1;
		y_max = y_min + x_max - x_min;
		x_relativemin = 0;
		x_relativemax = scale;
		y_relativemin = 0;
		y_relativemax = scale;
	}
	clearrect.onclick = function () {
		clearcanv();
		X = [];
		Y = [];
		z = 1;
		z2 = 1;
	}
	adddot.onclick = function () {
		rgbpush();
		x = document.getElementById('x_o').value;
		y = document.getElementById('y_o').value;
		X.push(x); Y.push(y);
		for (j = 0;j<=N; j++){
			coord();
			draw();
		}
		ctx.putImageData(imageData,0,0);
		document.getElementById('x_minim').value = x_min;
		document.getElementById('y_minim').value = y_min;
		document.getElementById('x_maxim').value = x_max;
		some_span.innerHTML = "Увеличение в "+z.toFixed(1)+" раз";
	}
	function randpush(k) {
		for (i = 0; i<k;i++) {
			X.push(Math.random()); Y.push(Math.random());
		}
	}

	function download(filename, text1, text2, text3, xmi, xma, ymi, a1, a2, a3, a4) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,'+ X.length + "\n"+ encodeURIComponent("C:"+a1+","+a2+","+a3+","+a4) +
		"\n" + "X0:" +
		encodeURIComponent(text1) + "\n"+ "Y0:" + encodeURIComponent(text2) + "\n" + "RGB:" + encodeURIComponent(text3) + 
		"\n" + "x_min:" + encodeURIComponent(xmi) + "x_max:" + encodeURIComponent(xma)+ "y_min:" + encodeURIComponent(ymi));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}
	
	// заполняем холст непрозрачными белыми пикселями для ускорения последующего рисования
	for (i = 0; i<scale; i++) {
			for (j = 0; j<scale; j++) {
				index = parseInt((i*w + j)*4);
				imageData.data[index+0] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
				imageData.data[index+3] = 255;
			}
		}
	ctx.putImageData(imageData,0,0);

	iterations.onchange = function () {
		N = document.getElementById('number_it').value;
	}

	butt.onclick = function () {
		var dataURL = cnv.toDataURL("image/png");
		var link = document.createElement("a");
		document.body.appendChild(link); 
		link.href = dataURL;
		link.download = "my-image-name.png";
		link.click();
		document.body.removeChild(link);
		var filename = 'a11='+String(a_11)+' a12='+String(a_12)+' a_21='+String(a_21)+' a_22='+String(a_22)+' .txt';
		download(filename,X,Y,RGB,x_min,x_max,y_min,a_11,a_12,a_21,a_22); 
	}
	update.onclick = function () { clearcanv(); upd = true;
	control();
	}
	a11.onchange = function() {
		a_11 = parseFloat(document.getElementById('a11').value);
		document.getElementById('num').value = 0;
		angle = 0;
	}
	a12.onchange = function() {
		a_12 = parseFloat(document.getElementById('a12').value);
		document.getElementById('num').value = 0;
		angle = 0;
	}
	a21.onchange = function() {
		a_21 = parseFloat(document.getElementById('a21').value);
		document.getElementById('num').value = 0;
		angle = 0;
	}
	a22.onchange = function() {
		a_22 = parseFloat(document.getElementById('a22').value);
		document.getElementById('num').value = 0;
		angle = 0;
	}

	cnv.onmousedown = function() {
		var zoom = document.getElementById('zoom_check');
		if (!zoom.checked) {
		var rect = cnv.getBoundingClientRect();
		if (z != 1) {
			z2 = x_max - x_min;
			x = x_min + (event.clientX - rect.left)*z2/scale;
			y = y_min + (event.clientY - rect.top)*z2/scale;
		} else {
			x = (event.clientX - rect.left)/scale;
			y = (event.clientY - rect.top)/scale;
		}
		clear = document.getElementsByName('clear_rect');
		if (clear[0].checked == true) {
			clearcanv();
		}
		rgbpush();
		X.push(x);
		Y.push(y);
		control();
		} else { 
		var rect = cnv.getBoundingClientRect();
		z2 = x_max - x_min;
		x_oldmin = x_min*scale;
		y_oldmin = y_min*scale;
		x_oldmax = x_max*scale;
		y_oldmax = y_max*scale;
		x_min = (event.clientX - rect.left)*z2 + x_oldmin;
		y_min = (event.clientY - rect.top)*z2 + y_oldmin;
		x_relativemin = event.clientX - rect.left;
		y_relativemin = event.clientY - rect.top;
		ctx.beginPath();
		ctx.rect(event.clientX - rect.left,event.clientY - rect.top,1,1);
		ctx.fillStyle = 'blue';
		ctx.fill();
		move = true;
		imageData2 = ctx.getImageData(0,0,w,h);
		}
		
	}

	cnv.onmousemove = function () {
		if (move) {
		ctx.putImageData(imageData2,0,0);
		var rect = cnv.getBoundingClientRect();
		y_move = (event.clientY - rect.top);
		x_move = (y_move-y_relativemin) + x_relativemin;
		ctx.beginPath();
		ctx.rect(x_relativemin,y_relativemin,x_move-x_relativemin,y_move-y_relativemin);
		ctx.stroke();
		}
	}
	
	cnv.onmouseup = function () {
		zoom = document.getElementById('zoom_check');
		if (zoom.checked) { 
		x_relativemax = x_move;
		y_relativemax = y_move;
			y_max = y_move*z2 + y_oldmin;
			x_max = x_move*z2 + x_oldmin;
			x_min = x_min/scale;
			y_min = y_min/scale;
			x_max = x_max/scale;
			y_max = y_max/scale;
			if (x_min > x_max) {
				intermid = x_min;
				x_min = x_max;
				x_max = intermid;
			}
			if (y_min > y_max) { 
				intermid = y_min;
				y_min = y_max;
				y_max = intermid;
			}
			z = z*scale/(x_relativemax - x_relativemin);
			clearcanv ();
			move = false;
			control();
		}

	}
	// функция заполнения массива цветов
	function rgbpush() {
		r = Math.floor(Math.random()*256);
		g = Math.floor(Math.random()*256);
		b = Math.floor(Math.random()*256);
		RGB.push(r);
		RGB.push(g);
		RGB.push(b);
	}
	// функция дробной части F
	function Func (numb) {
		decim = parseFloat(numb) - Math.floor(numb);
		return(decim);
	}
	// расчет координат следующей точки
	function coord() {
		numb1 = a_11*x+a_12*y;
		x = Func(numb1);
		numb2 = a_21*x+a_22*y;
		y = Func(numb2);
	}
	// функция отображение
	function draw() { 
		if ((x>=x_min)&&(x<=x_max)&&(y>=y_min)&&(y<=y_max)) {
				var index = (Math.floor((y-y_min)*z*scale)*w + Math.floor((x-x_min)*z*scale))*4;
				imageData.data[index+0] = r;
				imageData.data[index+1] = g;
				imageData.data[index+2] = b;
			}
	}
	// функция отчистки канваса 
	function clearcanv () {
		for (i = 0; i<scale; i++) {
			for (j = 0; j<scale; j++) {
				var index = parseInt((i*w + j)*4);
				imageData.data[index+0] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
			}
		}
		ctx.putImageData(imageData,0,0);
	}
	
	function control () {
		zoom = document.getElementById('zoom_check');
		if ((zoom.checked)||(upd == true)) {
			numberof = X.length;
			for (m = 0; m<numberof; m++) {
				x = X[m];
				y = Y[m];
				x_o.value = x; y_o.value = y;
				r = Number(RGB[m*3]);
				g = Number(RGB[m*3+1]);
				b = Number(RGB[m*3+2]);
				for (j = 0;j<=N; j++){
				coord();
				draw();
				}
				upd = false;
			}
		} else {
			x_o.value = x; y_o.value = y;
			for (j = 0;j<=N; j++){
				coord();
				draw();
			}
		}
		ctx.putImageData(imageData,0,0);
		document.getElementById('x_minim').value = x_min;
		document.getElementById('y_minim').value = y_min;
		document.getElementById('x_maxim').value = x_max;
		some_span.innerHTML = "Увеличение в "+z.toFixed(1)+" раз";
		zoom.checked = false;
	}

	function set_exp(N_exp) {
		var k = Number(N_exp);
		clearcanv ();
		X = [];
		Y = [];
		RGB = [];
		z = 1;
		z2 = 1;
		x_min = 0; y_min = 0; x_max = 1; y_max = 1; x_oldmin = 0; y_oldmin = 0; x_oldmax = scale; y_oldmax = scale;
		if (N_exp == 1) {X.push(0.46); Y.push(0.63); X.push(0.613); Y.push(0.582); a_11 = 1; 	a_12 = 1;	    a_21 = -0.9;	a_22 = 1; } 
		if (N_exp == 2) {X.push(0.31); Y.push(0.32);  a_11 = 1; 	a_12 = 0.5;	    a_21 = -0.5;	a_22 = 1; }
		if (N_exp == 3) {X.push(0.69); Y.push(0.23); a_11 = 1;   a_12 = 0.1296;	    a_21 = -0.1296;	a_22 = 1; }
		if (N_exp == 4) {a_11 = 1; 	a_12 = 0.5;	    a_21 = -0.5;	a_22 = 1; x_min = 0.6680; y_min = 0.5460; x_max = 0.7240; y_max = 0.6020; randpush(30); }
		if (N_exp == 5) {a_11 = 1; 	a_12 = 0.5;	    a_21 = -0.5;	a_22 = 1; x_min = 0.50; y_min = 0.31; x_max = 0.71; y_max = 0.51; randpush(15);} 	
		if (N_exp == 6) {a_11 = 1; 	a_12 = 0.5;	    a_21 = -0.5;	a_22 = 1; x_min = 0.2757; y_min = 0.3343; x_max = 0.3268; y_max = 0.3854; randpush(15);} 	
		if (N_exp == 7) {X.push(0.15); Y.push(0.63); a_11 = -0.9899924966004454;   a_12 = 0.1411200080598672;	    a_21 = -0.1411200080598672;	a_22 = -0.9899924966004454; }  
		if (N_exp) {
			z = 1/Math.abs(x_max-x_min);
			a11.value = a_11;
			a12.value = a_12; 
			a21.value = a_21;   
			a22.value = a_22;	
			upd = true;
		}
		numberof = X.length;
		for (m=0; m<numberof; m++) {
			rgbpush();
		}
	}	
	num.onchange = function() { set_exp(document.getElementById('num').value); control();}
}