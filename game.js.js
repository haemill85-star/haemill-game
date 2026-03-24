const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
const arena = Array.from({length: 20}, () => Array(10).fill(0));

let player = {
  pos: {x: 3, y: 0},
  matrix: [
    [0,1,0,0],
    [1,1,1,0],
    [1,0,2,2]
  ]
};

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillStyle = value === 2 ? "yellow" : "orange";
        ctx.fillRect(
          (x + offset.x) * grid,
          (y + offset.y) * grid,
          grid, grid
        );
      }
    });
  });
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawMatrix(arena, {x:0,y:0});
  drawMatrix(player.matrix, player.pos);
}

function update() {
  player.pos.y++;
  if (collide()) {
    player.pos.y--;
    merge();
    sweep();
    player.pos.y = 0;
  }
  draw();
}

function collide() {
  const m = player.matrix;
  const o = player.pos;
  for (let y=0; y<m.length; y++) {
    for (let x=0; x<m[y].length; x++) {
      if (m[y][x] &&
          (arena[y+o.y] &&
           arena[y+o.y][x+o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function merge() {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function sweep() {
  for (let y = arena.length - 1; y >= 0; y--) {
    if (arena[y].every(v => v !== 0)) {
      arena.splice(y, 1);
      arena.unshift(Array(10).fill(0));
      y++;
    }
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.pos.x--;
  if (e.key === "ArrowRight") player.pos.x++;
  if (e.key === "ArrowDown") update();
  if (e.key === "ArrowUp") {
    player.matrix = rotate(player.matrix);
  }
});

function rotate(matrix) {
  return matrix[0].map((_, i) =>
    matrix.map(row => row[i]).reverse()
  );
}

setInterval(update, 500);