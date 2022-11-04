import Tool from "./Tool";

export default class Line extends Tool{
   constructor(canvas, socket, id) {
      super(canvas, socket, id);
      this.listen();
   }

   listen() {
      // создание слушателей на canvas
      this.canvas.onmouseup = this.mouseUp.bind(this);
      this.canvas.onmousedown = this.mouseDown.bind(this);
      this.canvas.onmousemove = this.mouseMove.bind(this);
   }
   mouseUp(e) {
      this.mousedown = false;
      this.socket.send(JSON.stringify({
         method: 'draw',
         id: this.id,
         figure: {
            type: 'line',
            x: this.startX,
            y: this.startY,
            x1: this.currentX,
            y1: this.currentY,
            stroke: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
         }
      }));
   }
   mouseDown(e) {
      this.mousedown = true;
      this.startX = e.pageX - e.target.offsetLeft;
      this.startY = e.pageY - e.target.offsetTop;
      this.saved = this.canvas.toDataURL(); // сохранение изображения canvas при рисовании новой фигуры
   }
   mouseMove(e) {
      // рисуем, если кнопка нажата
      if (this.mousedown) {
         this.currentX = e.pageX - e.target.offsetLeft;
         this.currentY = e.pageY - e.target.offsetTop;
         this.draw(this.startX, this.startY, this.currentX, this.currentY);
      }
   }

   draw(x, y, x1, y1) {
      const img = new Image();
      img.src = this.saved;
      
      // очистка всех прошлых изображений canvas
      img.onload = async function() {
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // вставляем текущее изображение в canvas
         this.ctx.beginPath(); // начинаем рисовать новую фигуру

         this.ctx.beginPath(); // начали рисовать
         this.ctx.moveTo(x, y);
         this.ctx.lineTo(x1, y1);
         this.ctx.stroke();
      }.bind(this);
   }

   static staticDraw(ctx, x, y, x1, y1, stroke, lineWidth) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = stroke;
      ctx.beginPath(); // начинаем рисовать новую фигуру
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.fill();
      ctx.stroke();
   }
}