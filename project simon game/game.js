var buttonColours=["red", "blue", "green", "yellow"];
var gamepattern=[];
var userClickedPattern=[];
var level=0;
var start=false;

$(document).keydown(function(){
    if (!start) {
    $("#level-title").text("level "+level);
    nextSequence();
    start=true;
    }
});

$( ".btn" ).click( function() {
    var userChosenColour=$(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
  } );
  
function checkAnswer(currentLevel) {
    if (gamepattern[currentLevel]===userClickedPattern[currentLevel]) {
        console.log("succes");
        if (gamepattern.length===userClickedPattern.length) {
            setTimeout(function () {
                nextSequence();
            },1000);
        }
    }else{
        playSound("wrong")
        $( "body" ).addClass( "game-over" );
        setTimeout(function() {$( "body" ).removeClass( "game-over" );}, 200);
        console.log("wrong");
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}     

function nextSequence() {
    userClickedPattern=[];
    level++;
    $("#level-title").text("level "+level);
    var randomNumber=Math.floor(Math.random()*4);
    var randomChosenColor=buttonColours[randomNumber];
    gamepattern.push(randomChosenColor);
    $("#"+randomChosenColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

function playSound(name) {
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}

function animatePress(currentColour) {
$( "#"+currentColour ).addClass( "pressed" );
setTimeout(function() {$( "#"+currentColour ).removeClass( "pressed" );}, 100);
    
}
 function startOver() {
    level=0;
    gamepattern=[];
    start=false;
 }

        

   
      


 