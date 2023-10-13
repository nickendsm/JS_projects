//
//
// Отображения кривых и точек на комплексной плоскости (программа демонстрирует, как работают комплексные функции)
//
//
//
//


window.addEventListener('load',main,false);
function main () { 
	var ctx = cnv1.getContext('2d');
	var w = cnv1.width;
	var h = cnv1.height;
	var ctx2 = cnv2.getContext('2d');
	var w2 = cnv2.width;
	var h2 = cnv2.height;
	var scale = w/2; var scale2 = w/2;
	const N = parseInt(w*w); // количество пикселей 
	var border = 1; // значение на границе канваса( половина стороны квадрата), изначально 1-чный квадрат
	var border2 = 1; // значение на границе второго канваса
	var edge2 = 2*border2;
	var edge = 2*border;

	//
	var move = false; // для отслеживания нажатия на канвас
	// для уменьшения кол-ва итераций
	w_2 = w/2;
	h_2 = h/2;

	// пропишем функцию заполнения imageData белыми пикселями
	function whitening(imageD) { 
		var index;
		for (i = 0; i<w; i++) {
			for (j = 0; j<h; j++) {
				index = parseInt((i*w + j)*4);
				imageD.data[index+0] = 255;
				imageD.data[index+1] = 255;
				imageD.data[index+2] = 255;
				imageD.data[index+3] = 255;
			}
		}
	}
		// заполним холсты непрозрачными белыми пикселями
	var imageData = ctx.createImageData(w,h);
	whitening(imageData);
	ctx.putImageData(imageData,0,0);
	ctx2.putImageData(imageData,0,0);
	delete(imageData);
	
	// введем понятие комплексного числа
	function complex(x,y) { 
		var that = this;
		this.x = x;
		this.y = y;
	}
	// введем операции сложения, умножения, деления
	// c1, c2 - два комплексных числа
	function sum(c1,c2) { 
		return new complex(c1.x+c2.x,c1.y+c2.y);
	}

	function incr(c1,c2) { 
		return new complex(c1.x*c2.x-c1.y*c2.y,c1.x*c2.y+c2.x*c1.y);
	}
	
	function decr(c1,c2) {
		return new complex((c1.x*c2.x+c1.y*c2.y)/(c2.x*c2.x+c2.y*c2.y));
	}
	
	function skal(a,c) { // a - константа, с - комплексное число 
		return new complex (a*c1.x,a*c1.y);
	}
	
	function absC(c) { // модуль комплексного числа
		return Math.pow(c.x*c.x + c.y*c.y,1/2);
	}
	function absC_2(c) { // квадрат модуля, для скорости 
		return c.x*c.x + c.y*c.y;
	}
	//
	// нам нужно масштабирование сделать так, чтобы крайняя точка плоскости попадала на экран, то есть расширение по мере крайней точки плоскости 
	// но это попозже, для начала пропишем функции для выбора 
	// 1 - функция 1/z 
	// 2 - функция Ln(1+z)
	// 3 - функция e^(iz) 
	// 4 - функция cos(z)
	// 5 - функция sin(z)
	// можно сразу прописать эти функции
	function func1 (c) { // 1/z
		var m = absC_2(c)
		return new complex(c.x/m,-c.y/m);
	}
	function func2 (c) { // ln(1+z) - главная ветвь логарифма
		var c1 = new complex(1+c.x,c.y);
		return new complex(Math.log(absC(c1)),Math.asin(c1.y/c1.x));
	}
	function func3 (c) { // e^(iz)
		var e = Math.exp(-c.y);
		return new complex(e*Math.cos(c.x),e*Math.sin(c.x));
	}
	function func4 (c) {
		var e1 = Math.exp(-c.y);
		var e2 = Math.exp(c.y);
		return new complex(Math.cos(c.x)*(e1+e2)/2,Math.sin(c.x)*(e1-e2)/2);
	}
	function func5 (c) {
		var e1 = Math.exp(-c.y);
		var e2 = Math.exp(c.y);
		return new complex(Math.cos(c.x)*(e1-e2)/2,Math.sin(c.x)*(e1+e2)/2);
	}
	// теперь еще пропишем базовые области
	// 1 - окружность радиуса R
	// 2 - круг радиуса R с границей/без
	// 3 - действительная ось,
	// 4 - мнимая ось
	// 5 - верхняя полупл.
	// 6 - нижняя полупл
	// функция изменения w
	scl.oninput = function () { // смена масштаба
		// надо перерисовать точки на основном холсте и перерисовать оси
		// надо взять номер функции, взять номер области, если область не 0 эксп, то просто построить стандартную область с учетом масштаба и размеров
		var fun = funcs.value;
		var are = areas.value;
		var new_border = parseInt(scl.value); // граничная точка
		var edge2 = parseFloat(2*new_border);
		if (are == 0) { // произвольная область
			// тогда идем по всем пикселям левого канваса, пересчитываем
			// сначала надо получить imagedata с канваса
			var px; var py;
			// var xx; var yy;
			var imgD1 = ctx.getImageData(0,0,w,h);
			var imageD1 = ctx.createImageData(w,h);
			whitening(imageD1);
			for (i = 0; i<w; i++) {
				for (j = 0; j<h; j++) {
					index = parseInt((i*w + j)*4);
					if (imgD1.data[index] == 0) { // значит закрашена
						// узнаем ее координату с учетом масштаба
						// теперь должны пересчитать на обоих холстах с учетом масштаба
						// сначала рисуем на первом холсте с учетом new_border
						px = parseInt((j*edge - border*w)/edge2 + w_2);
						py = parseInt((i*edge - border*h)/edge2 + w_2);
						// это мы получили номера пикселей по иксу и по игрику теперь заполним imageD1
						index = parseInt((py*w + px)*4);
						imageD1.data[index+0] = 0;
						imageD1.data[index+1] = 0;
						imageD1.data[index+2] = 0;
					}
				}
			}
			// после того как прошлись по всем точкам, вставить imageD1 в первый канвас
			ctx.putImageData(imageD1,0,0);
		// если область 0, то надо пройтись по точкам первой области, запихнуть их в новую imagedata и потом построить с учетом масштаба
		// также нужна функция масштабирования на втором канвасе по мере заполнения точек, на случай если точка вылезает за пределы области
	
		// а потом перерисовать точки на втором холсте 
		}
		edge = edge2; 
		border = new_border; 
		axes1();
	}
	funcs.onchange = function () { // если меняем вид функции
		// очищаем канвасы
		var n = funcs.value;
		clearcanv(ctx);
		clearcanv(ctx2);
		var imageData = ctx.createImageData(w,h);
		whitening(imageData);
		ctx.putImageData(imageData,0,0);
		ctx2.putImageData(imageData,0,0);
		axes1();
		axes2();
	}
	function redraw(xe,ye) { // перерисовываем точки второго канваса из-за того, что у нас точка вышла за границы области
		// (xe,ye) - точка, выходящая за канвас, будем расширять канвас по ней
		// то есть x или y будет новым border
		var new_border2; var new_edge2;
		var mx = Math.abs(xe); var my = Math.abs(ye);
		if (mx > my) { new_border2 = mx + 1;} else {new_border2 = my + 1;}
		new_edge2 = new_border2*2;
		// теперь надо перерисовать все точки правого канваса на новом масштабе
		// сначала надо получить imagedata с канваса
		var px; var py;
		var imgD2 = ctx2.getImageData(0,0,w,h);
		var imageD2 = ctx2.createImageData(w,h);
		whitening(imageD2);
		for (i = 0; i<w; i++) {
			for (j = 0; j<h; j++) {
				index = parseInt((i*w + j)*4);
				if (imgD2.data[index] == 0) { // значит закрашена
					px = parseInt((j*edge2 - border2*w)/new_edge2 + w_2);
					py = parseInt((i*edge2 - border2*h)/new_edge2 + w_2);
					// это мы получили номера пикселей по иксу и по игрику теперь заполним imageD1
					index = parseInt((py*w + px)*4);
					imageD2.data[index+0] = 0;
					imageD2.data[index+1] = 0;
					imageD2.data[index+2] = 0;
				}
			}
		}
		x_cur =	parseInt(xe/new_edge2*w + w_2);
		y_cur =	parseInt(w_2 - ye/new_edge2*w);
		index = parseInt((y_cur*w + x_cur)*4);
		imageD2.data[index+0] = 0;
		imageD2.data[index+1] = 0;
		imageD2.data[index+2] = 0;
		// после того как прошлись по всем точкам, вставить imageD1 в первый канвас
		clearcanv(ctx2);
		ctx2.putImageData(imageD2,0,0);
		// переобозначаем
		edge2 = new_edge2; border2 = new_border2;
		axes2();
	
	}
		
	function render_one(f,x,y) { // переносит по одному пикселю 
		var om;	var x_cur; var y_cur;
		var x1 = x/w*edge - border;
		var y1 = border - y/w*edge;
		if (f == 3) { 
			// нам надо получить u,v новой точки на второй плоскости 
			om = func3(new complex(x1,y1));
		}
		if (f == 2) { 
			// нам надо получить u,v новой точки на второй плоскости 
			om = func2(new complex(x1,y1));
		}
		if (f == 1) { 
			// нам надо получить u,v новой точки на второй плоскости 
			om = func1(new complex(x1,y1));
		}
		if (f == 4) { 
			// нам надо получить u,v новой точки на второй плоскости 
			om = func4(new complex(x1,y1));
		}
		if (f == 5) { 
			// нам надо получить u,v новой точки на второй плоскости 
			om = func5(new complex(x1,y1));
		}
		// теперь изобразим эту точку, сначала на первом холсте
		// мы знаем номера пикселей, поэтому можем просто закрасить 
		// ctx.beginPath();
		// ctx.rect(x,y,1,1);
		// ctx.stroke();
		var imgD1 = ctx.getImageData(0,0,w,h);
		index = parseInt((y*w + x)*4);
		imgD1.data[index+0] = 0;
		imgD1.data[index+1] = 0;
		imgD1.data[index+2] = 0;
		ctx.putImageData(imgD1,0,0);
		// теперь рисуем на втором
		// но если у нас точка выходит за границы, то надо перерисовать оси в новом масштабе и перерисовать точки в этом масштабе
		if ((om.x >= border2) || (om.y >= border2) || (om.x <= -border2) || (om.y <= -border2)) {
			redraw(om.x,om.y);
		} else { 
			x_cur =	parseInt(om.x/edge2*w + w_2);
			y_cur =	parseInt(w_2 - om.y/edge2*w);
			// ctx2.beginPath();
			// ctx2.rect(x_cur,y_cur,1,1);
			// ctx2.stroke();
			var imgD2 = ctx2.getImageData(0,0,w,h);
			index = parseInt((y_cur*w + x_cur)*4);
			imgD2.data[index+0] = 0;
			imgD2.data[index+1] = 0;
			imgD2.data[index+2] = 0;
			ctx2.putImageData(imgD2,0,0);
		}
	
	}

	function axes1() { 
		// пусть будет по 4 отсечки на оси, будут меняться только числа на них 
		ctx.lineWidth = 2; 
		ctx.moveTo(0,h_2);
		ctx.lineTo(w,h_2);
		ctx.strokeStyle = 'grey';
		ctx.stroke();
		ctx.moveTo(w_2,h);
		ctx.lineTo(w_2,0);
		ctx.stroke();
		// нарисуем стрелочки 
		ctx.moveTo(w_2,1);
		ctx.lineTo(w_2 - 4, 9);
		ctx.stroke();
		ctx.moveTo(w_2,1);
		ctx.lineTo(w_2 + 4, 9);
		ctx.stroke();
		ctx.moveTo(w - 1,h_2);
		ctx.lineTo(w - 9,h_2 - 4);
		ctx.stroke();
		ctx.moveTo(w - 1,h_2);
		ctx.lineTo(w - 9,h_2 + 4);
		ctx.stroke();
		// подписываем оси 
		ctx.fillStyle = "rgb(1,1,1)";
		ctx.font = '16px Arial';
		ctx.fillText('Y',w_2 - 19,15);
		ctx.fillText('X',w - 15,h_2 + 22);
		// рисуем отсечки 
		ctx.lineWidth = 1;
		ctx.font = '11px Arial';
		var step = w/6;
		var temp; var y_temp; 
		// нарисуем ноль 
		ctx.fillText('0',w_2 - 10,h_2 + 12);
		ctx.fillText(parseFloat(border).toFixed(2),w_2 + 10,15);
		ctx.fillText(parseFloat(border).toFixed(2),w - 25, h_2 -10);
		for (var i = 1; i<=2; i++) {
			temp = step*i;
			y_temp = border - temp/h*edge;
			ctx.moveTo(w_2 - 5, temp);
			ctx.lineTo(w_2 + 5, temp);
			ctx.stroke();
			ctx.fillText(parseFloat(y_temp).toFixed(2),w_2 + 10,temp + 3);
			y_temp = temp/w*edge - border;
			ctx.moveTo(temp, h_2 - 5);
			ctx.lineTo(temp, h_2 + 5);
			ctx.stroke();
			ctx.fillText(parseFloat(y_temp).toFixed(2),temp - 5,h_2 - 10);
		}
		for (var i = 4; i<=5; i++) {
			temp = step*i;
			y_temp = border - temp/h*edge;
			ctx.moveTo(w_2 - 5, temp);
			ctx.lineTo(w_2 + 5, temp);
			ctx.stroke();
			ctx.fillText(parseFloat(y_temp).toFixed(2),w_2 + 10,temp + 3);
			y_temp = temp/w*edge - border;
			ctx.moveTo(temp, h_2 - 5);
			ctx.lineTo(temp, h_2 + 5);
			ctx.stroke();
			ctx.fillText(parseFloat(y_temp).toFixed(2),temp - 5,h_2 - 10);
		}
		ctx.fillText(parseFloat(-border).toFixed(2),w_2 + 10,h - 5);
		ctx.fillText(parseFloat(-border).toFixed(2),5 , h_2 -10);
		ctx.strokeStyle = 'black';
	}
	function axes2() {
		ctx2.strokeStyle = 'grey';
		ctx2.lineWidth = 2; 
		ctx2.moveTo(0,h_2);
		ctx2.lineTo(w,h_2);
		ctx2.stroke();
		ctx2.moveTo(w_2,h);
		ctx2.lineTo(w_2,0);
		ctx2.stroke();
		// нарисуем стрелочки 
		ctx2.moveTo(w_2,1);
		ctx2.lineTo(w_2 - 4, 9);
		ctx2.stroke();
		ctx2.moveTo(w_2,1);
		ctx2.lineTo(w_2 + 4, 9);
		ctx2.stroke();
		ctx2.moveTo(w - 1,h_2);
		ctx2.lineTo(w - 9,h_2 - 4);
		ctx2.stroke();
		ctx2.moveTo(w - 1,h_2);
		ctx2.lineTo(w - 9,h_2 + 4);
		ctx2.stroke();
		// подписываем оси 
		ctx2.fillStyle = "rgb(1,1,1)";
		ctx2.font = '16px Arial';
		ctx2.fillText('V',w_2 - 19,15);
		ctx2.fillText('U',w - 15,h_2 + 22);
		// рисуем отсечки 
		ctx2.lineWidth = 1;
		ctx2.font = '11px Arial';
		var step = w/6;
		var temp; var y_temp; 
		// нарисуем ноль 
		ctx2.fillText('0',w_2 - 10,h_2 + 12);
		ctx2.fillText(parseFloat(border2).toFixed(2),w_2 + 10,15);
		ctx2.fillText(parseFloat(border2).toFixed(2),w - 25, h_2 -10);
		for (var i = 1; i<=2; i++) {
			temp = step*i;
			y_temp = border2 - temp/h*edge2;
			ctx2.moveTo(w_2 - 5, temp);
			ctx2.lineTo(w_2 + 5, temp);
			ctx2.stroke();
			ctx2.fillText(parseFloat(y_temp).toFixed(2),w_2 + 10,temp + 3);
			y_temp = temp/w*edge2 - border2;
			ctx2.moveTo(temp, h_2 - 5);
			ctx2.lineTo(temp, h_2 + 5);
			ctx2.stroke();
			ctx2.fillText(parseFloat(y_temp).toFixed(2),temp - 5,h_2 - 10);
		}
		for (var i = 4; i<=5; i++) {
			temp = step*i;
			y_temp = border2 - temp/h*edge2;
			ctx2.moveTo(w_2 - 5, temp);
			ctx2.lineTo(w_2 + 5, temp);
			ctx2.stroke();
			ctx2.fillText(parseFloat(y_temp).toFixed(2),w_2 + 10,temp + 3);
			y_temp = temp/w*edge2 - border2;
			ctx2.moveTo(temp, h_2 - 5);
			ctx2.lineTo(temp, h_2 + 5);
			ctx2.stroke();
			ctx2.fillText(parseFloat(y_temp).toFixed(2),temp - 5,h_2 - 10);
		}
		ctx2.fillText(parseFloat(-border2).toFixed(2),w_2 + 10,h - 5);
		ctx2.fillText(parseFloat(-border2).toFixed(2),5 , h_2 -10);
		ctx2.strokeStyle = 'black';
	}
	cnv1.onmousedown = function () { 
		// рисование будет работать, если выбран 1 эксперимент, а не базовая кривая
		if (areas.value == 0) { 
			let z = window.getComputedStyle(cnv1).zoom;     
			rect = cnv1.getBoundingClientRect();
			var px = event.clientX/z - rect.left;
			var py = event.clientY/z - rect.top;
			// px = 150;
			// py = 150;
			f = funcs.value; // номер функции
			// нам надо просто закрасить эту точку на первом холсте, а также закрасить на втором
			render_one(f,px,py);
			move = true;
		}
	}
	cnv1.onmousemove = function () { 
		if (move == true) {
			let z = window.getComputedStyle(cnv1).zoom;     
			var px = event.clientX/z - rect.left;
			var py = event.clientY/z - rect.top;
			// px = 150;
			// py = 150;
			render_one(f,px,py);
		}
	}
	cnv1.onmouseup = function () { 
		move = false;
	}
	function clearcanv (canv) {
		var imageData = canv.createImageData(w,h);
		for (i = 0; i<w; i++) {
			for (j = 0; j<w; j++) {
				index = parseInt((i*w + j)*4);
				imageData.data[index+0] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
			}
		}
		canv.putImageData(imageData,0,0);
	}
		

	// для 1 отображения нужно задать радиус, поэтому будет текстовое поле с радиусом, а также смещение по икс и по y
	axes1();
	axes2();
	
		
	
	
	
}