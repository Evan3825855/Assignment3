
var score = 0;
var s;
var sword,swordImage, gameOverImage;

var video;
var handPose;
var hands;
var Switch = 0;
var canvasWidth = 800;
var canvasHeight = 600;
var simpleTimer;
let poseNet;
let myPX = 0;
let myPY = 0;

var ImageCan;
var gameIsOver = false;
var spGameOver;
var gameOverSound = false;
var gameIsStart = false;
var gameOverIsFirst = false;

//水果生成时间间隔，间隔时间越短，数量越多，单位毫秒
var fruitGenerateTimeGap= 120;
//手雷生成概率
var grenadeProbability=0.02;
let song_sword;
let song_gameover;


function preload() {
  img1 = loadImage("1.png");
  img2 = loadImage("2.png");
  img3 = loadImage("3.png");
  img4 = loadImage("4.png");
  img5 = loadImage("5.png");
  img6 = loadImage("b.png");
  swordImage = loadImage("SWORD.png");
  gameOverImage = loadImage("GG.png");
  icomimg = loadImage("bg.png");
 song_gameover = loadSound('GAME OVER.wav');
 song_sword= loadSound('fruit.wav');

}


function setup() {
  createCanvas(canvasWidth, canvasHeight);
	 cover();
 
	//VIDEO  OPAQUE  THRESHOLD
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.hide();
	
  poseNet = ml5.poseNet(video, modelReady);
  
  simpleTimer = new Timer(fruitGenerateTimeGap);
	
  let img1 = loadImage("1.png");
  let img2 = loadImage("2.png");
  let img3 = loadImage("3.png");
  let img4 = loadImage("4.png");
  let img5 = loadImage("5.png");
  let img6 = loadImage("b.png");
  swordImage = loadImage("SWORD.png");


    //creating sword
  sword = createSprite(40, 200, 1, 1);
  sword.addImage(swordImage);
  sword.scale = 0.2;
	
  //set collider for sword
  sword.setCollider("rectangle", 0, 0, 40, 40);
  sword.immovable = true;



  
	


}
function draw() {
  //是否开始游戏 是就是开始，否就显示封面
  if (gameIsStart==true) {
	main();  
  }
  else {
	 
	  image(ImageCan,0,0);
	  
	  
  }
	

  
}

function main() {
 if(gameIsOver) {
	 
	 
	 gameOver();
   }
    if(spGameOver) {
	spGameOver.position.x = 400;
    spGameOver.position.y = 300;
	 }
  

  background("lightblue");
  fill(255);
  textSize(55);
   if (video) {
	 //视频水平镜像
	const flippedVideo = ml5.flipImage(video);
    image(flippedVideo , 0, 0,canvasWidth,canvasHeight);
  }
 //遮盖视频 
 background("lightblue");
 
  
  textSize(40);
  fill(0);
  text("SCORE=" + score, 10, 90);
  textSize(20);
  fill(0);
  text("Press shift to return to the main menu ", 10, 120);

  //限制道具不出屏幕
  xyLimite();
  sword.position.x = flipX(myPX);
  sword.position.y = myPY;
 
	//控制水果创建数量
  if (simpleTimer.expired() && gameIsOver !=true) {
    createFuits();
    simpleTimer.start();
   }
	
  if(!gameIsOver) {
  splitFuits();
  }
  drawSprites();
  	
}

function cover() {
 ImageCan= createGraphics(canvasWidth,canvasHeight);
 ImageCan.background(25,22,22, 100);
 ImageCan.textSize(30);
 ImageCan.fill("0");
 ImageCan.textAlign(CENTER);
 ImageCan.text("Press the pitcure above to start", 400, 500);
 
 	//图形按钮 
 ImageCan.textSize(25);
 ImageCan.image(icomimg, 40, 40, 720, 376);
 ImageCan.btnStart = createButton("gamestart");
 ImageCan.btnStart.position((windowWidth-720-20)/2, 40);
 ImageCan.btnStart.style("padding-left","20px");
 ImageCan.btnStart.style("padding-right","20px");
 ImageCan.btnStart.style("padding-top","10px");
 ImageCan.btnStart.style("padding-bottom","10px");
 ImageCan.btnStart.style("font-size","30px");
 ImageCan.btnStart.style("width","720px");
 ImageCan.btnStart.style("height","376px");
 ImageCan.btnStart.style("opacity","0");
 ImageCan.btnStart.style("image",icomimg);
 ImageCan.btnStart.mouseClicked(startGame);
  
}

