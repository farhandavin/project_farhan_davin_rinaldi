var randomNumber1=Math.floor(Math.random()*6)+1;
 var randomDice="images/dice"+randomNumber1+".png";
var imga1= document.querySelectorAll("img")[0];
imga1.setAttribute("src", randomDice);


var randomNumber2=Math.floor(Math.random()*6)+1;
var randomDice1="images/dice"+randomNumber2+".png";
var imga2=document.querySelectorAll("img")[1];
imga2.setAttribute("src", randomDice1);


if (randomNumber1==randomNumber2) {
    var h11=document.querySelector("h1").innerText="draw";  
}else if (randomNumber1>randomNumber2) {
    var h11=document.querySelector("h1").innerText="player 1 win";
}else if(randomNumber1<randomNumber2){
    var h11=document.querySelector("h1").innerText="player 2 win";
}

