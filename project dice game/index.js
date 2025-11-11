// --- Blok Dadu 1 ---
// Path gambar diubah menjadi absolut (diawali dengan "/")
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomDiceImage1 = "./images/dice" + randomNumber1 + ".png"; 
var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", randomDiceImage1);

// --- Blok Dadu 2 ---
// Path gambar diubah menjadi absolut (diawali dengan "/")
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var randomDiceImage2 = "./images/dice" + randomNumber2 + ".png"; 
var image2 = document.querySelectorAll("img")[1];
image2.setAttribute("src", randomDiceImage2);


// --- Blok Penentu Pemenang ---
// Lebih efisien memilih h1 satu kali saja
var titleElement = document.querySelector("h1");

if (randomNumber1 === randomNumber2) {
    titleElement.innerText = "Draw!"; // Menggunakan innerText
} else if (randomNumber1 > randomNumber2) {
    titleElement.innerText = "🚩 Player 1 Wins!";
} else {
    // Tidak perlu "else if", "else" saja sudah cukup
    titleElement.innerText = "Player 2 Wins! 🚩";
}