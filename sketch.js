var trex;
var trex_running;
var ground;
var groundImg;
var invisibleGround;
var cloudImg;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var gameState = "play";
var escenario = 1;  // 1---> día  -1 ---> noche
var cloudsGroup, obstaclesGroup, teroGroup ;
var terofly;
var trexdown;
var trex_collided;
var gameOver, gameOverImg;
var restart, restarImg;
var jumpSound, dieSound,checkpointSound;


function preload(){
  trex_running= loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  trex_collided =loadAnimation ("trex_collided.png");
  groundImg = loadImage ("ground2.png");
  //Cargar la imagen de la nube
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5= loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  terofly =loadAnimation("tero1.png", "tero2.png");
  trexdown = loadAnimation ("trex_down1.png", "trex_down2.png");
  gameOverImg =loadImage ("gameOver.png");
  restarImg =loadImage("restart.png");
  jumpSound = loadSound ("jump.mp3");
  dieSound = loadSound ("die.mp3");
  checkpointSound =loadSound("checkpoint.mp3");
}

function setup(){
  var ejemplo = "Hola";
  
  createCanvas (windowWidth, windowHeight);
  trex =createSprite (50,windowHeight-50,20,60);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale= 0.5;
  ground = createSprite(200,windowHeight-20,windowWidth/2,20);
  ground.addImage(groundImg);
  ground.x = ground.width/2
  invisibleGround = createSprite (200,windowHeight-10,windowWidth/2,10);
  invisibleGround.visible  = false;
  trex.addAnimation("down", trexdown);
  var numero = Math.round(random(0,10));
 // console.log(numero);
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  teroGroup = new Group();
  //trex.debug = true;
  trex.setCollider("circle", 0, 0, 40);

  gameOver =createSprite (windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  restart = createSprite(windowWidth/2,windowHeight/2+40);
  restart.addImage(restarImg);
  gameOver.scale = 0.5;
  restart.scale =0.5;
  gameOver.visible = false
  restart.visible= false
}

function draw(){
  
    //Background importante para cambio de día a noche
  if(gameState ==="play"){
    
    if(escenario === 1){
      background(180);
    }
    if(escenario=== -1){
      background ("black");
      spawnTero();
    }
    ground.velocityX = -(4 +score/100) ;
    textSize(20);
    text("Puntuación: "+ score, windowWidth-300,20);
    //score +=Math.round(frameCount/60);
    score = score+1;
    if(keyDown("space") && trex.y>windowHeight-80){
      trex.velocityY = -10;
      jumpSound.play();
    }

    if(keyWentDown("down")){
      trex.changeAnimation("down",trexdown)
      trex.scale = 0.3
      trex.velocityY = 10;
    }
    if(keyWentUp("down")){
      trex.changeAnimation("running",trex_running)
      trex.scale = 0.5
    }
    if (ground.x <0){
      ground.x = ground.width/2;
    }
    trex.velocityY = trex.velocityY + 0.8;
    spawnClouds();
    spawnObstacles();
   
   
   if(trex.isTouching(obstaclesGroup) || trex.isTouching(teroGroup)){
    gameState="end";
    dieSound.play();
    }
   
    if(score>0 && score%100 === 0){
      checkpointSound.play();
    }

    if(score>0 && score%1000===0){
     escenario = -1* escenario;
    }
   console.log(escenario);
  }

  if(gameState === "end"){
    
    background(180);
    trex.velocityY = 0; 
    textSize(20);
    text("Puntuación: "+ score, windowWidth-300,20);
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //teroGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1); 
    cloudsGroup.setLifetimeEach(-1); 
    teroGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    trex.scale = 0.5
    gameOver.visible = true
    restart.visible= true

    if(mousePressedOver(restart)){
      reinicio();
    }
  }

 
  trex.collide(invisibleGround);
  drawSprites();
}

function reinicio (){
  score = 0;
  teroGroup.destroyEach();
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  gameOver.visible = false
  restart.visible= false
  gameState = "play"
}

//Función que hace aparecer a los obstáculos
function spawnObstacles(){

  if(frameCount%60 == 0){
    var obstacle = createSprite(windowWidth+30,windowHeight-30,20,40);
    obstacle.velocityX= -(4 +score/100);
    var num= Math.round(random(1,6))
   
    switch (num){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
    }

    obstacle.scale = 0.5
    obstacle.lifetime= Math.round(windowWidth/obstacle.velocityX);
    obstaclesGroup.add(obstacle);
  }
}

//Funcion que hace aparecer las nubes
function spawnClouds(){
  //Crear el sprite para la nube
  if(frameCount%60 == 0)
{
  var cloud = createSprite(windowWidth,50,40,20);
  //Hacer que la nube se mueva hacia la izquierda
  cloud.velocityX =-(4 +score/100)
  //Colocar la imagen de la nube
  cloud.addImage(cloudImg);
  cloud.scale =0.5
  cloud.y = Math.round(random(20,windowHeight-50));
  trex.depth = cloud.depth;
  trex.depth = trex.depth + 1;

  cloud.lifetime =Math.round(windowWidth/cloud.velocityX);
  cloudsGroup.add(cloud);
}  
}


function spawnTero(){
  //Crear el sprite para la nube
  if(frameCount%60 == 0)
{
  var tero = createSprite(windowWidth,50,40,20);
  //Hacer que la nube se mueva hacia la izquierda
  tero.velocityX = -(8 +score/100);
  //Colocar la imagen de la nube
  tero.addAnimation("tero", terofly);
  //cloud.scale =0.5
  tero.y = Math.round(random(20, windowHeight-50));

  tero.lifetime = Math.round(windowWidth/tero.velocityX);
  teroGroup.add(tero);
}  
}