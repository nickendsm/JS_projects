//
//
//
// Задача падающей цепочки. 
// Цепочка атомов закреплена в двух концах. Один конец отпускается. Рядом запускается свободно падающее тело. Смотрится отношение ускорений свободно падающего тела и конца цепочки. Строится график отношения ускорений, а также график разницы координат
//
//
//


window.addEventListener('load',main,false);
function main() { 
	
	var N = document.getElementById('Num').value;
	var a = document.getElementById('DIST').value;
	var fps = document.getElementById('FPS').value;
	var COEF = document.getElementById('COEFF').value;
	var hop,g,b,dt,cm;
	// считаем, что у нас массы всех частиц и жесткости одинаковы
	
	PRT = []; // частицы
	var l_akt1, l_akt2, vx_dot, vy_dot;
	var dt2;
	var sp = 1;
	var M = [];
	M.m = 10;
	

	// канвасы
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
	var ctxG = cnv_graf.getContext('2d');
	var hG = cnv_graf.height;
	var wG = cnv_graf.width;
	var ctxG2 = cnv_graf2.getContext('2d');
	var hG2 = cnv_graf2.height;
	var wG2 = cnv_graf2.width;
	
	// для рисования цепочки по центру канваса
	var SHIFT; 
	var global_len;
	
	// массив модуля ускорения
	var VDOT = [];
	dot_speed2 = dot_speed = 0;
	RAZN = RAZN2 = 0;
	x_step = 0;
	max_value = 1;
	max_value2 = 1;
	y_tick(5);
	y_tick2(5);
	MASSIVE = [];
	//
	var flag = 0; // флаг для паузы
	// кнопки старт, Обновить, пауза
	
	// пауза
	function switchdt() {
		switch (flag) {
			case 0: {
				flag = 1;
				sp = 0;
				break;
			}
			case 1: {
				flag = 0;
				sp = 1;

			}
		}
	}	
	
	COEFF.oninput = function () {UpdCoeff();}
	function UpdCoeff() { COEF = parseFloat(document.getElementById('COEFF').value); SHIFT = (w - 0.65*(N-1)*COEF*parseFloat(a))/2;}
	Pause.onclick = function () { switchdt();}
	
	// Обновить 
	New.onclick = function() {
		clearInt(interv);
		Update();
	}
	// Отпустить конец
	LET.onclick = function () { 
		clearInt(interv);
		interv = setInterval(control2,1000/fps);	
	}
	
	Add.onclick = function () { 
		// вносит изменения в данные
		UpdateCoeffs();
	}
	// Функция, которая обновляет данные и запускает расчет
	function Update() { 
		// берем значение для N
		N = parseInt(document.getElementById('Num').value);
		cm = parseFloat(document.getElementById('CM').value);
		a = parseFloat(document.getElementById('DIST').value);
		dt0 = parseFloat(document.getElementById('DT').value);
		Betta = parseFloat(document.getElementById('B').value);
		g = parseFloat(document.getElementById('G').value);
		fps = parseInt(document.getElementById('FPS').value);
		hop = parseInt(document.getElementById('HOP').value);
		// вспомогательная константа
		dt2 = dt0*dt0/2;
		// теперь задаем параболу
		count(N,a);
		time = 0;
		time2 = 0;
		MASSIVE = [];
		a = Math.pow(Math.pow(PRT[2].y - PRT[1].y,2) + Math.pow(PRT[2].x - PRT[1].x,2),1/2)/2;
		interv = setInterval(control1,1000/fps);
	}
	// создание цепочки
	function count(NUM, dist) {
		var len = 0.65*(NUM-1)*dist;
		global_len = len;
		var distt = len/(NUM-1);
		var len_2 = len/2;
		var w_2 = w/2;
		var constt2 = 2*Math.pow(2,1/2);
		var constt = constt2/len;
		
		for (var i = 0; i< NUM; i++) { 
			b = [];
			b.x = distt*i; 										 	// положение по x
			b.y = -constt*Math.pow(b.x-len,2) - constt2*(b.x-len); 	// положение по y
			b.vx = 0;												// скорость по x
			b.vy = 0;												// скорость по y
			b.vx_dot = 0;											// ускорение по x
			b.vy_dot = 0;											// ускорение по y
			PRT[i] = b;												// присваеваем это все частице
		}
		// на всякий , закрепляем границы
		PRT[0].y = 0;
		PRT[NUM-1].y = 0;
		// положение массивного тела ставим там же, где и конец цепочки
		M.x = PRT[N-1].x;
		M.y = PRT[N-1].y;
		M.vy = 0;
		
		// сместим цепочку в центр канваса
		UpdCoeff();
	}
	// функция подсчета скоростей и ускорений для цепочки, чтобы не дублировать код 
	function count_v_and_dot() {
		dt = dt0*sp;
		dot_speed = dot_speed2;
		for (var i = 1; i<N-1; i++) { 
			l_akt1 = Math.pow(Math.pow(PRT[i+1].x - PRT[i].x,2) + Math.pow(PRT[i+1].y - PRT[i].y,2),1/2);
			l_akt2 = Math.pow(Math.pow(PRT[i].x - PRT[i-1].x,2) + Math.pow(PRT[i].y - PRT[i-1].y,2),1/2);
			if (l_akt1 < a) {
				FR = 0;
			} else { 
				FR = (l_akt1 - a);
			}
			if (l_akt2 < a) {
				FL = 0;
			} else { 
				FL = (l_akt2 - a);
			}
			vx_dot = cm*(FR*(PRT[i+1].x - PRT[i].x)/l_akt1 - FL*(PRT[i].x - PRT[i-1].x)/l_akt2) - Betta*PRT[i].vx;
			vy_dot = (cm*(FR*(PRT[i+1].y - PRT[i].y)/l_akt1 - FL*(PRT[i].y - PRT[i-1].y)/l_akt2) + g) - Betta*PRT[i].vy;
			PRT[i].vx_dot = vx_dot;
			PRT[i].vy_dot = vy_dot;
			PRT[i].vx += vx_dot*dt ;
			PRT[i].vy += vy_dot*dt;
		}
	}
	function phys_1() {  // когда последняя частица закреплена
		// первая частица у нас всегда закреплена и последняя!
		count_v_and_dot();
		for (var i = 1; i<N-1; i++) { 
			PRT[i].x += PRT[i].vx*dt;
			PRT[i].y += PRT[i].vy*dt;
		}
		
	}
	
	function phys_2() { // когда последнюю частицу отпустили
		RAZN = RAZN2;
		MASSIVE.push(RAZN);
		count_v_and_dot();
		// подсчет для последней частицы
		l_akt2 = Math.pow(Math.pow(PRT[N-1].x - PRT[N-2].x,2) + Math.pow(PRT[N-1].y - PRT[N-2].y,2),1/2);
		if (l_akt2 < a) {
				FL = 0;
			} else { 
				FL = (l_akt2 - a);
		}
		vx_dot =  -cm*FL*(PRT[N-1].x - PRT[N-2].x)/l_akt2 - Betta*PRT[N-1].vx;
		vy_dot =  -cm*FL*(PRT[N-1].y - PRT[N-2].y)/l_akt2 - Betta*PRT[N-1].vy;
		PRT[N-1].vx_dot = vx_dot;
		PRT[N-1].vy_dot = vy_dot;
		PRT[N-1].vx += vx_dot*dt ;
		PRT[N-1].vy += vy_dot*dt;
		
		// теперь считаем новые координаты

		for (var i = 1; i<N; i++) { 
			PRT[i].x += PRT[i].vx*dt;
			PRT[i].y += PRT[i].vy*dt;
		}
		M.y = g*Math.pow(time2*dt0,2)/2;
	}

	// рисование цепочки
	function draw1() { 
		ctx.clearRect(0,0,w,h);
		for (var i = 0; i<N; i++) { 
			ctx.beginPath();
			ctx.arc(PRT[i].x*COEF + SHIFT,PRT[i].y*COEF + 50, 3, 0, 2*Math.PI);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.moveTo(0,50);
		ctx.lineTo(w,50);
		ctx.stroke();
		
	}
	
	function draw2() { 
		// сначала рисуем цепочку
		draw1();
		// потом свободно падающее тело 
		ctx.beginPath();
		ctx.arc(M.x*COEF + SHIFT,M.y*COEF + 50, 5, 0, 2*Math.PI);
		ctx.fill();
		
	}
	
	function draw_graf() { 
		// строим график ускорений 
		dot_speed2 = Math.pow(Math.pow(PRT[N-1].vx_dot,2) + Math.pow(PRT[N-1].vy_dot,2),1/2)/g;
		RAZN2 = PRT[N-1].y - M.y;
		// надо понять масштаб графика по y
		if (dot_speed2/max_value > 0.9) { max_value = dot_speed2*1.5; y_tick(5);}
		if (RAZN2/max_value2 > 0.9) { max_value2 = RAZN2*1.5; y_tick2(5);}
		if (x_step == wG) { x_step = 0; ctxG.clearRect(0,0,wG,hG); ctxG2.clearRect(0,0,wG2,hG2); y_tick(5); y_tick2(5);}
		ctxG.beginPath();
		ctxG.moveTo(x_step, hG*(1 - dot_speed/max_value));
		x_step += 0.5;
		ctxG.lineTo(x_step,hG*(1 - dot_speed2/max_value));
		ctxG.stroke();
		// рисуем верх 
		ctxG2.clearRect(0,0,wG2,hG2);
		y_tick2(5);
		xx_step = wG2/2/MASSIVE.length;
		for (var j = 1; j < MASSIVE.length; j++) { 
			ctxG2.beginPath();
			ctxG2.moveTo(xx_step*(j-1), hG2*(1 - MASSIVE[j-1]/max_value2));
			ctxG2.lineTo(xx_step*j,hG2*(1 - MASSIVE[j]/max_value2));
			ctxG2.stroke();
		}
		

		
	}
	function y_tick(num) { 
		ctxG.clearRect(0,0,50,hG-10);
		ctxG.fillText(max_value.toFixed(2),5,0.05*hG);
		var step = hG/num;
		for (var i = 1; i< num; i++) { 
			// рисуем засечку
			val = step*i;
			ctxG.beginPath();
			ctxG.moveTo(0,hG - val); 
			ctxG.lineTo(3,hG - val);
			ctxG.fillText((val/hG*max_value).toFixed(2), 5, hG - val);
			ctxG.stroke();
		}
		ctxG.fillText('x"/G',40,0.05*hG);
		

	}
	function y_tick2(num) { 
		ctxG2.clearRect(0,0,50,hG2-10);
		ctxG2.clearRect(0,0,80,20);
		ctxG2.fillText(max_value2.toFixed(2),5,0.05*hG2);
		var step = hG/num;
		for (var i = 1; i< num; i++) { 
			// рисуем засечку
			val = step*i;
			ctxG2.beginPath();
			ctxG2.moveTo(0,hG - val); 
			ctxG2.lineTo(3,hG - val);
			ctxG2.fillText((val/hG2*max_value2).toFixed(2), 5, hG2 - val);
			ctxG2.stroke();
		}
		ctxG2.fillText('y - yM',40,0.05*hG2);
	}
	function control1() { 
		phys_1();
		if (time % hop == 0) { 
			draw1();
		}
		draw_graf();
		time++;
	}
	function control2() { 
		phys_2();
		if (time % hop == 0) { 
			draw2();
		}
		draw_graf();
		time2 += sp;
	}
	
	// остановить цикл с расчетом и рисованием
	function clearInt(intrv) { 
		clearInterval(intrv);
	}
	
	// изменение FPS
	FPS.oninput = function () { 
		fps = parseInt(document.getElementById('FPS').value);
		clearInt(interv);
		interv = setInterval(control2,1000/fps);
	}
	
	// функция обновления коэффициентов
	function UpdateCoeffs() {
		cm = parseFloat(document.getElementById('CM').value);
		dt0 = parseFloat(document.getElementById('DT').value);
		Betta = parseFloat(document.getElementById('B').value);
		g = parseFloat(document.getElementById('G').value);
		hop = parseInt(document.getElementById('HOP').value);
		dt2 = dt0*dt0/2;
	}
	// обновим коэффициенты и запустим процесс
	UpdateCoeffs();
	Update();

}