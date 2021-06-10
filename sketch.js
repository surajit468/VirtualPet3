var fedTime,lastFed,dog,feed,addFood,database,foodS,foodStock,bedroom,garden,washroom;

function preload()
{
  dogImg=loadImage("images/dogImg.png");
  dogHappy=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  

}

function setup() {
  database=firebase.database();
  createCanvas(800, 700);
   dog=createSprite(400,450,10,10);
dog.addImage(dogImg);
dog.scale=0.2;
foodStock=database.ref('Food');
foodStock.on("value",readStock);

feed=createButton("Feed the dog");
feed.position(700,95);
feed.mousePressed(feedDog);

addFood=createButton("Add Food");
addFood.position(800,95);
addFood.mousePressed(addFoods);

foodObj= new Food();

fedTime=database.ref('FoodTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})

//read game state from database
readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});

}
 

function draw() {  
// background("green");


currentTime=hour();
if(currentTime==(lastFed+1)) {
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)) {
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))  {
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry")
  foodObj.display();
}        
if(gameState!="Hungry") {
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
  }
                    
foodObj.display();

drawSprites();
} 



function readStock(data) {
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {

  if(x<=0) {
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}
 
function feedDog() {
 

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
  
  })
}
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}



function update(state) {
  database.ref('/').update({
    gameState:state
  });
}