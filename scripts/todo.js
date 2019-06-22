function Coin(coin) {
  var self = this;
  self.width = COINWIDTH;
  self.height = COINHEIGHT;
  self.posX = coin.posX;
  self.posY = coin.posY;

  self.draw = function () {
    сtx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(self.posX, self.posY, self.width / 2, 0, Math.PI * 2, false);
  }
}

//todo remove collisioned with the player coins
//todo same functionality for enemies and player

// function collision(obj1, obj2) {
//   if (((obj1.posX < obj2.posX + obj2.width && obj1.posX > obj2.posX) || (obj1.posX + obj1.width > obj2.posX && obj1.posX < obj2.posX)) && ((obj1.posY < obj2.posY + obj2.height && obj1.posY > obj2.posY) || (obj1.posY + obj1.height > obj2.posY && obj1.posY < obj2.posY))) {
//
//     console.log(obj1 + 'collision!' + obj2);
//     console.log(obj1);
//     console.log(obj2);
//   }
// }


// todo refactoring
// function initCanvasImg(name) {
//   name = new Image();
//   name.onload = drawCanvas(name);
//   name.src = '../images/' + name + '.png';
// }
//
// function drawCanvas(img, imgPosX, imgPosY, imgWidth, imgHeight) {
//   ctx.drawImage(img, imgPosX, imgPosY, imgWidth, imgHeight);
// }