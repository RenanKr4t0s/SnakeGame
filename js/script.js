
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const biteSound = new Audio("../assets/Bite.mp3");

const score = document.querySelector(".score__value");
const finalScore = document.querySelector(".menu__score > span");
const menu = document.querySelector(".menu");
const buttonPlay = document.querySelector(".menu__play");

const size = 30
const corBase = "#ddd"
const corHead = "white"
const corLine = "#1a1a1a"
let snake = [{x:270, y:240}]
const food = {x:randomPosition(), y:randomPosition(), color:randomColor()}

let direction
let loopId

buttonPlay.addEventListener("click", () =>{
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
    snake = [{x:270, y:240}];
    
})

function incrementScore(){
    score.innerText = +score.innerText+10
}

function randomNumber(min, max){
    return Math.round(Math.random() *(max-min)+(min))
}
function randomPosition(){
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number/30)*30
}
function randomColor(){
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red},${green},${blue})`
}
function drawSnake(){
     ctx.fillStyle = corBase

     snake.forEach((position, index) => {
        if (index==snake.length-1){
            ctx.fillStyle = corHead
        }

        ctx.fillRect(position.x, position.y, size, size);
     });
}
function drawGrid (){
    ctx.lineWidth = 1;
    ctx.strokeStyle = corLine;

    for (let i = 30; i<canvas.width; i+=30){
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }



   
}
function drawFood(){
    const {x, y, color} = food;
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0
}

function moveSnake(){
    if (!direction) return

    const head = snake[snake.length-1]
    
    if (direction == "ArrowRight"){
        snake.push({x:head.x+size, y:head.y})
    }
    if (direction == "ArrowLeft"){
        snake.push({x:head.x-size, y:head.y})
    }
    if (direction == "ArrowUp"){
        snake.push({x:head.x, y:head.y-size})
    }
    if (direction == "ArrowDown"){
        snake.push({x:head.x, y:head.y+size})
    }

    snake.shift()
}

function checkEat(){
    const head = snake[snake.length-1]

    if (head.x == food.x && head.y ==food.y){
        snake.push(head);
        biteSound.play();
        incrementScore();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position)=>position.x == x && position.y ==y)) {
            x = randomPosition();
            y = randomPosition();
        }
        food.x = x;
        food.y = y;
        food.color = randomColor();
    }

}

function checkColision(){
    const head = snake[snake.length-1]
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length -2;


    const wallCollision = head.x <0 || head.x >canvasLimit || head.y<0 || head.y >canvasLimit;
    const selfCollision = snake.find((position, index)=>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision){
        gameOver()

    }
}

function gameOver(){
    direction = undefined
    menu.style.display = "flex";
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(6px)"
}

function gameLoop (){
    clearInterval(loopId);
    
    ctx.clearRect(0, 0, 600, 600);
    drawGrid ();
    drawSnake();
    drawFood ();
    moveSnake();
    checkEat ();
    checkColision();

   loopId = setTimeout(()=>{
        gameLoop()
    }, 300);
}

gameLoop()

document.addEventListener("keydown", ({key}) =>{
    console.log(key);
    if (key == "ArrowRight"&& direction != "ArrowLeft"){
        direction = key
    }
    if (key == "ArrowLeft"&& direction != "ArrowRight"){
        direction = key
    }
    if (key == "ArrowUp"&& direction != "ArrowDown"){
        direction = key
    }
    if (key == "ArrowDown"&& direction != "ArrowUp"){
        direction = key
    }
    if (key==" "){
        direction = null
    }

    console.log(direction)
})

//Status origin