// ------------------------------> CONSTANTS AND VARIABLES

let context;
let score = 0;
let gameOver = false;

// board
let board = document.querySelector("#board");
let boardWidth = 650;
let boardHeight = 650;

// paddle
let paddleWidth = 120;
let paddleHeight = 10;
let paddleVelocityX = 44;
let paddle = {
  x: boardWidth / 2 - paddleWidth / 2,
  y: boardHeight - paddleHeight - 5,
  width: paddleWidth,
  height: paddleHeight,
  velocityX: paddleVelocityX,
};

// ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
};

// bricks
let brickArray = [];
let brickWidth = 50;
let brickHeight = 10;
let brickColumns = 10;
let brickRows = 3; // add more as game goes on
let brickMaxRows = 10; // limit the number of rows
let brickCount = 0;

let brickX = 30;
let brickY = 90;

// ------------------------------> LOGIC
// FUNCTIONS

window.onload = function () {
  board;
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //   paddle drawing
  context.fillStyle = "lightgreen";
  context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePaddle);

  //  create bricks
  createBricks();
};

//
//
//
//

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //  paddle drawing
  context.fillStyle = "lightgreen";
  context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);

  //  ball
  context.fillStyle = "white";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  //  bounce of the walls
  if (ball.y <= 0) {
    // if ball touches the top of the canvas
    ball.velocityY *= -1;
  } else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    // if ball touches the right or left side of the canvas
    ball.velocityX *= -1;
  } else if (ball.y + ball.height >= boardHeight) {
    // if ball touches the bottom of the canvas
    // game over
    context.font = "20px sans-serif";
    context.fillText("Game Over! Press 'Space' to Restart.", 155, 500);
    gameOver = true;
  }

  // bounce of the ball off the paddle
  if (topCollision(ball, paddle) || bottomCollision(ball, paddle)) {
    ball.velocityY *= -1; // flip direction up or down
  } else if (leftCollision(ball, paddle) || rightCollision(ball, paddle)) {
    ball.velocityX *= -1; // flip direction up or down
  }

  // brick drawing
  context.fillStyle = "skyblue";
  for (let i = 0; i < brickArray.length; i++) {
    let brick = brickArray[i];
    if (!brick.break) {
      if (topCollision(ball, brick) || bottomCollision(ball, brick)) {
        brick.break = true;
        ball.velocityY *= -1;
        brickCount -= 1;
        score += 100;
      } else if (leftCollision(ball, brick) || rightCollision(ball, brick)) {
        brick.break = true;
        ball.velocityX *= -1;
        brickCount -= 1;
        score += 100;
      }
      context.fillRect(brick.x, brick.y, brick.width, brick.height);
    }
  }

  // next level
  if (brickCount == 0) {
    score += 100 * brickRows * brickColumns;
    brickRows = Math.min(brickRows + 1, brickMaxRows);
    createBricks();
  }

  // score
  context.font = "20px sans-serif";
  context.fillText(score, 10, 25);
}

//
//
//
//

function outOfBound(xPosition) {
  return xPosition < 0 || xPosition + paddleWidth > boardWidth;
}

function movePaddle(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
    }
  }

  if (e.code == "ArrowLeft") {
    let nextPaddleX = paddle.x - paddleVelocityX;
    if (!outOfBound(nextPaddleX)) {
      paddle.x = nextPaddleX;
    }
  } else if (e.code == "ArrowRight") {
    let nextPaddleX = paddle.x + paddleVelocityX;
    if (!outOfBound(nextPaddleX)) {
      paddle.x = nextPaddleX;
    }
  }
}

//
//
//
//

function detectCollision(a, b) {
  // two rectangles a and b
  return (
    a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && // a's top right corner passes b's top left corner
    a.y < b.y + b.height && // a's left corner doesn't reach b's bottom right corner
    a.y + a.height > b.y // a's bottom left corner passes b's top left corner
  );
}

function topCollision(ball, block) {
  // a is above b (ball is above the block)
  return detectCollision(ball, block) && ball.y + ball.height >= block.height;
}

function bottomCollision(ball, block) {
  // a is below b (ball is below the block)
  return detectCollision(ball, block) && block.y + block.height >= ball.height;
}

function leftCollision(ball, block) {
  // a is left of b (ball is left of block)
  return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
  // a is right of b (ball is right of block)
  return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

//
//
//
//

function createBricks() {
  brickArray = []; // clear brickArray
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      let brick = {
        x: brickX + c * brickWidth + c * 10, // c*10 : space aparts the columns 10px
        y: brickY + r * brickHeight + r * 10, // r*10 : space aparts the rows 10px
        width: brickWidth,
        height: brickHeight,
        break: false,
      };
      brickArray.push(brick);
    }
  }
  brickCount = brickArray.length;
}

function resetGame() {
  gameOver = false;
  paddle = {
    x: boardWidth / 2 - paddleWidth / 2,
    y: boardHeight - paddleHeight - 5,
    width: paddleWidth,
    height: paddleHeight,
    velocityX: paddleVelocityX,
  };
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
  };
  brickArray = [];
  brickRows = 3;
  score = 0;
  createBricks();
}
