let enter = document.getElementById("vault-enter")

let welcome = document.querySelector(".welcome")
let login = document.querySelector(".login")
let rules = document.querySelector(".rules-page")
let game = document.querySelector(".game")

enter.onclick = ()=>{

    welcome.style.display = "none"
    login.style.display = "flex"

}

let logForm = document.querySelector("#login-form")

let name = document.querySelector("#name")
let email = document.querySelector("#mail")
let password = document.querySelector("#pwd")

let displayName = document.querySelector(".display-name")

logForm.onsubmit = (e) =>{
    e.preventDefault()

    let namevalue = name.value
    let mailid = email.value
    let pwd = password.value
    
    if(namevalue == "" || mailid == "" || pwd == ""){
        alert("Kindly fill the details")
        return;
    }

    localStorage.setItem("userName", namevalue)

    let userName = localStorage.getItem("userName")
    
    displayName.textContent = userName

    login.style.display = "none"
    rules.style.display = "flex"
    
    alert("Login Successful")
}

let secretCode;

function showGame(){

    secretCode = generateSecret();

    rules.style.display = "none";
    game.style.display = "flex";

}

function generateSecret(){

    let secretNumber = []

    let firstDigit = Math.floor(Math.random()*9)+1

    secretNumber.push(firstDigit)

    while(secretNumber.length < 4){

        let remainingDigit = Math.floor(Math.random()*10)

        if(!secretNumber.includes(remainingDigit)){

        secretNumber.push(remainingDigit)

        }
    }

    let result = secretNumber.join("")

    return result;
}

let guessdigit = document.querySelectorAll(".guess-input")

let submitbtn = document.querySelector("#submit")

function checkInput(){

    let filled = [...guessdigit].every((input) => input.value !== "")
    
    submitbtn.disabled = !filled 

}

guessdigit.forEach((input)=>{

    input.oninput = ()=>{

        let inValue =  input.value;
        
        if(/[^0-9]/.test(inValue)){
            input.value = "";
            checkInput();
            return;
        }
        
        if(input === guessdigit[0] && inValue === "0"){
            input.value = ""
            checkInput()
            return;
        }

        let duplicate = false;

        guessdigit.forEach((otherInput) => {

            if (otherInput !== input && otherInput.value === inValue && inValue !== "") {
                duplicate = true;
            }

        });

        if (duplicate) {
            input.value = "";
            checkInput()
            return;
        }
        
        if(inValue.length == 1){
            input.nextElementSibling?.focus();
        }
        checkInput()
    }

        input.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && input.value === "") {

            let previousInput = input.previousElementSibling;

            if (previousInput) {
                previousInput.value = "";
                previousInput.focus();
                checkInput();
            }
        }

    });
});

submitbtn.onclick = ()=>{
    submitGuess()
}

let gameover = false;

let attemptleft = 8;

let attemptcount = document.querySelector("#attempt-count")

function submitGuess(){

     if(gameover || attemptleft <= 0){
        return
    }

    let guess = [...guessdigit].map((input) => input.value).join("");

    attemptleft--;

    attemptcount.textContent = attemptleft;

    let feedback = checkGuess(guess)

    displayHistory(guess, feedback)

    if(guess === secretCode){
        endgame();

        alert("Congratulations! You Crack the code")
    }

    else if(attemptleft === 0){

        endgame()
        
        alert("Game Over! Secret Code: " + secretCode);
    }

    else{
        alert("Wrong Guess!. Try Again.")
    }

}

function endgame(){

    gameover = true;

    guessdigit.forEach((input)=>{
        input.disabled = true;
    });
    submitbtn.disabled = true
}

function checkGuess(guess){

    let result = [];

    for(let i = 0; i < 4; i++){

        if(guess[i] === secretCode[i]){
            result.push("correct")
        }
        else if(secretCode.includes(guess[i])){
            result.push("misplaced")
        }
        else{
            result.push("wrong")
        }
    }
    return result;
}

let history = document.querySelector("#history")

function displayHistory(guess, feedback){
    
    let row = document.createElement("tr");

    let attempt = document.createElement("td")
    let digit = document.createElement("td")
    let result = document.createElement("td")

    attempt.textContent = history.children.length + 1;
    
    digit.textContent = guess;

    let resultBox = document.createElement("div")

    resultBox.classList.add("result-box");

    feedback.forEach((status, index) => {
        
        let digitBox = document.createElement("span")
        
        digitBox.classList.add(status)

        digitBox.textContent = guess[index]

        resultBox.appendChild(digitBox)
    })

    result.appendChild(resultBox)

    row.append(attempt, digit, result)

    history.appendChild(row)
}

let reset = document.querySelector("#reset")

reset.onclick = ()=>{
    resetGame()
} 

function resetGame(){

    secretCode = generateSecret()

    attemptleft = 8;

    attemptcount.textContent = attemptleft;

    gameover = false;

    guessdigit.forEach((input) =>{
        
        input.value = "";

        input.disabled = false;
    })

    submitbtn.disabled = false;

    history.innerHTML = "";

    guessdigit[0].focus();
}
