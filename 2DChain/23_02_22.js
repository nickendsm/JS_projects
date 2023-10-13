//
//
// 2D модель кристаллической решетки, поперечные колебания атомов, задаются возмущения в виде волн
//
//
//



window.addEventListener('load',main,false);
function main () {
	// холсты
		var mathMethods = Object.getOwnPropertyNames(Math);
	for (var i in mathMethods)
	this[mathMethods[i]] = Math[mathMethods[i]];
	var M = Math;
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
	var ctx2 = gcnv.getContext('2d');
	var h2 = gcnv.height;
	var w2 = gcnv.width;
	// var ctx_m = mass_cnv.getContext('2d');
	// var h_m = mass_cnv.height;
	// var w_m = mass_cnv.width;
	// var ctx_g = g2cnv.getContext('2d');
	// var ctx_g2 = g3cnv.getContext('2d');
	// н.у и параметры системы
	var y = h/2;
	var N = +(document.getElementById('Quantity').value); // количество частиц
	var nw = nh = N;
	var C = 100; // жесткость пружин
	var nu = 2*M.pow(C,1/2);
	var m = 1; // масса грузов
	var dt0 = 2*Math.PI*Math.pow(m/C,0.5)/50; // шаг по времени
	var y_scale = 50;
	// объекты html(интерфейс
	var yscal = document.getElementById('yscale'); // масштаб по Oy
	var speedy = document.getElementById('speed');
	var mode = document.getElementsByName('mode'); // режим
	var massbtn = document.getElementById('mass');
	var mass_text = document.getElementById('mass_value'); 
	// переменные
	var sp = speedy.value;
	var dt = sp*dt0;
	var fps = 60;
	// var r;
	// var v;
	// var coord1;
	// var coord2;
	energ = document.getElementById('energy');
	typeg = document.getElementsByName('typeofg');
	spd.innerHTML = sp;
	var typeg;
	var flag = 0;
	var partcls = []; // массив частиц
	var move = false;
	var Mark = []; // массив для понимания, выбрали ли мы частицу уже или нет( нужно в части выбора частиц)
	var marker;
	// var Ekin;
	// var Epot;
	// var Ene = 0;
	// var d = 0;
	// var x_numr = 0;
	// var x_denum = 0;
	// var x_c = 0;
	// var x_c_pr = 0; // предыдущий 
	// var xl_num = 0;
	// var xr_num = 0;
	// var xl_c = 0;
	// var xl_c_pr = 0;
	// var xr_c = 0;
	// var xr_c_pr = 0;
	// var Ene_r = 0;
	// var num_disp = 0; // числитель 
	// var numm = 0 // числитель для одной из 
	// var sigma = 0;
	// var sigmaL = 0;
	// var sigmaR = 0;
	// var time = 0;
	var spp = 1;
	// var potl = 0;
	// var potr = 0; 
	// var pot = 0;
	// var xc_prev = 0;
	// для решения бесселя
	var time = 0;
	var Ek = 0; var Ep = 0; // энергии

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
	Pause.onclick = function () { switchdt();}
	// function draw_mass () { 
		// ctx_m.clearRect(0,0,w_m,h_m);
		// for (var q = 1; q<=N; q++) {
			// var c = String(255-partcls[q].m*75);
			// partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
		// }
		// for (q = 2; q<=N+1; q++) { 
			// if ((q == N+1)||(String(partcls[q].m) != String(partcls[q-1].m))) { 
			 // если массы не равны, то ставим разделитель
			 // ctx_m.beginPath(); 
			 // ctx_m.moveTo(partcls[q-1].x + r, 0);
			 // ctx_m.lineTo(partcls[q-1].x + r, h_m);
			 // ctx_m.strokeStyle = partcls[q-1].rgb;
			 // ctx_m.fillStyle = partcls[q-1].rgb; 
			 // if ((2*r) <= h_m) { 
				// if (2*r <= 8) {
					// ctx_m.font= "12px Arial";
				// }else {
				// ctx_m.font= String(2*r)+"px" + " Arial";
				// }
			 // } else { 
				// ctx_m.font= String(h_m) + "px" + " Arial";
			 // }
			// ctx_m.fillText((partcls[q-1].m).toFixed(2),partcls[q-1].x-r,h_m-2);
			 // ctx_m.stroke();
			// }
		// }
		
	// }
				
			
	speed.oninput = function () {
		if (flag != 1) {
			sp = parseFloat(speedy.value);
			spd.innerHTML = sp;
		}
	}
	yscale.oninput = function () { 
		y_scale = parseFloat(yscal.value);
	}
		
	// massbtn.onclick = function () { 
		// должны присвоить массы и снять выделение с частиц
		// var mass = parseFloat(mass_text.value); 
		// ctx.beginPath();
		// for (q = 1;q<=N; q++) {
			// if (partcls[q].rgb == "rgba(255,0,0,255)") {
				// partcls[q].m = mass;
				// partcls[q].flag = 1;
			// }
			// var c = String(255-partcls[q].m*75);
			// partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
			// ctx.beginPath();
			// ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			// ctx.fillStyle = partcls[q].rgb;
			// ctx.fill();
			// ctx.stroke();
		// }
		// draw_mass();
	// }

	// Model.onclick = function() {
		// if (Number(document.getElementById('num').value) != 0) { 
			// N = Number(document.getElementById('Quantity').value);
			// count(N);
			// zero();
			// set_exp(Number(document.getElementById('num').value));
		// } else {
			// flag = 0;
			// i = document.getElementById('first').value % N;
			// if ( i == 0) { i = N;}
			// for (q = 1;q<=N; q++) {
				// dist = 35/15*r;
				// partcls[q].x = r+(q-1)*dist;
				// partcls[q].u = 0;
				// partcls[q].v = 0;
				// ctx.beginPath();
				// ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
				// ctx.fillStyle = partcls[q].rgb;
				// ctx.fill();
				// ctx.stroke();
			// }
			// partcls[i].v = parseFloat(document.getElementById('v').value);
			// draw_mass();
		// }
	// }
	// New.onclick = function() {
		// flag = 0;
		// marker = 1;
		// N = Number(document.getElementById('Quantity').value);
		// count(N);
		// i = document.getElementById('first').value % N;
		// point = i;
		// partcls[i].v = parseFloat(document.getElementById('v').value);
		// coeff = partcls[i].v;
		// document.getElementById('num').value = 0;
		// draw_mass ();
		// check_exp(marker);
		// exper.innerHTML = '';
	// }

	// document.getElementById('masses').onchange = () => {
		// main_block.style.display = 'none';
		// text_slide.style.display = 'inline';
		// clearint(interv); // остановили моделирование
		// ctx.clearRect(0,0,w,h);
		// for (q = 1;q<=N; q++) {
			// ctx.beginPath();
			// ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			// ctx.fillStyle = partcls[q].rgb;
			// ctx.fill();
			// ctx.stroke();
		// }
	// }
	// OneM.onchange = () => {
		// varyM.style.display = 'none';
		// выбрали режим одинаковых масс, значит, надо все привести к начальному виду
		// t = 0; // время 0-ое,
		// flag = 0;
		// switchdt();
		// count(N); // нулевые н.у
		// coeff = 0; // коэфф при фиях бесселя тоже 0 
		// теперь надо очистить графики радиуса инерции и энергетического центра
		// time = 0;
		// ctx_g.clearRect(0,0,w,h);
		// ctx_g2.clearRect(0,0,w,h);
		// document.getElementById('num').value = 0; // нулевой эксперимент 
		// draw_mass ();// рисуем массы
		// Bess.style.display = 'inline';
	// }
	// ManyM.onchange = () => {
		// varyM.style.display = 'inline';
		// Bess.style.display = 'none';
	// }
	// document.getElementById('model').onchange = () => {
		// main_block.style.display = 'inline';
		// massbtn.style.display = 'none';
		// mass_text.style.display = 'none';
		// text_slide.style.display = 'none';
		// interv = setInterval(control,1000/fps);
		// draw_mass();
		// exp1.style.display = 'none';
		// exp2.style.display = 'none';
	// }
		
	function count(nw,nh){
		r = w*15/(35*nw-5);
		dist = 35/15*r;
		var N = parseInt(nw*nh);
		partcls = []; // столбец
		for (var i = 0; i <= nw+1; i++) {
			partclsW = []; // строчка
			for (var j = 0; j<= nh+1; j++) { 
				// i - строчка, j - столбец
				var b = [];            
				b.u = 0; // скалярное поле перемещений в данной точке
				b.v = 0; // скорость в данной точке 
				b.x = (j)*w/(nw+1);
				b.y = (i)*h/(nh+1);
				b.m = 1;
				b.flag = 1;
				b.v_p = 0; // ускорение 
				var c = String(255-b.m*75); b.rgb = "rgba("+c+","+c+","+c+",255)";
				partclsW[j] = b;     
			}
			partcls[i] = partclsW;
		}
	}
	function zero() { 
		for (i = 0; i<=nh+1; i++) { 
			for (j = 0; i<=nw+1; j++) {
				partcls[i][j].v = 0;
				partcls[i][j].u = 0;
			}
		}
	}
		// присвоим массы
			// var numr = 0;
		// var denum = 0;
		// for (var i = 1; i<= nh; i++) {
			// for (var j = 1; j<= nw; j++) {
				// numr += partcls[i][j].m*(partcls[i][j].x);
				// denum += partcls[i][j].m;
			// }
		// }
		// x_c_0 = numr/denum;
		// numr = 0 ;
		// for (var i = 1; i<=nh; i++) {
			// for (var j = 1; j<= nw; j++) {
				// numr += partcls[i][j].m*(partcls[i][j].y);
			// }
		// }
		// y_c_0 = numr/denum;
		// numr = 0;
		// for (var i = 1; i<=nh; i++) {
			// for (var j = 1; j<= nw; j++) {
				// numr += partcls[i][j].m*(partcls[i][j].u);
			// }
		// }
		// z_c_0 = numr/denum;
		// console.log(x_c_0,y_c_0,z_c_0);
		// пересчитали скорости
		// for (var i = 1; i<= nh; i++) { 
			// for (var j = 1; j<= nw; j++) { 
				// partcls[i][j].v += (partcls[i][j+1].u + partcls[i+1][j].u + partcls[i-1][j].u + partcls[i][j-1].u  - 4*partcls[i][j].u)*C*dt/partcls[i][j].m;
			// }
		// }
		// пересчитали перемещения
		// for (var i = 1; i <= nh; i++) { 
			// for (var j = 1; j <= nw; j++) { 
				// partcls[i][j].u += partcls[i][j].v*dt;
			// }
		// }
		// теперь надо учесть периодеские ГУ
		// for (var j = 1; j <= nw; j++) {
			// partcls[0][j] = partcls[nh][j];
			// partcls[nh + 1][j] = partcls[1][j];
		// }
		// теперь левый и правый столбец
		// for (var i = 1; i <= nh; i++) {
			// partcls[i][0] = partcls[i][nw];
			// partcls[i][nw + 1] = partcls[i][1];
		// }
	
	function phys () {
		var numr = 0;
		var denum = 0;
		for (var i = 1; i<= nh; i++) {
			for (var j = 1; j<= nw; j++) {
				numr += partcls[i][j].m*(partcls[i][j].x);
				denum += partcls[i][j].m;
			}
		}
		x_c = numr/denum;
		numr = 0 ;
		for (var i = 1; i<=nh; i++) {
			for (var j = 1; j<= nw; j++) {
				numr += partcls[i][j].m*(partcls[i][j].y);
			}
		}
		y_c = numr/denum;
		numr = 0;
		for (var i = 1; i<=nh; i++) {
			for (var j = 1; j<= nw; j++) {
				numr += partcls[i][j].m*(partcls[i][j].u);
			}
		}
		z_c = numr/denum;
		dt = dt0*sp;
		// запомним ускорение
		// для первого 
		// пересчет
		// для последнего 
		if (dt > 0) {
			// для первого
					// пересчитали скорости
			for (var i = 1; i<= nh; i++) { 
				for (var j = 1; j<= nw; j++) { 
					partcls[i][j].v += (partcls[i][j+1].u + partcls[i+1][j].u + partcls[i-1][j].u + partcls[i][j-1].u  - 4*partcls[i][j].u)*C*dt/partcls[i][j].m;
				}
			}
			// пересчитали перемещения
			for (var i = 1; i <= nh; i++) { 
				for (var j = 1; j <= nw; j++) { 
					partcls[i][j].u += partcls[i][j].v*dt;
				}
			}
		} else {
		// dt < 0
				// пересчитали перемещения
			for (var i = 1; i <= nh; i++) { 
				for (var j = 1; j <= nw; j++) { 
					partcls[i][j].u += partcls[i][j].v*dt;
				}
			}
					// пересчитали скорости
			for (var i = 1; i<= nh; i++) { 
				for (var j = 1; j<= nw; j++) { 
					partcls[i][j].v += (partcls[i][j+1].u + partcls[i+1][j].u + partcls[i-1][j].u + partcls[i][j-1].u  - 4*partcls[i][j].u)*C*dt/partcls[i][j].m;
				}
			}
		}
		// теперь надо учесть периодеские ГУ
		for (var j = 1; j <= nw; j++) {
			partcls[0][j] = partcls[nh][j];
			partcls[nh + 1][j] = partcls[1][j];
		}
		// теперь левый и правый столбец
		for (var i = 1; i <= nh; i++) {
			partcls[i][0] = partcls[i][nw];
			partcls[i][nw + 1] = partcls[i][1];
		}
		
		for (var i = 1; i<= nh; i++) { 
			for (var j = 1; j<= nw; j++) { 
				partcls[i][j].v_p += (partcls[i][j+1].u + partcls[i+1][j].u + partcls[i-1][j].u + partcls[i][j-1].u  - 4*partcls[i][j].u)*C/partcls[i][j].m;
			}
		}
		// теперь хотим посчитать энергии и импульсы двух частей 
		
		// надо посчитать координаты центра масс системы после того, как посчитали их перемещения.
		numr = 0;
		denum = 0;
		Ene = 0;
		Ene_r = 0;
		x_numr = 0;
		xl_num = 0;
		xr_num = 0;
		num_disp = 0; // числитель 
		numm = 0 // числитель для одной из 
		sigma = 0;
		sigmaL = 0;
		sigmaR = 0;
		x_c_r = 0; y_c_r = 0; x_c_l = 0; y_c_l = 0;
		x_c_pr_r = x_c_r;
		x_c_pr_l = x_c_l;
		y_c_pr_l = y_c_l;
		y_c_pr_r = y_c_r;
		var e_n;
		// энергия первой частицы
		// сначала посчитаем то, что слева от диагонали 
		Ene = 0;
		var x_c = 0;
		var y_c = 0;
		for (var i = 1; i <= parseInt(N/2); i++) { 
			for (var j = 1; j<= nw; j++) {
				// СЧИТАЕМ ЧТО СЛЕВА МАССЫ 1
				e_n = 1/2*partcls[i][j].v*partcls[i][j].v + 1/4*C*(Math.pow(partcls[i][j].u - partcls[i-1][j].u,2)+Math.pow(partcls[i][j].u - partcls[i][j-1].u,2) + Math.pow(partcls[i][j].u - partcls[i+1][j].u,2) + Math.pow(partcls[i][j].u - partcls[i][j+1].u,2));
				Ene += e_n;
				x_c+= e_n*partcls[i][j].x;
				y_c+= e_n*partcls[i][j].y;
			}
		}
		x_c_l = x_c/Ene; y_c_l = y_c/Ene;
		x_c_pr_l = x_c_l;
		x_c = 0; y_c = 0;
		Ene_r = 0;
		for (var i = parseInt(N/2)+1; i <= nh; i++) { 
			for (var j = 1; j<= nw; j++) {
				// СЧИТАЕМ ЧТО СЛЕВА МАССЫ 1
				e_n = 1/2*partcls[i][j].v*partcls[i][j].v + 1/4*C*(Math.pow(partcls[i][j].u - partcls[i-1][j].u,2)+Math.pow(partcls[i][j].u - partcls[i][j-1].u,2) + Math.pow(partcls[i][j].u - partcls[i+1][j].u,2) + Math.pow(partcls[i][j].u - partcls[i][j+1].u,2));
				Ene_r += e_n;
				x_c+= e_n*partcls[i][j].x;
				y_c+= e_n*partcls[i][j].y;
			}
		}
		x_c_r = x_c/Ene_r; y_c_r = y_c/Ene_r;
		Ene += Ene_r;
		// Ek = 0;
		// Ep = 0;
		// for (var i = 1; i<= nh; i++) {
			// for (var j = 1; j<= nw; j++) { 
				// Ek += 1/2*partcls[i][j].m*partcls[i][j].v*partcls[i][j].v;
				// Ep += 1/4*C*(Math.pow(partcls[i][j].u - partcls[i-1][j].u,2)+Math.pow(partcls[i][j].u - partcls[i][j-1].u,2) + Math.pow(partcls[i][j].u - partcls[i+1][j].u,2) + Math.pow(partcls[i][j].u - partcls[i][j+1].u,2));
			// }
		// }
		
		// x_numr += e_n*1;
		// xl_num += e_n*1;
		// Ene += e_n;
		// энергия серединных
		// for (var q = 2;q<=parseInt(N/2);q++) { 
			// var e_n = parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 1/4*C*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
			// x_numr += e_n*q;
			// xl_num += e_n*q;
			// Ene += e_n;
		// }
		// xl_c_pr = xl_c;
		// xl_c = dist*xl_num/Ene;
		// for (var q = parseInt(N/2)+1;q<N;q++) { 
			// var e_n = parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 1/4*C*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
			// x_numr += e_n*q;
			// xr_num += e_n*(q-parseInt(N/2));
			// Ene += e_n;
			// Ene_r += e_n;
		// }
		// энергия последней
		// var e_n = parseFloat(partcls[N].m)*Math.pow(partcls[N].v,2)/2 + 1/4*C*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls[N].u - partcls[N-1].u,2));
		// x_numr += e_n*N;
		// xr_num += e_n*(N-parseInt(N/2));
		// Ene_r += e_n;
		// Ene += e_n;
		// x_c_pr = x_c;
		// x_c = dist*x_numr/Ene;
		// divide = (x_c-x_c_pr)/dt/(10*dist);
		// console.log(divide);
		// xr_c_pr = xr_c;
		// xr_c = dist*xr_num/Ene_r;
		// теперь радиусы инерции 
		// для первой частицы энергия
		// var e_n = parseFloat(partcls[1].m)*Math.pow(partcls[1].v,2)/2 + 1/4*C*(Math.pow(partcls[2].u-partcls[1].u,2)+Math.pow(partcls[1].u - partcls[N].u,2));
		// num_disp += Math.pow(partcls[1].x-x_c,2)*e_n;
		// numm += Math.pow(partcls[1].x-xl_c,2)*e_n;
		// for (q = 2; q<=parseInt(N/2);q++) {
			// var e_n = parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 1/4*C*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
			// num_disp += Math.pow(partcls[q].x-x_c,2)*e_n;
			// numm += Math.pow(partcls[q].x-xl_c,2)*e_n;
		// }
		// теперь можем посчитать радиус для первой цепочки
		// sigmaL = Math.pow(numm/(Ene-Ene_r),1/2);
		// sigmaL_pr = sigmaL;
		//теперь считаем для правой 
		// numm = 0;
		// for (q = parseInt(N/2)+1; q<N;q++) {
			// var e_n = parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 1/4*C*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
			// num_disp += Math.pow(partcls[q].x-x_c,2)*e_n;
			// numm += Math.pow(partcls[q].x-xr_c-w/2,2)*e_n;
		// }
		// var e_n = parseFloat(partcls[N].m)*Math.pow(partcls[N].v,2)/2 + 1/4*C*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls[N].u - partcls[N-1].u,2));
		// num_disp += Math.pow(partcls[N].x-x_c,2)*e_n;
		// numm += Math.pow(partcls[N].x-xr_c-w/2,2)*e_n;
		// sigmaR = Math.pow(numm/Ene_r,1/2);
		// sigmaR_pr = sigmaR;
		// sigma = Math.pow(num_disp/Ene,1/2);
		// sigma_pr = sigma;
		// numr = 0; denum = 0;
		// for (i = 1; i<=nh; i++) {
			// for (j = 1; i<= nw; j++) {
				// numr += partcls[i][j].m*(partcls[i][j].x+partcls[i][j].u);
				// denum += partcls[i][j].m;
			// }
		// }
		// var coords2 = numr/denum;
		// d = coords2 - coords1;
		// energia.innerHTML = " "+String(Ene);
		
	}
	
	// cnv.onmousedown = function () { 
		// if (mode[0].checked) {
			// if (massbtn.style.display == 'none') {
				// massbtn.style.display = 'inline';
			// }
			// if (mass_text.style.display == 'none') {
				// mass_text.style.display = 'inline';
			// }
			// var rect = cnv.getBoundingClientRect();
			// coord1 = event.clientX - rect.left;
			// Mark = [];
			// for (i = 1;i<=N; i++) {
				// Mark[i] = 0;
			// }
			// move = true;
		// }
	// }
	// cnv.onmousemove = function () { 
		// if (move) {
			// ctx.clearRect(0,0,w,h);
			// var rect = cnv.getBoundingClientRect();
			// coord2 = event.clientX - rect.left;
			// if (coord2 < coord1) {
				// var prom = coord1;
				// coord1 = coord2;
				// coord2 = prom;
			// }
			// for (q = 1;q<=N;q++) {
				// if ((Mark[q] == 0)&&(((partcls[q].x-r> coord1)&&(partcls[q].x-r<coord2))||((partcls[q].x+r> coord1)&&(partcls[q].x+r<coord2)))) {
					// switch (partcls[q].flag) {
						// case 0: {
							// partcls[q].flag = 1;
							// var c = String(255-partcls[q].m*75);
							// partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
							// Mark[q] = 1;
							// continue
						// }
						// case 1: {
							// partcls[q].flag = 0;
							// partcls[q].rgb = "rgba(255,0,0,255)"
							// Mark[q] = 1;
						// }
					// }		
				// }
				// ctx.beginPath();
				// ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
				// ctx.fillStyle = partcls[q].rgb;
				// ctx.fill();
				// ctx.stroke();
			// }
		// }
	// }
	// cnv.onmouseup = function () {
		// move = false;
	// }
	function clearint(interv) { 
		clearInterval(interv);
	}
	
	var ek_n = 0;
	var ep_n = 0;
	function draw() {
		time += 1;
		// if (time == 1) { // 
			// for (var i = 1; i<= nh; i++) { 
				// for (var j = 1; j<= nw; j++) { 
				// ek_n = 1/2*partcls[i][j].m*partcls[i][j].v*partcls[i][j].v;
				// ep_n = 1/4*C*(Math.pow(partcls[i][j].u - partcls[i-1][j].u,2)+Math.pow(partcls[i][j].u - partcls[i][j-1].u,2) + Math.pow(partcls[i][j].u - partcls[i+1][j].u,2) + Math.pow(partcls[i][j].u - partcls[i][j+1].u,2));
				// k = Math.pow(ek_n/ep_n,1/2);
				// partcls[i][j].v = partcls[i][j].v/k;
				// }
			// }
		// }
		// if (time == 1) { 
			// посчитаем начальный импульс 
			// сначала надо найти модуль скорости
			// var V_r = Math.pow( Math.pow((x_c_r - x_c_pr_r)/dt,2) + Math.pow((y_c_r - y_c_pr_r)/dt,2) , 0.5);
			// var V_l = Math.pow( Math.pow((x_c_l - x_c_pr_l)/dt,2) + Math.pow((y_c_l - y_c_pr_l)/dt,2), 0.5);
			// console.log('разница энергий: ', Ek/Ep);
			// console.log('Импульс слева в начале(весь):',V_l*(Ene-Ene_r));
			
		// }
		// if (time == 1000) { time == 0 }
		// if (time == 335) { 
			// var V_r = Math.pow( Math.pow((x_c_r - x_c_pr_r)/dt,2) + Math.pow((y_c_r - y_c_pr_r)/dt,2) , 0.5);
			// var V_l = Math.pow( Math.pow((x_c_l - x_c_pr_l)/dt,2) + Math.pow((y_c_l - y_c_pr_l)/dt,2), 0.5);
			
			// console.log('Импульс слева:',V_l*(Ene-Ene_r));
			// console.log('Импульс справа:',V_r*Ene_r);
		// }
	// рисуем сами частицы и график в одном цикле
		ctx.clearRect(0,0,w,h);
		// ctx2.clearRect(0,0,w2,h2);
		// ctx2.beginPath();
		// ctx2.moveTo(0,h/2);
		// ctx2.lineTo(w,h/2);
		// ctx2.stroke();
		// if (typeg[1].checked == true) {
			// ctx2.beginPath();
			// ctx2.moveTo(partcls[1].x,-partcls[1].v*y_scale+h/2);
			// for (var q = 1;q<=N;q++) {
				// ctx.beginPath();
				// ctx.arc(partcls[q].x + partcls[q].u - d,y,r,0,2*Math.PI);
				// ctx.fillStyle = partcls[q].rgb;
				// ctx.fill();
				// ctx.stroke();
				// ctx2.lineTo(partcls[q].x,-partcls[q].v*y_scale+h/2);
			// }
			// ctx2.strokeStyle = 'black';
			// ctx2.stroke();
		// } else {
			for (var i = 1; i<= nh;i++) {
				for (var j = 1; j<=nw; j++) { 
					// ctx.beginPath();
					// ctx.arc(partcls[i][j].x,partcls[i][j].y,r,0,2*Math.PI);
					// ctx.fillStyle = partcls[i][j].rgb;
					// ctx.fill();
					// ctx.strokeStyle = 'black';
					// ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(partcls[i][j].x,partcls[i][j].y);
					ctx.lineTo(partcls[i][j].x + (partcls[i][j].v)*0.5,partcls[i][j].y);
					ctx.strokeStyle = 'red';
					ctx.stroke();
					// ctx2.beginPath();
					// ctx2.arc(partcls[q].x,-partcls[q].v*y_scale+h/2,3,0,2*Math.PI);
					// ctx2.strokeStyle = 'black';
					// ctx2.stroke();
					// ctx2.beginPath();
					// ctx2.arc(partclsB[q].x,-partclsB[q].v*y_scale+h/2,3,0,2*Math.PI);
					// ctx2.strokeStyle = 'purple';
					// ctx2.stroke();
					
				}
				
		
				
			}
			// ctx2.clearRect(0,0,w,h);
			// ctx2.beginPath();
			// ctx2.moveTo(0,125);
			// ctx.beginPath();
			// for (var i = 1; i<= nw; i++) {
				// ctx2.lineTo(partcls[i][i].x,125 - partcls[i][i].v*50);
				// ctx.beginPath();
				// ctx.arc(partcls[i][N-i].x,partcls[i][N-i].y,r,0,2*Math.PI);
				// ctx.fillStyle = partcls[i][N-i].rgb;
				// ctx.fill();
			// }
			// ctx2.strokeStyle = 'black';
			// ctx2.stroke();
			ctx.beginPath();
			ctx.arc(x_c_l,y_c_l,5,0,2*Math.PI);
			ctx.strokeStyle = 'purple';
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(x_c_r,y_c_r,5,0,2*Math.PI);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
			
			// ctx2.beginPath();
			// ctx2.moveTo(0,125);
			// for (var j = 1; j <= nw; j++) {
				// ctx2.lineTo(partcls[9][j].x,125 - partcls[9][j].u*50);
			// }
			// ctx2.strokeStyle = 'blue';
			// ctx2.stroke();
			// ctx2.beginPath();
			// ctx2.moveTo(0,125);
			// for (var j = 1; j <= nw; j++) {
				// ctx2.lineTo(partcls[11][j].x,125 - partcls[11][j].u*50);
			// }
			// ctx2.strokeStyle = 'red';
			// ctx2.stroke();
			// ctx2.beginPath();
			// ctx2.moveTo(0,125);
			// for (var j = 1; j <= nw; j++) {
				// ctx2.lineTo(partcls[8][j].x,125 - partcls[8][j].u*50);
			// }
			// ctx2.strokeStyle = 'purple';
			// ctx2.stroke();
			
		// }
		
		// кин энергия частиц
		// ctx2.beginPath();
		// ctx2.moveTo(0,h);
		// for (var q = 1;q<=N;q++) { 	
			// ctx2.lineTo(partcls[q].x,h-partcls[q].m*Math.pow(partcls[q].v,2)/2*y_scale/2);
		// }
		// ctx2.strokeStyle = 'blue';
		// ctx2.stroke();
		// рисуем энергетический центр всей цепочки
		// ctx2.beginPath();
		// ctx2.arc(x_c,50,r,0,2*Math.PI);
		// ctx2.strokeStyle = 'purple';
		// ctx2.stroke();
		//и радиус
		// ctx2.beginPath();
		// ctx2.moveTo(x_c - sigma,50);
		// ctx2.lineTo(x_c + sigma,50);
		// ctx2.stroke();
		// левый энерг центр
		// ctx2.beginPath();
		// ctx2.arc(xl_c,50,r,0,2*Math.PI);
		// ctx2.strokeStyle = 'blue';
		// ctx2.stroke();
		// ctx2.beginPath();
		// ctx2.moveTo(xl_c - sigmaL,50);
		// ctx2.lineTo(xl_c + sigmaL,50);
		// ctx2.stroke();
		// правый 
		// ctx2.beginPath();
		// ctx2.arc(xr_c+w/2,50,r,0,2*Math.PI);
		// ctx2.strokeStyle = 'red';
		// ctx2.stroke();
		// ctx2.beginPath();
		// ctx2.moveTo(xr_c + w/2 - sigmaR,50);
		// ctx2.lineTo(xr_c + w/2 + sigmaR,50);
		// ctx2.stroke();
	}
	function drawLine() {  
		ctx.beginPath()
		ctx.moveTo(partcls[N/2][1].x,partcls[N/2][1].y);
		ctx.lineTo(partcls[N/2][nw].x,partcls[N/2][nw].y);
		ctx.stroke();
	}
	// function draw_graf () {
		// рисуем график движения энергетического центра 
		// сначала отрисовываем оси
		// ctx_g.beginPath();
		// ctx_g.font = '18px Arial';
		// ctx_g.fillText('X',0,18);
		// ctx_g.fillText('t',990,h2-2);
		// ctx_g2.font = '18px Arial';
		// ctx_g2.fillText('sigma',0,18);
		// ctx_g2.fillText('t',990,h2-2);
		// энергетический центр всей цепочки
		// if (x_c < partcls[parseInt(N/2)].x-2*r) {
			// ctx_g.moveTo(time-1,h2-x_c_pr/4);
			// ctx_g.lineTo(time,h2-x_c/4);
			// ctx_g.strokeStyle = 'purple';
			// ctx_g.stroke();
			// сигму рисуем кружочками 
			// для всей цепочки
			// ctx_g2.beginPath();
			// ctx_g2.arc(time,h2-sigma,2,0,2*Math.PI);
			// ctx_g2.strokeStyle = 'purple';
			// ctx_g2.stroke();
		// }
		// правой цепочки
		// time += spp*1;
	// }
		
	// function set_exp(N_exp) {
		// ctx.clearRect(0,0,w,h);
		// marker = 1; // по умолчанию это не волна
		// if (N_exp == 1) {
			// for (i = parseInt(N/2);i<= N;i++) {partcls[i].m = 3;}
			// for (q = parseInt(N/8); q<=parseInt(3/8*N)-1; q++) {
				// partcls[q].u = Math.cos(2*Math.PI/19*(q-parseInt(N/8)))-1;
				// partcls[q].v = 20*Math.sin(Math.PI/19)*Math.sin(2*Math.PI/19*(q-parseInt(N/8)));
				// console.log('Номер: ',q-parseInt(N/8),'Перемещ: ',partcls[q].u,'Скорость: ',partcls[q].v);
			// }
			// for (q = 1; q<=N; q++) { 
				// console.log('Номер: ',q-parseInt(N/8),'Перемещ: ',partcls[q].u,'Скорость: ',partcls[q].v);
			// }
			// marker = 0; // значит не нужны данные о начальной частице и скорости
			// y_scale = 30;
			// exper.innerHTML = 'Гауссиан на границе двух масс';
		// } 
		// if (N_exp == 2) {
			// for (var i = parseInt(N/3);i<= parseInt(2*N/3);i++) {partcls[i].m = 2;}
			// for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			// ind = parseInt(N/5);
			// partcls[ind-1].u = -10;
			// partcls[ind].v = -200;
			// partcls[ind+1].u = 10; 
			// marker = 0; // нужны данные о начальной частице и скорости
			// exper.innerHTML = 'Три разных массы';
		// }
		// if (N_exp == 3) {
			// for (var i = 1;i<= parseInt(N/3);i++) {partcls[i].m = 3;}
			// for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			// ind = parseInt(N/2);
			// partcls[ind-1].u = -10;
			// partcls[ind].v = -200;
			// partcls[ind+1].u = 10; 
			// marker = 0;
			// exper.innerHTML = 'Волна на границе двух масс';
		// }
		// if (N_exp == 4) {
			// for (var i = 1;i<= parseInt(N/3);i++) {partcls[i].m = 3;}
			// for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			// ind = parseInt(N/2);
			// partcls[ind].v = -200;
			// marker = 1;
			// exper.innerHTML = 'Симметричное возмущение на границе двух масс';
		// }
		// if (N_exp == 5) { // пускаем волну косинуса
			// надо расположить частицы по косинусу
			// var fst = document.getElementById('first2').value % N;
			// if (fst == 0) { fst = N;}
			// var lambda = document.getElementById('howmany').value;
			// var len = document.getElementById('area').value;
			// for (q = fst; q<=lambda*len+fst-1; q++) { 
				// if (q > N) { 
					// var qn = q % N;
				// } else { var qn = q;}
				// if (qn == 0) { qn = N;}
				// partcls[qn].u = Math.cos(2*Math.PI*(qn - fst)/(lambda));
				// partcls[qn].v = -(dist-2*r)*Math.pow(C,1/2)*Math.sin((qn-fst)*2*Math.PI/(lambda*(dist-2*r)))*2*Math.PI/(lambda*(dist-2*r));
			// }
			// y_scale = 30;
			// marker = 2;
			// exper.innerHTML = 'Волна косинуса';
		// }
		// if (N_exp == 6) { // пускаем волну синуса
			// var fst = document.getElementById('first2').value % N;
			// var lambda = parseInt(document.getElementById('howmany').value);
			// var len = parseInt(document.getElementById('area').value);
			// console.log(fst,lambda,len);
			// for (q = fst; q<=lambda*len+fst-1; q++) { 
				// if (q > N) { 
					// var qn = q % N;
				// } else { var qn = q;}
				// partcls[qn].u = Math.sin(2*Math.PI*(qn - fst)/(lambda));
				// partcls[qn].v = -2*Math.pow(C,1/2)*Math.sin(2*Math.PI*(qn - fst)/(lambda)/2)*Math.cos(2*Math.PI*(qn - fst)/(lambda));
				
			// }
			// marker = 2;
			// exper.innerHTML = 'Волна синуса';
		// }
		// if (N_exp == 7) { 
			// попробуем задать гауссиан.
			
			// var c = Math.pow(C,1/2)*(dist-2*r);
			// for (q = 20; q<=40; q++) {
				// partcls[q].u = Math.exp(-Math.pow(q-30,2)/18);
				// partcls[q].v = -1*c*Math.exp(-Math.pow(q-30,2)/18)*(30-q)/9;
			// }
			// y_scale = 5;
			// marker = 0;
			// exper.innerHTML = 'Гауссиан';
		// }
		// if (N_exp == 8) { // эксперимент с изотопами углерода. конц 50 проц
			// var numC = parseInt(0.01*N); // количество C13 
			// for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			// for (q = 1; q<=numC; q++) { 
				// while (1) {
					// var i = parseInt(Math.random()*N)+1;
					// if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						// partcls[i].m = (parseFloat(13/12));
						// partcls[i].rgb = "rgba(15,15,15,255)"
						// break
					// }
				// }
			// }
			// y_scale = 1.4;
			// var ind = parseInt(N/5);
			// partcls[ind].v = parseFloat(document.getElementById('v').value);
			// marker = 0;
			// exper.innerHTML = 'Изотоп углерода, концентрация 1%';
		// }
		
		// if (N_exp == 9) { // эксперимент с изотопами углерода. конц 50 проц
			// var numC = parseInt(0.5*N); // количество C13 
			// for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			// for (q = 1; q<=numC; q++) { 
				// while (1) {
					// var i = parseInt(Math.random()*N)+1;
					// if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						// partcls[i].m = (parseFloat(13/12));
						// partcls[i].rgb = "rgba(15,15,15,255)"
						// break
					// }
				// }
			// }
			// y_scale = 1.4;
			// var ind = parseInt(N/5);
			// partcls[ind].v = parseFloat(document.getElementById('v').value);
			// marker = 0;
			// exper.innerHTML = 'Изотоп углерода, концентрация 50%';
		// }
		// if (N_exp == 10) { // эксперимент с изотопами углерода. конц 50 проц
			// y_scale = 1.4;
			// var numC = parseInt(0.99*N); // количество C13 
			// for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			// for (q = 1; q<=numC; q++) { 
				// while (1) {
					// var i = parseInt(Math.random()*N)+1;
					// if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						// partcls[i].m = (parseFloat(13/12));
						// partcls[i].rgb = "rgba(15,15,15,255)"
						// break
					// }
				// }
			// }
			// var ind = parseInt(N/5);
			// partcls[ind].v = parseFloat(document.getElementById('v').value);
			// marker = 0;
			// exper.innerHTML = 'Изотоп углерода, концентрация 99%';
		// }
		
		// if (N_exp) {
			// теперь раскрасим частицы в соответствующие цвета
			// check_exp(marker);
			// теперь разграничим области масс
			// draw_mass();
		// }
		
	// }
	// function check_exp (mark) { 
			// if (marker == 2) { 
				// for_wave.style.display = 'none';
				// wave.style.display = 'inline';
			// } else { 
					// if (marker == 1) {
						// for_wave.style.display = 'inline';
						// wave.style.display = 'none';
					// } else {
						// for_wave.style.display = 'none';
						// wave.style.display = 'none';
					// }
			// }
	// }
	// function set_mass(N_exp) { 
		// if (N_exp == 1) {
			// for (q = 1; q<= parseInt(N/2); q++) { 
				// partcls[parseInt(2*q - 1)].m = parseFloat(document.getElementById('exp1_1').value);
				// partcls[parseInt(2*q)].m = parseFloat(document.getElementById('exp1_2').value);
			// }
			// exp1.style.display = 'inline';
			// exp2.style.display = 'none';
		// }
		// if (N_exp == 2) {
			// for (q = 1; q<= N; q++) { 
				// partcls[q].m = q;
			// }
			// exp1.style.display = 'none';
			// exp2.style.display = 'inline';
		// }
	// }
	// change_mass = function() { 
		// count(N);
		// set_mass(document.getElementById('mass_ex').value);
		// for (q = 1; q<= N; q++) { 
			// var c = String(255-partcls[q].m*75);
			// partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
			// ctx.beginPath();
			// ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			// ctx.fillStyle = partcls[q].rgb;
			// ctx.fill();
			// ctx.stroke();
		// }
		// draw_mass();
	// }
	// mass_ex.onchange = function () {
		// change_mass();
	// }
	// exp1_1.onchange = function () { 
		// change_mass();
	// }
	// exp1_2.onchange = function () { 
		// change_mass();
	// }
	
	
	// num.onchange = function() { 
		// if (num.value == 0) { exper.innerHTML = '';}
		// N = (Number(document.getElementById('Quantity').value));
		// count(N);
		// set_exp(Number(document.getElementById('num').value));
		// flag = 0;
		// document.getElementById('yscale').value = y_scale;
	// }
	
	function control() {
		phys();
		draw();
		drawLine();
	}
	count(N,N);
	// присвоим массы
	// for (var i = 1; i<= N; i++) { 
		// for (var j = parseInt(N/2); j<= N; j++) {
			// partcls[i][j].m = 3;
		
		// }
	// }
	// зададим квазичастицу!
	// зададим с центром в произвольной точке x0,y0
	// надо задать диаметр круга, допустим у нас 101*101 частиц
	// пусть диаметр в 30 частиц
	var D = 150;
	var R = parseInt(D/2);
	// введем номер начальной частицы
	var i0 = 150;
	var j0 = 150;
	// волновой вектор
	var q = [];
	q.x = 30;
	q.y = 30;
	// надо понять длину волнового вектора в пикселях
	// ВАРИАНТ 1
	// var radius;
	// var dist = partcls[10][11].x - partcls[10][10].x - 2*r; // расстояние между частицами, его мы тоже должны учесть
	// теперь хотим длину вектора волнового на холсте
	// var q_lenx = q.x*2*r + (q.x - 1)*dist*Math.pow(2,1/2);
	// var q_leny = q_lenx;
	// var q_lenx = partcls[50][50].x - partcls[50-q.x][50-q.y].x;
	// var q_leny = partcls[50][50].y - partcls[50-q.x][50-q.y].y;
	// узнаем расстояние до 15 частицы 
	// var po = partcls[50][50].x - partcls[50][50-R].x + r; // r - запас
	// var omega = 2*Math.pow(C/m,1/2)*Math.pow(Math.pow(Math.sin(Math.PI/(q_lenx)),2)+Math.pow(Math.sin(Math.PI/q_leny),2),1/2);
	// po нам нужно для того, чтобы понять для каких частиц задавать н.у
	// for (var i = 1; i<= nh; i++) {
		// for (var j = 1; j<= nw; j++) { 
			// radius = Math.pow(Math.pow(partcls[i][j].x - partcls[i0][j0].x,2)+Math.pow(partcls[i][j].y - partcls[i0][j0].y,2),1/2);
			// попробуем по другому, будем считать в частицах 
			// расстояние - это разница номеров частиц 
			// if (radius <= po) {
				// partcls[i][j].u = Math.pow(Math.cos(Math.PI*radius/(2*po)),2)*Math.sin(2*Math.PI*(1/(q_lenx)*(partcls[i][j].x - partcls[i0][j0].x)+1/(q_leny)*(partcls[i][j].y - partcls[i0][j0].y)));
				// partcls[i][j].v = -omega*Math.pow(Math.cos(Math.PI*radius/(2*po)),2)*Math.cos(2*Math.PI*(1/(q_lenx)*(partcls[i][j].x - partcls[i0][j0].x)+1/(q_leny)*(partcls[i][j].y - partcls[i0][j0].y)));
				// console.log(po,radius,partcls[i][j].u,partcls[i][j].v);
			// }
		// }
	// }
	// ВАРИАНТ 2
	var radius;var rad;
	var a = partcls[10][10].x - partcls[10][9].x;
	var po = a*R; // r - запас
	// q.x = q.x*a; q.y = q.y*a;
	// var dist = partcls[10][11].x - partcls[10][10].x - 2*r; // расстояние между частицами, его мы тоже должны учесть
	// теперь хотим длину вектора волнового на холсте
	// var q_lenx = q.x*2*r + (q.x - 1)*dist*Math.pow(2,1/2);
	// var q_leny = q_lenx;
	// зададим массы другие половине частиц разделяя по диагонали
	for (i = 1; i <= nw; i++) { 
		for (j = 0; j<=parseInt(N/2)-1; j++) {
			partcls[N-j][i].m = 1.5;
			var c = String(255-1.5*75); partcls[N-j][i].rgb = "rgba("+c+","+c+","+c+",255)";
		}
	}
	var omega = 2*Math.pow((C/m)*(Math.pow(Math.sin(Math.PI/q.x),2) + Math.pow(Math.sin(Math.PI/q.y),2)),1/2);
	// po нам нужно для того, чтобы понять для каких частиц задавать н.у
	for (var i = 1; i<= nh; i++) {
		for (var j = 1; j<= nw; j++) { 
			// radius = Math.pow(Math.pow(partcls[i][j].x - partcls[i0][j0].x,2)+Math.pow(partcls[i][j].y - partcls[i0][j0].y,2),1/2);
			rad = Math.pow(Math.pow(i - i0,2) + Math.pow(j - j0,2),1/2);
			// попробуем по другому, будем считать в частицах 
			// расстояние - это разница номеров частиц 
			if (rad<=R) {
				partcls[i][j].u = Math.pow(Math.cos(Math.PI*rad/D),2)*Math.sin(2*Math.PI*(1/(q.x)*(j-j0)+1/(q.y)*(i-i0)));
				partcls[i][j].v = -omega*Math.pow(Math.cos(Math.PI*rad/D),2)*Math.cos(2*Math.PI*(1/(q.x)*(j-j0)+1/(q.y)*(i-i0)));
				// console.log(po,radius,partcls[i][j].u,partcls[i][j].v);
			}
		}
	}
	// Ek = 0;
	// Ep = 0;
	// for (var i = 1; i<= nh; i++) {
		// for (var j = 1; j<= nw; j++) { 
			// Ek += 1/2*partcls[i][j].m*partcls[i][j].v*partcls[i][j].v;
			// Ep += 1/4*C*(Math.pow(partcls[i][j].u - partcls[i-1][j].u,2)+Math.pow(partcls[i][j].u - partcls[i][j-1].u,2) + Math.pow(partcls[i][j].u - partcls[i+1][j].u,2) + Math.pow(partcls[i][j].u - partcls[i][j+1].u,2));
		// }
	// }
	// console.log(Ek/Ep);
	flag = 0;
	marker = 1;
	N = Number(document.getElementById('Quantity').value);
	// i = document.getElementById('first').value % N;
	// partcls[5][5].u = 10;
	// for (var i = 1; i<= N; i++) { 
		// for (var j = 10; j<= 29; j++) {
			// partcls[i][j].u = Math.cos(2*Math.PI/19*(j-10)) - 1;
			// partcls[i][j].v = omega*Math.sin(2*Math.PI/19*(j-10));
		// }
	// }
	document.getElementById('num').value = 0;
	// draw_mass ();
	// check_exp(marker);
	// exper.innerHTML = '';
	// draw_mass();
	// set_exp(1);
	interv = setInterval(control,1000/fps);
}