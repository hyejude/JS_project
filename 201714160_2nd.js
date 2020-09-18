$(document).ready(function() {
    $("#game-setting").hide();
    $("#startBtn").hide();
    $("#score-box").hide();
    $("#myCanvas").hide();
    $("#game-fail").hide();
    $("#game-success").hide();
})

var canvas, ctx;
var tooth_img, init_screen, ballRadius, x,y, dx, dy;
var ball;

//▼패들
var paddleHeight = 20;
var paddleWidth = 150;
var paddleX;

var germ_color, brush_color;
var scales_set = {
    "easy": "easy",
    "medium": "medium",
    "hard": "hard",
}

//▼벽돌
var bricks = [];
var brickRowCount = 2; //3->4
var brickColumnCount = 2;
var brickWidth = 80; //60->40
var brickHeight = 80;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var OnebrickWidth = 80, OnebrickRowCount = 2;

var score = 0;
var b;
var status;

var color_set = {
    "germ-blue": "#3057a6",
    "germ-green": "#34997f",
    "germ-purple": "#b47ce3",
    "brush-blue": "#6dc1f4",
    "brush-pink": "#e190a7",
    "brush-yellow": "#f7cf67",
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function gameSet(){
    $("#myCanvas").hide();
    $("#game-init").hide()
    $("#gamebtn").hide();
    $("#game-setting").show();
    $("#startBtn").show();
    $("#game-fail").hide();
    $("#game-success").hide();
}

function startGame(){
    $("#game-init").hide()
    $("#gamebtn").hide();
    $("#game-setting").hide();
    $("#startBtn").hide();
    $("#myCanvas").show();
    $("#score-box").show();
    $("#game-fail").hide();
    $("#game-success").hide();
    
    init_page();
    
    document.addEventListener("mousemove", mouseMoveHandler);
    ball = setInterval(draw, 10);
}

function collisionDetection(sclaes) {   

    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            b = bricks[c][r];
            if(b.status == 1){
                if(x > b.bx && x < b.bx+brickWidth && y > b.by && y < b.by+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    document.getElementById("score").innerHTML = "점수 "+score+"점";
                }
            }
        }
    }
    if(score == 10*brickColumnCount*brickRowCount){//해당 단계 성공
        //2단계 가야함
        next_stage();
        clearInterval(ball);
        startGame()
        //3단계 성공
        if(OnebrickRowCount == 5||brickRowCount == 5){
            $("#myCanvas").hide();
            $("#game-success").show();
            clearInterval(ball);
            window.setTimeout(pagereload, 500);
        }
    }
}

function next_stage(){
    OnebrickWidth-=20;
    OnebrickRowCount+=1;
    $("#score-box").hide();
    $("#startBtn").show();
    score = 0;
    alert("이번 단계 성공 ▶ 다음 단계 시작");
    document.getElementById("score").innerHTML = "점수 "+score+"점";

    brickWidth = OnebrickWidth;
    brickHeight = OnebrickWidth;
    brickRowCount = OnebrickRowCount;
    brickColumnCount = OnebrickRowCount;
}

function drawBricks(germ_color) {//
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft+40;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop+50;
                bricks[c][r].bx = brickX;
                bricks[c][r].by = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color_set[germ_color];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle(brush_color) {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color_set[brush_color];
    ctx.fill();
    ctx.closePath();
}

function bingo_germ(id){
    var bingo_img = new Image()
    bingo_img.src = "./bingo.png"
    bingo_img.style.width = "100px"
    bingo_img.style.position = "absolute"
    bingo_img.style.top = "-15px"
    bingo_img.style.left= "-15px"
    bingo_img.setAttribute("id", "bingo")
    var setting_img = $(".setting-img")
    germ_color = id
    for(var i=0;i<setting_img.length;i++){
        $(".setting-img #bingo").remove()
        break;
    }
    $(`#${id}`).append(bingo_img)
}

function bingo_brush(id){
    var bingo_img = new Image()
    bingo_img.src = "./bingo.png"
    bingo_img.style.width = "100px"
    bingo_img.style.position = "absolute"
    bingo_img.style.top = "-15px"
    bingo_img.style.left= "-15px"
    bingo_img.setAttribute("id", "bingo")
    var div_setting = $(".brush-setting-img")
    brush_color = id
    for(var i=0;i<div_setting.length;i++){
        $(".brush-setting-img #bingo").remove()
        break;
    }
    $(`#${id}`).append(bingo_img)
}

function bingo_scale(id){
    var bingo_img = new Image()
    bingo_img.src = "./bingo.png"
    bingo_img.style.width = "100px"
    bingo_img.style.position = "absolute"
    bingo_img.style.top = "-15px"
    bingo_img.style.left= "-15px"
    bingo_img.setAttribute("id", "bingo")
    var div_setting = $(".scale-img")
    scales = id
    for(var i=0;i<div_setting.length;i++){
        $(".scale-img #bingo").remove()
        break;
    }
    $(`#${id}`).append(bingo_img)
}

function init_page(){
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    paddleX = (canvas.width-paddleWidth)/2;

    ballRadius = 10;
    //x,y 공의 좌표
    x = canvas.width/2;
    y = canvas.height-30;
    //공의 좌표 변화
    dx = 2;
    dy = -2;

    if(scales == "medium"){
        brickWidth-=20;
        brickHeight-=20;
        brickColumnCount+=1;
        brickRowCount+=1;
    }    
    if(scales == "hard"){
        brickWidth-=40;
        brickHeight-=40;
        brickColumnCount+=2;
        brickRowCount+=2;
    }
    
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#9accbf";
    ctx.fill();
    ctx.closePath();
}

function pagereload() {
    location.reload();
    alert("게임이 곧 재실행 됩니다.");
}

function draw() {
    var init_screen = new Image();
    init_screen.src = "./game-img.jpg";
    ctx.drawImage(init_screen, 0,0, 400,600)
    drawBricks(germ_color);
    drawPaddle(brush_color);
    drawBall();
    collisionDetection();

    if(x+dx > canvas.width-ballRadius || x+dx < ballRadius) {
        dx = -dx;
    }
    if(y+dy < ballRadius) {
        dy = -dy;
    }
    else if(y+dy > canvas.height-ballRadius-20) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            init_screen.src = "./gameover-img.jpg";
            ctx.drawImage(init_screen, 0,0, 400,600)
            clearInterval(ball)
            $("#myCanvas").hide();
            $("#game-setting").hide();
            $("#game-fail").show();
            $("#score-box").hide();
            $("#startBtn").show();
            window.setTimeout("pagereload()", 500);
        }
    }
    x += dx;
    y += dy;
}
