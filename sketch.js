var dog,sadDog,happyDog;
var database;

var feedButton, addButton, nameButton, done;
var foodObj;
var PET;
var greeting;
var foodS, lastFed;
var milkIMG, milk;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");

  milkIMG = loadImage("Images/Milk.png");
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.5;

  foodObj = new Food();

  feedButton = createButton("FEED PET!!!");
  feedButton.position(200,130);

  feedButton.mousePressed(feed);

  addButton = createButton("ADD FOOD");
  addButton.position(300,130);

  addButton.mousePressed(add);

  nameButton = createInput("ENTER NEW NAME");
  nameButton.position(950,330);
  
  done = createButton("DONE");
  done.position(1050,355);

  done.mousePressed(function(){
    nameButton.hide();
    done.hide();

    PET = nameButton.value();
    fill(255,255,254);
    textSize(15);
    greeting = createElement("h3");
    greeting.html(PET);
    greeting.position(550, 110);
    
});

}

function draw() {
  background(46,139,87);
  drawSprites();
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("LAST FED : "+ lastFed%12 + " PM", 250,60);
   }else if(lastFed==0){
     text("LAST FED : 12 AM",250,60);
   }else{
     text("LAST FED : "+ lastFed + " AM", 250,60);
   }

 
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feed(){
  dog.addImage(happyDog);
  milk = createSprite(600, 250, 20, 20);
  milk.addImage(milkIMG);
  milk.scale = 0.25;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function add(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}