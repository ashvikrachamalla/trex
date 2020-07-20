var PLAY = 1,END = 0;
var gameState = PLAY;
var trex, runningtrex, deadtrex;
var ground, groundimage, invisibleground;
var cloudimage,CloudsGroup;
var ObstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var restart, restartimage, gameOver, goimage;
var jump, die, checkpoint;
var score = 0;
function preload(){
  runningtrex = loadAnimation ("trex1.png","trex3.png","trex4.png");
  deadtrex = loadAnimation ("trex_collided.png");
  groundimage = loadImage ("ground2.png");
  cloudimage = loadImage ("cloud.png");
  obstacle1 = loadImage ("obstacle1.png");
  obstacle2 = loadImage ("obstacle2.png");
  obstacle3 = loadImage ("obstacle3.png");
  obstacle4 = loadImage ("obstacle4.png");
  obstacle5 = loadImage ("obstacle5.png");
  obstacle6 = loadImage ("obstacle6.png");
  restartimage = loadImage ("restart.png")
  goimage = loadImage ("gameOver.png")
  jump = loadSound ("jump.mp3");
  die = loadSound ("die.mp3");
  checkpoint = loadSound ("checkPoint.mp3");  
}
  
function setup() {
  createCanvas(600, 200);
  
  trex = createSprite (50, 170, 20, 50);
  trex.addAnimation("running", runningtrex);
  trex.addAnimation("collided", deadtrex);
  trex.scale = 0.5;
  
  ground = createSprite (200, 180, 600, 20);
  ground.addImage (groundimage);
  ground.x = ground.width/2;
  ground.velocityX = -(6+3*score/100);
  invisibleground = createSprite (200, 190, 600, 10);
  invisibleground.visible = false;
  CloudsGroup = new Group();
  ObstaclesGroup = new Group ();
  //place gameOver and restart icon on the screen
 gameOver = createSprite(300,100);
 restart = createSprite(300,140);
gameOver.addImage(goimage)
gameOver.scale = 0.5;
restart.addImage(restartimage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
  
  score = 0;
}

function draw() {
  background(255);
  text("score : " + score, 500, 50);
  if(gameState == PLAY){
    score = score + Math.round(getFrameRate()/60);
    if (score > 0 && score % 100 == 0){
      checkpoint.play();
    }
    ground.velocityX = -(6+3*score/100);
    if(keyDown("space")&& trex.y >= 159){
      trex.velocityY = -12;
      jump.play ()
    }
    trex.velocityY += 0.8;
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    trex.collide (invisibleground);
    spawnclouds();
    spawnObstacles();
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play ();               
    }
}
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",deadtrex);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
   trex.collide (invisibleground);
  drawSprites();
}
function spawnclouds() {
  if (frameCount % 60 == 0) {
    var cloud = createSprite (600, random(80, 120),40, 10 );
    cloud.addImage (cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    CloudsGroup.add (cloud);
  }
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
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
        default: break;
    }
      
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
  }
  function reset(){
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  trex.changeAnimation("running",runningtrex);
  score=0;
}
