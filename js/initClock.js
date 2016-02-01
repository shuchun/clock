	 /* 常量、全局变量 */
	 const R=8;//小球半径
	 const D=2*(R+1);//小球所占位置宽度
	 //const END_TIME=new Date(2014,10,30,5,30,00);//倒计时的结束时间
	 const END_TIME=initEndTime();//倒计时的结束时间
	 const WINDOW_WIDTH=document.documentElement.clientWidth;//客户端浏览器有效宽度
	 const WINDOW_HEIGHT=document.documentElement.clientHeight;//客户端浏览器有效高度
	 var WIDTH=WINDOW_WIDTH;//画布宽度
	 var HEIGHT=WINDOW_HEIGHT*3/5;//画布高度
	 var TOP_MARGIN=HEIGHT/5;//数字的顶部空白
	 var LEFT_MARGIN=WIDTH/6;//数字左方空白

	 var curShowTimeSeconds=0;//当前展示时间
	 //彩球颜色值
	 var ballColor=["#33b5e5","#0099cc","#aa66cc","#9933cc","#9900cc",
	 				"#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];
	 var balls=[];//新彩球

	/* 方法 */
	function initEndTime(){
		var end=new Date();
		end.setHours(end.getHours()+10);
		return end;
	}
	//默认执行方法
	window.onload=function(){
		var canvas=document.getElementById('canvas');//获取画布对象
		canvas.width=WIDTH;//设定宽度
		canvas.height=HEIGHT;//设定高度

		var context=canvas.getContext('2d');//获取2d上下文

		curShowTimeSeconds=getCurrentShowTimeSeconds();//当前展示时间

		//设置定时器
		setInterval(function(){
			
			//绘制数字
			drawDigit(context);
			//跟新彩球数字
			update();
		},50);

	}

	//获取应展示数字
	function getCurrentShowTimeSeconds(){
		var curTime=new Date();//当前时间
		var ret=END_TIME.getTime()-curTime.getTime();//倒计时时间
		//由于时间小时位数只有两位，所以限定最大时间差
		ret=Math.round(ret/1000);

		//限制最小时间差
		return ret>=0?ret:0;
	}

	//更新时间与彩球
	function update(){
		//下一秒显示数字
		var nextShowSeconds=getCurrentShowTimeSeconds();

		//下一秒小时位显示数值
		var nextHour=parseInt(nextShowSeconds/3600);
		//下一秒分钟位显示数值
		var nextMinuts=parseInt(nextShowSeconds/60-nextHour*60);
		//下一秒秒位显示数值
		var nextSecond=nextShowSeconds%60;

		//当前小时位显示数值
		var curHour=parseInt(curShowTimeSeconds/3600);
		//当前分钟位显示数值
		var curMinuts=parseInt(curShowTimeSeconds/60-curHour*60);
		//当前秒位显示数值
		var curSecond=curShowTimeSeconds%60;

		//如果当前秒位与下一秒数值显示不同
		if(nextSecond != curSecond){

			//判断下一秒小时位第一位数值是否变动
			if(parseInt(nextHour/10)!=parseInt(curHour/10)){
				//有变动产生变动的数值的彩球
				addBall(LEFT_MARGIN,TOP_MARGIN,parseInt(nextHour/10));
			}
			//判断下一秒小时位第二位数值是否变动
			if((nextHour%10)!=(curHour%10)){
				addBall(LEFT_MARGIN+8*D,TOP_MARGIN,nextHour%10);
			}

			if(parseInt(nextMinuts/10)!=parseInt(curMinuts/10)){
				addBall(LEFT_MARGIN+19*D,TOP_MARGIN,parseInt(nextMinuts/10));
			}
			if((nextMinuts%10)!=(curMinuts%10)){
				addBall(LEFT_MARGIN+27*D,TOP_MARGIN,nextMinuts%10);
			}

			if(parseInt(nextSecond/10)!=parseInt(curSecond/10)){
				addBall(LEFT_MARGIN+38*D,TOP_MARGIN,parseInt(nextSecond/10));
			}
			if(nextSecond%10!=curSecond%10){
				addBall(LEFT_MARGIN+46*D,TOP_MARGIN,nextSecond%10);
			}

			//更新当前展示数值为下一秒的数值
			curShowTimeSeconds=nextShowSeconds;
		}

		//更新彩球
		updateBalls();
	}

	//添加彩球
	function addBall(x,y,num){

		var dig=digit[num];//获取数值

		//遍历数值的每一行
		for(var i=0;i<dig.length;i++){
			//遍历数字当前行的每一列
			for(var j=0;j<dig[i].length;j++){
				//如果数值的当前格为1，则添加一个彩球
				if(dig[i][j]==1){

					//通过小球的行列以及半径计算该球的x,y坐标
					var px=D*(j-1)+(R+1)+x;
					var py=D*(i-1)+(R+1)+y;

					//定义一个彩球对象
					var aball={
						x:px,
						y:py,
						color:ballColor[Math.floor(Math.random()*ballColor.length)],//随机一个颜色
						vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//x方向的速度
						vy:-5,//y方向的速度
						g:1.5+Math.random()//重力加速度
					};

					//将彩球添加到彩球集合中
					balls.push(aball);
				}
			}
		}
	}

	//跟新彩球
	function updateBalls(){

		var cnt=0;//有效彩球个数
		//遍历所有彩球
		for(var i=0;i<balls.length;i++){
			balls[i].x+=balls[i].vx;
			balls[i].y+=balls[i].vy;
			balls[i].vy+=balls[i].g;

			//边缘碰撞检测，y方向
			if(balls[i].y>=HEIGHT-R){
				balls[i].y=HEIGHT-R;
				balls[i].vy=-balls[i].vy*0.2;
			}

			//Math.floor(Math.random()*LEFT_MARGIN)
			//边缘碰撞检测，x方向
			if(balls[i].x+R>=0 && balls[i].x+R<=WIDTH){

				//还在画布内算作有效彩球
				balls[cnt++]=balls[i];
			}
		}

		//控制彩球数量超出范围清除掉
		while(balls.length>Math.min(350,cnt)){
			balls.pop();
		}

	}

	//绘制数字
	function drawDigit(ctx){

		var hour=parseInt(curShowTimeSeconds/3600);//小时
		var minuts=parseInt(curShowTimeSeconds/60-hour*60);//分钟
		var second=curShowTimeSeconds%60;//秒

		ctx.clearRect(0,0,WIDTH,HEIGHT);//清空画布
		//console.log(hour+":"+minuts+":"+second);

		/*  渲染数值 */
		randDigit(LEFT_MARGIN,TOP_MARGIN,parseInt(hour/10),ctx);
		randDigit(LEFT_MARGIN+8*D,TOP_MARGIN,hour%10,ctx);

		randDigit(LEFT_MARGIN+15*D,TOP_MARGIN,10,ctx);

		randDigit(LEFT_MARGIN+19*D,TOP_MARGIN,parseInt(minuts/10),ctx);
		randDigit(LEFT_MARGIN+27*D,TOP_MARGIN,minuts%10,ctx);

		randDigit(LEFT_MARGIN+34*D,TOP_MARGIN,10,ctx);

		randDigit(LEFT_MARGIN+38*D,TOP_MARGIN,parseInt(second/10),ctx);
		randDigit(LEFT_MARGIN+46*D,TOP_MARGIN,second%10,ctx);

		//绘制彩球
		for(var i=0;i<balls.length;i++){
			var aball=balls[i];
			ctx.fillStyle=aball.color;
			//console.info(aball);

			ctx.beginPath();
			ctx.arc(aball.x,aball.y,R,0,2*Math.PI,true);
			ctx.closePath();

			ctx.fill();
		}
	}

	//绘制基础数字
	function randDigit(x,y,num,ctx){
		//console.log(num);
		var dig=digit[num];

		//遍历数值行
		for(var i=0;i<dig.length;i++){

			//遍历数值列
			for(var j=0;j<dig[i].length;j++){

				//该格要显示小球，就进行绘制
				if(dig[i][j]==1){

					var px=D*(j-1)+(R+1)+x;//x坐标
					var py=D*(i-1)+(R+1)+y;//y坐标
					ctx.fillStyle="blue";//小球颜色
					ctx.beginPath();//开始绘制路径
					ctx.arc(px,py,R,0,2*Math.PI);//设置小球路径
					ctx.closePath();//结束绘制路径

					//绘制小球
					ctx.fill();
				}
			}

		}

	}