function startGame() {
	gameIsStart=true;
}

function modelReady() {
  poseNet.on("pose", gotPose);
}

function gotPose(poses) {
  //获取左手腕坐标
  if(poses.length >0) {
  myPX = poses[0].pose.keypoints[9].position.x;
  myPY = poses[0].pose.keypoints[9].position.y;
  }
  else {
	  myPX = 0;
	  myPY = 0;
  }
}

//切水果函数
function splitFuits() {
  for (let i = 0; i < allSprites.length; i++) {
    let s = allSprites[i];
    //console.log(s.name);
    s.addSpeed(0.3, 90);

    if (s.position.y > height + 100) {
      s.remove();
    }
	else if (s.collide(sword)  ) {
	   if(s.name=="b") {
		 s.remove();
	     gameIsOver=true;
	   }
	  else {
	  //console.log("zhang");
     song_sword.stop(); 		 
	 song_sword.play(); 
	 s.remove();
     score += 1;
			 
	 }

   }
	
 }
}

//生成水果函数
function createFuits() {
	
	  //if (frameCount % 3== 0) {
    s = createSprite(random(800, -5), 650, 30, 30);
    //r = Math.round(random(1, 6));
	r=getObjectID();
    if (r == 1) {
      s.addImage(img1);
		s.name="a1";
    } else if (r == 2) {
      s.addImage(img2);
		s.name="a2";
    } else if (r == 3) {
      s.addImage(img3);
		s.name="a3";
    } else if (r == 4) {
      s.addImage(img4);
		s.name="a4";
    } else if (r == 5) {
      s.addImage(img5);
		s.name="a5";
    } else {
      s.addImage(img6);
	  s.name="b";
    }

    s.velocity.x = random(5, -5);
    s.velocity.y = random(0, -20);
}


//手雷与水果生成的概率
function getObjectID(){
	n=random(0,1);
	//console.log('n='+n);
	//随机数小于概率值，则取手雷，大于则则水果中取值
	if (n>0 && n<grenadeProbability) {
		pr=6;
	} else {
		pr=Math.round(random(1, 5));
	}
	return pr;
}

function xyLimite() {
  if(myPX>800) {
    myPx=800;
  } else if(myPX<0) {
	  myPX=0;
  }
  if(myPY>600) {
    myPY=600;
  } else if(myPY<0) {
	  myPY=0;
  }
}

//x坐标翻转
function flipX(x) {
	
  px = abs(x-canvasWidth);
	return px;
}

function gameOver2() {
	 //console.log("lin");
	 
	 //sword.addImage(gameOverImage);
     sword.position.x  = 200;
     sword.position.y = 200;
	 song_gameover.play();
	//noLoop();
}

function gameOver() {
  if(gameOverIsFirst==false) {
    spGameOver = createSprite(40, 200, 1, 1);
    spGameOver.immovable = false;
    spGameOver.addImage(gameOverImage);
	  gameOverIsFirst=true;
   }
	//控制结束声音只播放一次
	if(gameOverSound ==false){
	  song_gameover.play();	
	  gameOverSound =true;
	}
	  myPX = windowWidth/2+215;
	  myPY = canvasHeight/2-60;
	//sword.remove();
	//score=0;
    //noLoop();

}

function keyReleased() {
  if (keyCode === SHIFT) {
	  score=0;
	  //redraw();
	  gameIsOver=false;
	  //loop(); 
	  gameIsStart=false;
	  gameOverIsFirst=false;
	  gameOverSound=false;
	  //spGameOver.remove();

	  
 } 
}




