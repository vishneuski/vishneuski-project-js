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

