	 const R=8;
	 const D=2*(R+1);
	 const END_TIME=new Date(2014,10,30,5,30,00);
	 const WINDOW_WIDTH=document.documentElement.clientWidth;
	 const WINDOW_HEIGHT=document.documentElement.clientHeight;
	 var WIDTH=WINDOW_WIDTH;
	 var HEIGHT=WINDOW_HEIGHT*3/5;
	 var TOP_MARGIN=HEIGHT/5;
	 var LEFT_MAGFIN=WIDTH/6;

	 var curShowTimeSeconds=0;
	 var ballColor=["#33b5e5","#0099cc","#aa66cc","#9933cc","#9900cc",
	 				"#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];
	 var balls=[];

	window.onload=function(){
		var canvas=document.getElementById('canvas');
		canvas.width=WIDTH;
		canvas.height=HEIGHT;

		var context=canvas.getContext('2d');

		curShowTimeSeconds=getCurrentShowTimeSeconds();

		setInterval(function(){
			
			drawDigit(context);
			update();
		},50);

	}

	function getCurrentShowTimeSeconds(){
		var curTime=new Date();
		var ret=END_TIME.getTime()-curTime.getTime();
		ret=Math.round(ret/1000);

		return ret>=0?ret:0;
	}

	function update(){
		var nextShowSeconds=getCurrentShowTimeSeconds();

		var nextHour=parseInt(nextShowSeconds/3600);
		var nextMinuts=parseInt(nextShowSeconds/60-nextHour*60);
		var nextSecond=nextShowSeconds%60;

		var curHour=parseInt(curShowTimeSeconds/3600);
		var curMinuts=parseInt(curShowTimeSeconds/60-curHour*60);
		var curSecond=curShowTimeSeconds%60;

		if(nextSecond != curSecond){

			if(parseInt(nextHour/10)!=parseInt(curHour/10)){
				addBall(LEFT_MAGFIN,TOP_MARGIN,parseInt(nextHour/10));
			}
			if((nextHour%10)!=(curHour%10)){
				addBall(LEFT_MAGFIN+8*D,TOP_MARGIN,nextHour%10);
			}

			if(parseInt(nextMinuts/10)!=parseInt(curMinuts/10)){
				addBall(LEFT_MAGFIN+19*D,TOP_MARGIN,parseInt(nextMinuts/10));
			}
			if((nextMinuts%10)!=(curMinuts%10)){
				addBall(LEFT_MAGFIN+27*D,TOP_MARGIN,nextMinuts%10);
			}

			if(parseInt(nextSecond/10)!=parseInt(curSecond/10)){
				addBall(LEFT_MAGFIN+38*D,TOP_MARGIN,parseInt(nextSecond/10));
			}
			if(nextSecond%10!=curSecond%10){
				addBall(LEFT_MAGFIN+46*D,TOP_MARGIN,nextSecond%10);
			}

			curShowTimeSeconds=nextShowSeconds;
		}

		updateBalls();
	}

	function addBall(x,y,num){
		var dig=digit[num];
		for(var i=0;i<dig.length;i++){
			for(var j=0;j<dig[i].length;j++){
				if(dig[i][j]==1){
					var px=D*(j-1)+(R+1)+x;
					var py=D*(i-1)+(R+1)+y;

					var aball={
						x:px,
						y:py,
						color:ballColor[Math.floor(Math.random()*ballColor.length)],
						vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
						vy:-5,
						g:1.5+Math.random()
					};

					balls.push(aball);
				}
			}
		}
	}

	function updateBalls(){

		var cnt=0;
		for(var i=0;i<balls.length;i++){
			balls[i].x+=balls[i].vx;
			balls[i].y+=balls[i].vy;
			balls[i].vy+=balls[i].g;

			if(balls[i].y>=HEIGHT-R){
				balls[i].y=HEIGHT-R;
				balls[i].vy=-balls[i].vy*0.2;
			}

			//Math.floor(Math.random()*LEFT_MAGFIN)
			if(balls[i].x+R>=0 && balls[i].x+R<=WIDTH){
				balls[cnt++]=balls[i];
			}
		}

		while(balls.length>Math.min(350,cnt)){
			balls.pop();
		}

	}

	function drawDigit(ctx){



		var hour=parseInt(curShowTimeSeconds/3600);
		var minuts=parseInt(curShowTimeSeconds/60-hour*60);
		var second=curShowTimeSeconds%60;

		ctx.clearRect(0,0,WIDTH,HEIGHT);

		randDigit(LEFT_MAGFIN,TOP_MARGIN,parseInt(hour/10),ctx);
		randDigit(LEFT_MAGFIN+8*D,TOP_MARGIN,hour%10,ctx);

		randDigit(LEFT_MAGFIN+15*D,TOP_MARGIN,10,ctx);

		randDigit(LEFT_MAGFIN+19*D,TOP_MARGIN,parseInt(minuts/10),ctx);
		randDigit(LEFT_MAGFIN+27*D,TOP_MARGIN,minuts%10,ctx);

		randDigit(LEFT_MAGFIN+34*D,TOP_MARGIN,10,ctx);

		randDigit(LEFT_MAGFIN+38*D,TOP_MARGIN,parseInt(second/10),ctx);
		randDigit(LEFT_MAGFIN+46*D,TOP_MARGIN,second%10,ctx);

		for(var i=0;i<balls.length;i++){
			var aball=balls[i];
			ctx.fillStyle=aball.color;
			console.info(aball);

			ctx.beginPath();
			ctx.arc(aball.x,aball.y,R,0,2*Math.PI,true);
			ctx.closePath();

			ctx.fill();
		}
	}

	function randDigit(x,y,num,ctx){
		console.log(num);
		var dig=digit[num];

		for(var i=0;i<dig.length;i++){

			for(var j=0;j<dig[i].length;j++){

				if(dig[i][j]==1){
					var px=D*(j-1)+(R+1)+x;
					var py=D*(i-1)+(R+1)+y;
					ctx.fillStyle="blue";
					ctx.beginPath();
					ctx.arc(px,py,R,0,2*Math.PI);
					ctx.closePath();

					ctx.fill();
				}
			}

		}

	}
