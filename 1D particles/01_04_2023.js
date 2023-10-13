window.addEventListener('load',main,false);
function main () {
		var mathMethods = Object.getOwnPropertyNames(Math);
	for (var k in mathMethods)
		this[mathMethods[k]] = Math[mathMethods[k]];
		var M = Math;
	// canvases
	// particles draw
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
	//
	// CONSTS
	//
	var wholeLen;
	const C = 100; // жесткость пружин
	const c1 = M.pow(C/1,1/2);
	const c2 = M.pow(C/2,1/2);
	const gamma = M.pow(2,1/2);
	const CONST1 = M.pow(1-gamma,2)/M.pow(1+gamma,2);
	const CONST2 = 4*gamma/M.pow(1+gamma,2);
	var y = h/2; // for center draw
	var E1,E2;
	var t = 0;
	var dt0 = 2*Math.PI*Math.pow(1/C,0.5); // шаг по времени
	var fps = 120;
	var y_scale = 10;
	// объекты html(интерфейс
	var fps_value = document.getElementById('fps_range');
	// переменные
	var speedy = document.getElementById('speed');
	var sp = speedy.value;
	var dt = sp*dt0;
	spd.innerHTML = sp;
	var partcls = []; // массив частиц
	// var partclsB = []; // для решения через ф бесселя
	var move = false;
	var time = 0;
	var spp = 1;
	var howOfP = document.getElementById('HOP').value;
	var ioio = 0;
	Massive = [];
	var XPLUS1 = []; // массив квазичастиц
	var XMINUS1 = [];
	var XPLUS2 = [];
	var XMINUS2 = [];
	var value = 0;
	var flag = 0;
	
	OUTenerg.onclick = function () { 
		countWholeEnergy();
		console.log(ENE1,ENE2);
	}
	function getMaxOfArray(numArray) {
	  return Math.max.apply(null, numArray);
	}
	Pause.onclick = function () { switchdt();}
	simple.onclick = function () { simplify(); console.log('New: '+countWholeCount(XPLUS1,XPLUS2,XMINUS1,XMINUS2) + 'time: '+time);}
	function switchdt() {
		switch (flag) {
			case 0: {
				flag = 1;
				sp = 0;
				spp = 0;
				break;
			}
			case 1: {
				flag = 0;
				sp = speed.value;
				spp = 1;

			}
		}
	}
	
	function generateP_ravn(num1,num2) { 
		var rad = w/2/num1;
		var rad_2_1 = rad/2;
		var b,co;
		for (var k = 0; k < num1; k++) {
			b = []; b.x = rad*k + rad_2_1;
			b.en = E1; 
			// b.en = 'E';
			// co = []; co.x = rad*k + rad_2_1; co.en = E1; 
			XPLUS1[k] = b;
			// XMINUS1[k] = co;
		}
		rad = w/2/num2;
		var rad_2_2 = rad/2;
		var b,co;
		for (var k = 0; k < num2; k++) {
			// b = []; b.x = 500 + rad*k + rad_2_2; b.en = 0; 
			co = []; co.x = 500 + rad*k + rad_2_2; co.en = 0; 
			// XPLUS2[k] = b;
			XMINUS2[k] = co;
		}
		return [rad_2_1,rad_2_2]; // возвращает два радиуса
	}
	
	HOP.onchange = function () { 
		howOfP = parseInt(HOP.value);
		clearint(interv);
		if (howOfP != 1) {interv = setInterval(control_sec,1000/fps);} else {interv = setInterval(control,1000/fps);} 
	}			
			
	speed.oninput = function () {
		if (flag != 1) {
			sp = parseFloat(speedy.value);
			spd.innerHTML = sp;
		}
	}
	fps_range.oninput = function () { 
		if (flag != 1) {
			fps = fps_value.value;
			howof.innerHTML = fps;
			clearint(interv);
			if (howOfP != 1) { interv = setInterval(control_sec,1000/fps);} else { interv = setInterval(control,1000/fps);}
		}
	}
	function getlen(a,b,c,d){
		return [a.length,b.length,c.length,d.length];
	}
	// function genParticle(NUM, polar, coord) { // номер зоны, в которую попала частица, направление скорости, координата частицы
		// у нас есть 0,1,2,3 зоны
		// рассмотрим все случаи
		// если частица попадает в 0 зону, это может быть только частица XPLUS2, пришедшая слева
		// если частица оказалась в 1 зоне, то это может быть только частица XMINUS2, пришедшая справа
		// если частица оказалась во 2 зоне, то это может быть только частица XPLUS1, пришедшая слева
		// если частица оказалась в 3 зоне, то это может быть только частица XMINUS1, пришедшая справа
		
		
	// }
	// функция добавления частиц
	function addPLUS1(coord, eng) {
		var b = [];
		b.x = coord; b.en = eng;
		XPLUS1.push(b);
	}
	function addPLUS2(coord, eng) {
		var b = [];
		b.x = coord; b.en = eng;
		XPLUS2.push(b);
	}
	function addMINUS1(coord, eng) {
		var b = [];
		b.x = coord; b.en = eng;
		XMINUS1.push(b);
	}
	function addMINUS2(coord, eng) {
		var b = [];
		b.x = coord; b.en = eng;
		XMINUS2.push(b);
	}
	var numdel = 500;
	function simplify() { 
		// бьем каждый промежуток на точки 
		var j = 0;
		var ene = 0;
		var step = w/2/numdel; // количество пикселей в отрезке
		var step2 = step/2;
		var crd;
		for (var i = 1; i<=numdel-1; i++) {
			// ЛЕВАЯ ЧАСТЬ ЦЕПОЧКИ
			// идем по частицам, бегущим вправо 
			ene = 0;
			j = 0;
			crd = i*step;
			while (XPLUS1[j] != undefined) {
				if (Math.abs(XPLUS1[j].x - crd) <= step2) { 
					// тогда берем ее энергию 
					ene += XPLUS1[j].en;
					// удаляем частицу
					XPLUS1.splice(j,1);
				}
				j++;
			}
			// теперь добавляем частицу с суммарной энергией
			if (ene) { 
				addPLUS1(crd,ene);
			}
			// идем по частицам, бегущим влево
			ene = 0;
			j = 0;
			while (XMINUS1[j] != undefined) {
				if (Math.abs(XMINUS1[j].x - crd) <= step2) { 
					// тогда берем ее энергию 
					ene += XMINUS1[j].en;
					// удаляем частицу
					XMINUS1.splice(j,1);
				}
				j++;
			}
			// теперь добавляем частицу с суммарной энергией
			if (ene) {
				addMINUS1(crd,ene);
			}
			//
			// ПРАВАЯ ЧАСТЬ ЦЕПОЧКИ, тоже самое
			crd = crd + w/2;
			ene = 0;
			j = 0;
			while (XPLUS2[j] != undefined) {
				if (Math.abs(XPLUS2[j].x - crd) <= step2) { 
					// тогда берем ее энергию 
					ene += XPLUS2[j].en;
					// удаляем частицу
					XPLUS2.splice(j,1);
				}
				j++;
			}
			if (ene) { 
				addPLUS2(crd,ene);
			}
			ene = 0;
			j = 0;
			while (XMINUS2[j] != undefined) {
				if (Math.abs(XMINUS2[j].x - crd) <= step2) { 
					// тогда берем ее энергию 
					ene += XMINUS2[j].en;
					// удаляем частицу
					XMINUS2.splice(j,1);
				}
				j++;
			}
			if (ene) { 
				addMINUS2(crd,ene);
			}
		}
	
	}
	var X1 = [];
	var X2 = [];
	var WHOLECOUNT1 = [];
	var WHOLECOUNT2 = [];
	var maxCount1 = 0; // для масштабирования
	var maxCount2 = 0; // для масштабирования 
	var step = w/2/numdel; // количество пикселей в отрезке
	var step2 = step/2;
	var crd;
	var NUMBER = 0;
	for (var j = 0; j < numdel-1; j++) { 
		X1.push(j*step);
		X2.push(j*step+w/2);
		WHOLECOUNT1.push(0);
		WHOLECOUNT2.push(0);
	}
	
	function countPartcls() { 
		// бьем каждый промежуток на точки 
		var j = 0;
		WHOLECOUNT1 = [];
		WHOLECOUNT2 = [];
		for (var i = 1; i<=numdel-1; i++) {
			// ЛЕВАЯ ЧАСТЬ ЦЕПОЧКИ
			// идем по частицам, бегущим вправо 
			NUMBER = 0;
			j = 0;
			while (XPLUS1[j] != undefined) {
				if (Math.abs(XPLUS1[j].x - X1[i-1]) < step2) { 
					// тогда берем ее энергию 
					NUMBER += 1;
				}
				j++;
			}
			j = 0;
			while (XMINUS1[j] != undefined) {
				if (Math.abs(XMINUS1[j].x - X1[i-1]) < step2) { 
					// тогда берем ее энергию 
					NUMBER += 1;
				}
				j++;
			}
			WHOLECOUNT1.push(NUMBER);
			// теперь сразу в правой части 
			crd = crd + w/2;
			NUMBER = 0;
			j = 0;
			while (XPLUS2[j] != undefined) {
				if (Math.abs(XPLUS2[j].x - X2[i-1]) <= step2) { 
					NUMBER += 1;
				}
				j++;
			}
			j = 0;
			while (XMINUS2[j] != undefined) {
				if (Math.abs(XMINUS2[j].x - X2[i-1]) <= step2) { 
					NUMBER += 1;
				}
				j++;
			}
			WHOLECOUNT2.push(NUMBER);
		}
		// теперь найдем макс элемент слева и справа, чтобы масштабировать 
		maxCount1 = getMaxOfArray(WHOLECOUNT1);
		maxCount2 = getMaxOfArray(WHOLECOUNT2);
	}
	function drawCount () { // функция, которая рисует профиль функции распределения частиц, отмасштабированной по максимальному значению
		ctx.beginPath();
		ctx.moveTo(0,h);
		// сначала в левой части, потом в правой
		for (var k = 0; k< numdel-1; k++) { 
			ctx.lineTo(X1[k],h - WHOLECOUNT1[k]/maxCount1*h/2);
			// console.log(X1[k],maxCount1);
		}
		ctx.stroke();
		// теперь в правой части
		ctx.moveTo(w/2,h);
		for (var k = 0; k< numdel-1; k++) { 
			ctx.lineTo(X2[k],h - WHOLECOUNT2[k]/maxCount2*h/2);
		}
		ctx.stroke();
	}
	
	function phys() {
		t += dt;
		dt = dt0*sp;
		// сначала идем по XPLUS1
		physPlus_i(XPLUS1, c1);
		// теперь по XMINUS1
		physMinus_i(XMINUS1, c1);
		// теперь по XPLUS2
		physPlus_i(XPLUS2, c2);
		// теперь по XMINUS2
		physMinus_i(XMINUS2, c2);
		var k = 0;
		// теперь, когда посчитали новые иксы, должны понять, к какой части цепочки они относятся
		while (XPLUS1[k] != undefined) {
			if (XPLUS1[k].x > 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				// XPLUS2.push(XPLUS1[k]);
				// XPLUS1.splice(k,1);
				
				// то тогда 
				// 1) генерируем частицу в зоне 1 в массива XMINUS1
				// 2) уменьшаем энергию ДАННОЙ частицы
				// 3) добавляем ее в массив XPLUS2
				// 4) удаляем из массива XPLUS1
				// реализация:
				// 1)
				addMINUS1(w - XPLUS1[k].x, XPLUS1[k].en*CONST1);
				// 2)
				XPLUS1[k].en *= CONST2;
				// 3) 
				XPLUS2.push(XPLUS1[k]);
				// 4)
				XPLUS1.splice(k,1);
			}
			k++;
		}
		k = 0;
		while (XMINUS1[k] != undefined) {
			if (XMINUS1[k].x > 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				// XMINUS2.push(XMINUS1[k]);
				// XMINUS1.splice(k,1);
				
				// 1) генерируем частицу в зоне 0 в массива XPLUS1
				// 2) уменьшаем энергию ДАННОЙ частицы
				// 3) добавляем ее в массив XMINUS2
				// 4) удаляем из массива XMINUS1
				addPLUS1(M.abs(w - XMINUS1[k].x), XMINUS1[k].en*CONST1);
				// 2)
				XMINUS1[k].en *= CONST2;
				// 3) 
				XMINUS2.push(XMINUS1[k]);
				// 4)
				XMINUS1.splice(k,1);
			}
			k++;
		}
		k = 0;
		while (XPLUS2[k] != undefined) {
			if (XPLUS2[k].x <= 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				// XPLUS1.push(XPLUS2[k]);
				// XPLUS2.splice(k,1);
				
				// 1) генерируем частицу в зоне 3 в массива XMINUS2
				// 2) уменьшаем энергию ДАННОЙ частицы
				// 3) добавляем ее в массив XPLUS1
				// 4) удаляем из массива XPLUS2
				addMINUS2(w - XPLUS2[k].x, XPLUS2[k].en*CONST1);
				// 2)
				XPLUS2[k].en *= CONST2;
				// 3) 
				XPLUS1.push(XPLUS2[k]);
				// 4)
				XPLUS2.splice(k,1);
			}
			k++;
		}
		k = 0;
		while (XMINUS2[k] != undefined) {
			if (XMINUS2[k].x <= 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				// XMINUS1.push(XMINUS2[k]);
				// XMINUS2.splice(k,1);
								
				// 1) генерируем частицу в зоне 2 в массива XPLUS2
				// 2) уменьшаем энергию ДАННОЙ частицы
				// 3) добавляем ее в массив XMINUS1
				// 4) удаляем из массива XMINUS2
				addPLUS2(w - XMINUS2[k].x, XMINUS2[k].en*CONST1);
				// 2) 
				XMINUS2[k].en *= CONST2;
				// 3) 
				XMINUS1.push(XMINUS2[k]);
				// 4)
				XMINUS2.splice(k,1);
			}
			k++;
		}
		// теперь можно посчитать энергию в каждой части
		// countWholeEnergy();
		// wholeLen = countWholeCount(XPLUS1,XMINUS1,XPLUS2,XMINUS2);
		// res = getlen(XPLUS1,XMINUS1,XPLUS2,XMINUS2);
		// теперь, мы правильно поняли в какой части находятся частицы, можем посчитать энергию в каждой части цепочки
		// ENE1 = (res[0] + res[1])*E1;
		// ENE2 = (res[2] + res[3])*E2;
		// проверяем сколько частиц бегает
		// const sum = res.reduce((partialSum, a) => partialSum + a, 0);
		// console.log(sum); // 6
	}
	function countWholeCount(a,b,c,d) { 
		return a.length+b.length+c.length+d.length;
	}
	function countWholeEnergy() {
		ENE1 = parseFloat(wholeEnerg(XPLUS1) + wholeEnerg(XMINUS1));
		ENE2 = parseFloat(wholeEnerg(XPLUS2) + wholeEnerg(XMINUS2));
		// console.log(ENE1+ENE2);
	}
	function wholeEnerg(mass) { 
		var reslt = 0;
		var i = 0;
		while (mass[i] != undefined) {
			reslt += mass[i].en;
			i++;
		}
		return reslt;
	}
	function countEnergL() {
		MassiveL = [];
		for (var i = 0; i<XPLUS1.length; i++) { 
			MassiveL.push(XPLUS1[i].en);
		}
		for (var i = 0; i<XMINUS1.length; i++) { 
			MassiveL.push(XMINUS1[i].en);
		}
		return MassiveL;
	}
	function countEnergR() {
		MassiveR = [];
		for (var i = 0; i<XPLUS2.length; i++) { 
			MassiveR.push(XPLUS2[i].en);
		}
		for (var i = 0; i<XMINUS2.length; i++) { 
			MassiveR.push(XMINUS2[i].en);
		}
		return MassiveR;
	}
	function writeEnerg() {
		// рисуем график движения энергетического центра 
		// сначала отрисовываем оси
		if (time == 55000) {
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(Massive) +"\n");
		  var namewrite = '_Energy_'+String(time)+'.txt';
		  element.setAttribute('download', namewrite);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		  // console.log(res1,res2);
		}
		time += spp*1;
		countWholeEnergy();
		Massive.push(ENE1-ENE2);
		// Massive.push(wholeLen);
		
		
	}
	BUTTSAVE.onclick = function () {
		  // res1 = countEnergL();
		  // res2 = countEnergR();
		  // ioio++;
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(Massive) +"\n");
		  var namewrite = '_Energy_'+String(time)+'.txt';
		  element.setAttribute('download', namewrite);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		  // console.log(res1,res2);
	}
	const radd = 5;
	function drawLine() { 
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(w/2,0);
		ctx.lineTo(w/2,h);
		ctx.stroke();
	}
	function draw() {
		ctx.clearRect(0,0,w,h);
		var k = 0;
		while (XPLUS1[k] != undefined) {
			ctx.beginPath();
			ctx.arc(XPLUS1[k].x, 125, radd, 0, 2*M.PI);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
			k++;
		}
		k = 0;
		while (XMINUS1[k] != undefined) {
			ctx.beginPath();	
			ctx.arc(XMINUS1[k].x, 125, radd, 0, 2*M.PI);
			ctx.strokeStyle = 'red';
			ctx.stroke();
			k++;
		}
		k = 0;
		while (XPLUS2[k] != undefined) {
			ctx.beginPath();
			ctx.arc(XPLUS2[k].x, 125, radd, 0, 2*M.PI);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
			k++;
		}
		k = 0;
		while (XMINUS2[k] != undefined) {
			ctx.beginPath();
			ctx.arc(XMINUS2[k].x, 125, radd, 0, 2*M.PI);
			ctx.strokeStyle = 'red';
			ctx.stroke();
			k++;
		}
	}
	function clearint(interv) { 
		clearInterval(interv);
	}

	function control() {
		phys();
		draw();
		drawLine();
		// countPartcls();
		// drawCount();
		// console.log(WHOLECOUNT1,WHOLECOUNT2);
		writeEnerg();
		if (time % 30 == 0) { 
			simplify();
			console.log('New: '+countWholeCount(XPLUS1,XPLUS2,XMINUS1,XMINUS2) + 'time: '+time);
		}
	}
	function physPlus_i(massive, c) { 
		var k = 0;
		while (massive[k] != undefined) { 
			massive[k].x = (massive[k].x + c*dt) % w ;
			k++;
		}
	}
	function physMinus_i(massive, c) { 
		var k = 0;
		while (massive[k] != undefined) { 
			massive[k].x -= c*dt;
			massive[k].x += (massive[k].x >= 0) ? 0 : w;
			k++;
		}
	}
	function generateRandomParticles(Massive1, Massive2, num,leftG,rightG,ENERG) { 
		// генерирует рандомно частицы с рандомной энергией
		for (var i = 0; i<num; i++) { 
			var b = [];
			var co = [];
			var x = leftG + (rightG-leftG)*M.random();
			var eng = ENERG; // пробуем поделить на два, так как учитываем что волна распадается на две
			b.x = x;
			b.en = eng;
			co.x = x;
			co.en = eng;
			Massive1[i] = b;
			Massive2[i] = co;
		}
	}
	function set_exp() {
		// var numr1 = 996; var numr2 = 1408;
		var numr1 = 50; var numr2 = 100;
		E1 = 1;
		E2 = 1;
		generateRandomParticles(XPLUS1,XMINUS1, 1, 0,500 ,E1);
		// generateRandomParticles(XPLUS2,XMINUS2, numr2, 500,1000, E2);
		// generateRandomParticles(XPLUS1,XMINUS1, numr1, 0,500 ,E1);
		// считаем b1
		// b1 = 500/numr1;
		// b2 = 500/numr2;
		// E2 = c1/c2*b2/b1*E1;
		// когда выяснили какая E2, можем ее присвоить начальным частицам
		// for (var k = 0; k < numr2; k++) {
			// XPLUS2[k].en = E2;
			// XMINUS2[k].en = E2;
		// }
		// draw();
		// countWholeEnergy();
		// console.log(ENE2/ENE1);
		// попробуем задать нормальные начальные условия, например задать количество частиц по синусу 
		// GenRasp1(300,400,10);
		
	}
	function GenRasp1(cord1,cord2,AMP) { // делает начальное распределение по cos - 1 , cord1,cord2 - промежуток, AMP - амплитуда
		var NUMB = 0;
		
		for (var i = 300; i< 400; i++) { 
			ans = AMP*(1 - Math.sin(2*Math.PI*(X1[i] - (cord1+cord2)/2)/(cord1-cord2)));
			if (ans > 1) { 
				// значит должны задать сколько-то
				// console.log(ans);
				NUMB = Math.floor(ans);

				for (var l = 0; l < NUMB; l++) { 
					addPLUS1(X1[i],1); // добавляет бегущие вправо
				}
			}
		}
		// console.log(XPLUS1);
	}
	
	set_exp();
	interv = setInterval(control,1000/fps);
}