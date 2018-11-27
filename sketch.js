var myMap, canvas, myLoc;
var mappa = new Mappa('MapboxGL', 'pk.eyJ1Ijoic3ViamVjdG5hbWVoZXJlIiwiYSI6ImNqcDA3NzYwOTAzY2UzcXA2bHQ3a2Q4cGcifQ.xY4-PF7rtw8pkh3w63DLjA');
const options = {
  lat: 0,
  lng: 0,
  zoom: 2,
  style: "mapbox://styles/subjectnamehere/cjp0731eues9k2rp6qwvmgqo2",
  pitch: 40
}
function preload(){
  myLoc = getCurrentPosition();
}

function setup() {
  background(0);
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  airports = loadTable('assets/airports.csv','csv', 'header');
  fill(255,0,0);
  noStroke();
  clear();
  textSize(20);
  textAlign(LEFT);
  var initialPos=myMap.latLngToPixel(61.1604995728,-45.4259986877);
  mouseX=initialPos.x;
  mouseY=initialPos.y;
}
var currentName, currentCtry, selectedName, selectedCtry;
var currentLat, currentLng;
var lat1, lng1, lat2, lng2;
lat1 = 0; lng1 = 0; lat2 = 0; lng2 = 0;
var name1, ctry1, name2, ctry2;
var stage = 0;
function draw() {
  clear();
  for (let i = 0; i < airports.getRowCount(); i++) {
    fillVar = map(i,0,airports.getRowCount(),0,255);
    const lat = Number(airports.getString(i, 'Latitude'));
    const lng = Number(airports.getString(i, 'Longitude'));
    const pos = myMap.latLngToPixel(lat, lng);
    fill(fillVar,255-fillVar,200);
    ellipse(pos.x, pos.y, 5);
    if(mouseX<pos.x+5 && mouseX>pos.x-5 && mouseY<pos.y+5 && mouseY>pos.y-5) {
      currentName = airports.getString(i, 'Name');
      currentCtry = airports.getString(i, 'Country');
      currentLat = lat;
      currentLng = lng;
    }
  }
  push();
  fill("#00222ecc")
  stroke(255);
  var textHeight = height-290;
  rect(30, textHeight, 600, 250, 5);
  push();
  noStroke();
  textStyle(BOLD);
  textSize(20);
  fill(255);
  textHeight+=40; text("Flight Length Calculator", 60, textHeight);
  pop();
  if (stage==0){
    fill(150);
    name1=currentName;
    ctry1=currentCtry;
    lat1 = currentLat;
    lng1 = currentLng;
  } else if (stage==1) {
    fill(0,255,200);
    name1=selectedName;
    ctry1=selectedCtry;
    name2=currentName;
    ctry2=currentCtry;
    lat2 = currentLat;
    lng2 = currentLng;
  } else if (stage==2) {
    fill(0,255,200);
    name2=selectedName;
    ctry2=selectedCtry;
  }

  push();
  noFill();
  strokeWeight(4);
  stroke(255,255,0);
  var myPos = myMap.latLngToPixel(myLoc.latitude, myLoc.longitude);
  ellipse(myPos.x,myPos.y,13);
  noStroke();
  fill(255);
  var pos1 = myMap.latLngToPixel(lat1, lng1);
  ellipse(pos1.x,pos1.y,15);

  if (stage!=0) {
    var pos2 = myMap.latLngToPixel(lat2, lng2);
    ellipse(pos2.x,pos2.y,15);
    stroke(255);
    strokeWeight(2);
    noFill();
    bezier( pos1.x,pos1.y,
            pos1.x+(pos2.x-pos1.x)*0.2, pos2.y+(pos2.y-pos2.y)*0.2,
            pos2.x-(pos2.x-pos1.x)*0.2, pos2.y-(pos2.y-pos2.y)*0.2,
            pos2.x,pos2.y);
  }
  pop();
  noStroke();
  textSize(20);
  textHeight+=40; text("Departure: "+name1, 60, textHeight);
  textSize(15);
  textHeight+=20; text(ctry1, 60, textHeight);
  textSize(20);

  if (stage!=0) {
    if (stage==1) {fill(150)};
    textHeight+=40; text("Arrival: "+name2, 60, textHeight);
    textSize(15);
    textHeight+=20; text(ctry2, 60, textHeight);
    var distance = Math.round(calcGeoDistance(lat1, lng1, lat2, lng2, 'km'));
    textHeight+=40; text("Distance: "+distance+" km", 60, textHeight);
    var time = Math.round(distance/930*100)/100;
    textHeight+=20; text("Flight length: "+time+" hours at 930 km/h", 60, textHeight);
  }

  pop();
}
function mouseReleased() {
  selectedName = currentName;
  selectedCtry = currentCtry;
  if (stage!=2) {
    stage++;
  } else {
    stage=0;
  }

}
