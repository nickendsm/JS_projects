//
//
// Бегающие квазичастицы, начальное распределение задано по синусу, строится график амплитуды, показывается, что расходится с Бесселем
//
//
//


window.addEventListener('load',main,false);
function main () {
	var mathMethods = Object.getOwnPropertyNames(Math);
	for (var i in mathMethods)
		this[mathMethods[i]] = Math[mathMethods[i]];
	var M = Math;
	// основной канвас
	var ctx = canvas_ex.getContext('2d');
	var w = canvas_ex.width;
	var h = canvas_ex.height;
	
	// канвас для графиков
	var ctx_g = canvas_g.getContext('2d');
	var w_g = canvas_g.width;
	var h_g = canvas_g.height;
	
	// канвас для графика амплитуды
	var ctx_a = canvas_t.getContext('2d');
	var w_a = canvas_t.width;
	var h_a = canvas_t.height;
	
	// узнаем количество частиц в столбце 
	var number = NumP.value;
	nums.innerHTML = number;
	var t;
	
	// параметры для моделирования
	var dt = 0.01;
	var t_curr; 
	var dx; var dx_2;
	var fps = 60;
	var length = 0; // количество частиц в общем
	var r; var r_2; // переменная для радиуса частиц
	var interv;
	var particles = [];	// массив частиц
	var N = new Array(number); // массив для счета количества частиц в полосе 
	var sum = 0; var coeff; var sum_prev; var sum2 = 0; var sum2_prev; var sum3 = 0; var sum3_prev;
	NumP.onchange = function () { nums.innerHTML = NumP.value; number = NumP.value; count(number);}
	count(number);
	
	// в зависимость от количества частиц в столбике, мы разбиваем область на определенное количество столбиков
	// значит и столбиков будет столько же, сколько частиц
	///
	///
	/// ДЛЯ ФУНКЦИЙ БЕССЕЛЯ
	///
	function _horner(arr, v) { for(var i = 0, z = 0; i < arr.length; ++i) z = v * z + arr[i]; return z; }
	function _bessel_iter(x, n, f0, f1, sign) {
	  if(n === 0) return f0;
	  if(n === 1) return f1;
	  var tdx = 2 / x, f2 = f1;
	  for(var o = 1; o < n; ++o) {
		f2 = f1 * o * tdx + sign * f0;
		f0 = f1; f1 = f2;
	  }
	  return f2;
	}
	function _bessel_wrap(bessel0, bessel1, name, nonzero, sign) {
	  return function bessel(x,n) {
		if(nonzero) {
		  if(x === 0) return (nonzero == 1 ? -Infinity : Infinity);
		  else if(x < 0) return NaN;
		}
		if(n === 0) return bessel0(x);
		if(n === 1) return bessel1(x);
		if(n < 0) return NaN;
		n|=0;
		var b0 = bessel0(x), b1 = bessel1(x);
		return _bessel_iter(x, n, b0, b1, sign);
	  };
	}
	var besselj = (function() {
  var W = 0.636619772; // 2 / Math.PI

  var b0_a1a = [57568490574.0, -13362590354.0, 651619640.7, -11214424.18, 77392.33017, -184.9052456].reverse();
  var b0_a2a = [57568490411.0, 1029532985.0, 9494680.718, 59272.64853, 267.8532712, 1.0].reverse();
  var b0_a1b = [1.0, -0.1098628627e-2, 0.2734510407e-4, -0.2073370639e-5, 0.2093887211e-6].reverse();
  var b0_a2b = [-0.1562499995e-1, 0.1430488765e-3, -0.6911147651e-5, 0.7621095161e-6, -0.934935152e-7].reverse();

  function bessel0(x) {
    var a=0, a1=0, a2=0, y = x * x;
    if(x < 8) {
      a1 = _horner(b0_a1a, y);
      a2 = _horner(b0_a2a, y);
      a = a1 / a2;
    } else {
      var xx = x - 0.785398164;
      y = 64 / y;
      a1 = _horner(b0_a1b, y);
      a2 = _horner(b0_a2b, y);
      a = M.sqrt(W/x)*(M.cos(xx)*a1-M.sin(xx)*a2*8/x);
    }
    return a;
  }

  var b1_a1a = [72362614232.0, -7895059235.0, 242396853.1, -2972611.439, 15704.48260, -30.16036606].reverse();
  var b1_a2a = [144725228442.0, 2300535178.0, 18583304.74, 99447.43394, 376.9991397, 1.0].reverse();
  var b1_a1b = [1.0, 0.183105e-2, -0.3516396496e-4, 0.2457520174e-5, -0.240337019e-6].reverse();
  var b1_a2b = [0.04687499995, -0.2002690873e-3, 0.8449199096e-5, -0.88228987e-6, 0.105787412e-6].reverse();

  function bessel1(x) {
    var a=0, a1=0, a2=0, y = x*x, xx = M.abs(x) - 2.356194491;
    if(Math.abs(x)< 8) {
      a1 = x*_horner(b1_a1a, y);
      a2 = _horner(b1_a2a, y);
      a = a1 / a2;
    } else {
      y = 64 / y;
      a1=_horner(b1_a1b, y);
      a2=_horner(b1_a2b, y);
      a=M.sqrt(W/M.abs(x))*(M.cos(xx)*a1-M.sin(xx)*a2*8/M.abs(x));
      if(x < 0) a = -a;
    }
    return a;
  }

  return function besselj(x, n) {
    n = Math.round(n);
    if(!isFinite(x)) return isNaN(x) ? x : 0;
    if(n < 0) return ((n%2)?-1:1)*besselj(x, -n);
    if(x < 0) return ((n%2)?-1:1)*besselj(-x, n);
    if(n === 0) return bessel0(x);
    if(n === 1) return bessel1(x);
    if(x === 0) return 0;

    var ret=0.0;
    if(x > n) {
      ret = _bessel_iter(x, n, bessel0(x), bessel1(x),-1);
    } else {
      var m=2*M.floor((n+M.floor(M.sqrt(40*n)))/2);
      var jsum=false;
      var bjp=0.0, sum=0.0;
      var bj=1.0, bjm = 0.0;
      var tox = 2 / x;
      for (var j=m;j>0;j--) {
        bjm=j*tox*bj-bjp;
        bjp=bj;
        bj=bjm;
        if (M.abs(bj) > 1E10) {
          bj *= 1E-10;
          bjp *= 1E-10;
          ret *= 1E-10;
          sum *= 1E-10;
        }
        if (jsum) sum += bj;
        jsum=!jsum;
        if (j == n) ret=bjp;
      }
      sum=2.0*sum-bj;
      ret /= sum;
    }
    return ret;
  };
})();
	///
	///
	///
	
	function count(num){
		// счетчик времени
		A = [];
		T = [];
		t = -1;
		t_curr = 0;
		// очистим канвас отрисовки по времени
		ctx_a.clearRect(0,0,w_a,h_a);
		ctx_a.beginPath();
		
		ctx_a.moveTo(0,h_a/2);
		ctx_a.lineTo(w_a,h_a/2);
		ctx_a.stroke();
		clearint(interv);
		// функция, которая будет отрисовывать начальное положение частиц
		// узнаем радиус одной частицы 
		r = parseInt(w/num/2);
		r_2 = 2*r; // для ускорения процесса при отрисовке графиков
		dx = parseInt(w/num); // ширина полосы
		dx_2 = dx/2; // для ускорения работы программы
		coeff = 2*Math.PI/num;
		function func(k) { 
			return Math.floor((Math.sin(coeff*k) + 1)*num); // количество частиц в текущем слое 
		}
		// теперь создаем эти частицы
		length = 0;
		// коэффициент для дальнейших расчетов амплитуд
		particles = [];

		for (var i=0; i<num; i++) { // это по вертикальным полоскам идем
			// надо узнать сколько будет частиц в полоске
			var howmany = func(i);
			length += howmany;
			for (var j = 0; j<howmany; j++) { // по частицам в полосе 
				// каждой частице рандомную скорость и рандомное направление
				var theta = Math.random()*2*Math.PI;
				var phi = Math.acos(1-2*Math.random());
				var x_curr = dx*i;// начальный икс
				particles.push(
					new Particle(
					x_curr + Math.random()*dx+0.00001,
					Math.random()*h,
					Math.random()*h,
					500*Math.sin(phi) * Math.cos(theta),
					500*Math.sin(phi) * Math.sin(theta),
					500*Math.cos(phi)
					)
				);
				particles[j].draw();
			}	
		}
		t+=1;
		N = new Array(parseInt(number));
		for (var i = 0; i< num; i++) { N[i] = 0;}
		// надо сосчитать плотность, для этого надо сосчитать количество частиц в каждой полосе
		for (var i = 0; i< length; i++) { 
			// идем по частицам 
			ind = parseInt(particles[i].x/dx - 0.0001)
			N[ind] += 1;
		}
		// теперь считаем амплитуду 
		sum = 0;
		for (var i = 0; i< number; i++) {
			// sum += (N[i]/(2*number))*Math.sin(coeff*i);
			sum += (N[i]/number)*Math.sin(coeff*i);
		}
		sum = 2*sum/(number);
		interv = setInterval(control,1000/fps);
		console.log(t);
		T[t] = t;
		A[t] = sum;
	}
		
	

	
	function Particle(x=0,y=0,z=0,vx=0,vy=0,vz=0) {
		var that = this;
		this.x = x;
		this.y = y;
		this.z = z;
		this.vx = vx;
		this.vy = vy;
		this.vz = vz;

		this.info = function () {
			console.log('Position: ('+that.x+', '+that.y+', '+that.z+')\nVelocity: ('+that.vx+', '+that.vy+','+that.vz+')');
		}
		this.move = function() {
						// надо теперь учесть периодичность:
			if (that.x <= 0) { // тогда 
				that.x = that.x + w;
			}
			if (that.x >= w) {
				that.x = that.x - w;
			}
			if (that.y <= 0) { // тогда 
				that.y = that.y + h;
			}
			if (that.y >= h) {
				that.y = that.y - h;
			}
			if (that.z <= 0) {
				that.z += h;
			}
			if (that.z >= h) { 
				that.z -= h;
			}
			that.x += that.vx*dt;
			that.y += that.vy*dt;
			that.z += that.vz*dt;
		}
		
		
		
		this.draw = function() {
			if (that.x <= r) { // то рисуем частицу с другой стороны 
				ctx.beginPath();
				ctx.arc(that.x+w, that.y, r, 0 ,2*Math.PI);
				ctx.stroke();
			}
			if (that.x + r >= w) { // то рисуем частицу с другой стороны
				ctx.beginPath();
				ctx.arc(that.x-w, that.y, r, 0 ,2*Math.PI);
				ctx.stroke();
			}
			// тоже самое по игрику 
			if (that.y <= r) { 
				ctx.beginPath();
				ctx.arc(that.x, that.y+h, r, 0 ,2*Math.PI);
				ctx.stroke();
			}
			if (that.y + r >= h) { 
				ctx.beginPath();
				ctx.arc(that.x, that.y-h, r, 0 ,2*Math.PI);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.arc(that.x, that.y, r, 0 ,2*Math.PI);
			ctx.stroke();
		}
		
	}
	
	function phys () {
		for (var i=0; i<length; i++) {
			 particles[i].move();
		 }
	}
	function draw () { 
		ctx.clearRect(0,0,w,h);
		for (var i=0; i<length; i++) {
			 particles[i].draw();
		 }
	}
	function draw_graf() { 
		t += 1;
		t_curr += dt;
		sum_prev = sum;
		sum2_prev = sum2;
		sum3_prev = sum3;
		N = new Array(parseInt(number));
		for (var i = 0; i< number; i++) { N[i] = 0;}
		ctx_g.clearRect(0,0,w_g,h_g);
		// надо сосчитать плотность, для этого надо сосчитать количество частиц в каждой полосе
		for (var i = 0; i<length; i++) { 
			// идем по частицам 
			ind = parseInt(particles[i].x/dx - 0.0001)
			N[ind] += 1;
		}
		// теперь считаем амплитуду 
		sum = 0;
		for (var i = 0; i< number; i++) {
			sum += (N[i]/number)*Math.sin(coeff*i);
		}
		sum = 2*sum/number;
		T[t] = t;
		A[t] = sum;
		sum2 = Math.sin(coeff*500/dx*t_curr)/coeff/500/t_curr*dx;
		// рисуем график в виде частиц шириной в полосу
		ctx_g.beginPath();
		ctx_g.moveTo(dx_2,h_g - N[0]/number/5*h_g);
		for (var i = 1; i<number; i++) { 
			// по количеству полос
			var p = dx*i + dx_2; // координата текущей полоски
			ctx_g.lineTo(p,h_g - N[i]/number/5*h_g);
		}
		ctx_g.stroke();
		// считаем функцию Бесселя
		sum3 = besselj(coeff*500/dx*t_curr, 0);
		// отрисовка
		ctx_a.beginPath();
		ctx_a.moveTo(t-1,h_a/2 - sum_prev*100);
		ctx_a.lineTo(t,h_a/2 - sum*100);
		ctx_a.strokeStyle = 'black';
		ctx_a.stroke();
		ctx_a.beginPath();
		ctx_a.moveTo(t-1,h_a/2 - sum2_prev*100);
		ctx_a.lineTo(t,h_a/2 - sum2*100);
		ctx_a.strokeStyle = 'blue';
		ctx_a.stroke();
		ctx_a.beginPath();
		ctx_a.moveTo(t-1,h_a/2 - sum3_prev*100);
		ctx_a.lineTo(t,h_a/2 - sum3*100);
		ctx_a.strokeStyle = 'red';
		ctx_a.stroke();
		if (t == 1000) { 
			var element = document.createElement('a');
			for (i = 0; i<1000; i++) {
				element.setAttribute('href', 'data:text/plain;charset=utf-8,'+ encodeURIComponent(A) +"\n");
			}
			element.setAttribute('download', 'file.txt');

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}
	}
	function clearint (interv) { 
		clearInterval(interv);
	}
	function control() { 
		phys();
		draw();
		draw_graf();
	}
	

}
	