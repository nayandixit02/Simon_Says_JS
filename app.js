let gameSeq = [];
let userSeq = [];

let btns = ["pink", "blue", "orange", "purple"];

let started = false;
let level = 0;
let highestScore = 0;

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function(){
    if(started == false){
        started = true;

        levelUp();
    }
});

function btnFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 250);
}

function levelUp(){
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randomInd = Math.floor(Math.random() * 3)+1;
    let randomColor = btns[randomInd];
    gameSeq.push(randomColor);

    let randBtn = document.querySelector(`.${randomColor}`);
    btnFlash(randBtn);
}

function btnPress() {
    let btn = this;
    btnFlash(btn);
    
    let btnColor = btn.getAttribute("id");
    userSeq.push(btnColor);

    checkColor(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".square");
for(btn of allBtns){
    btn.addEventListener("click", btnPress);
}

function checkColor(ind){
    if(gameSeq[ind] === userSeq[ind]){
        if(userSeq.length === gameSeq.length){
            setTimeout(levelUp, 1000);
        }
    }
    else{
        if(level > highestScore){
            highestScore = level;
        }
        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Highest Score: ${highestScore} <br> Press any key to start.`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}