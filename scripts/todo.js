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

