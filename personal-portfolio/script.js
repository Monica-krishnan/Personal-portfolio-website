// Select the button
let button = document.getElementById("welcomeBtn");

// when the button is clicked
button.addEventListener("click", function() {
    let message = document.getElementById("message");
    message.textContent ="Thank you for visiting my portfolio !";
});