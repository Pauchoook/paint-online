import Tool from "./Tool";

export default class Rect extends Tool{
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
            type: 'rect',
            x: this.startX,
            y: this.startY,
            width: this.width,
            height: this.height,
            color: this.ctx.fillStyle,
            stroke: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
         }
      }));
   }
   mouseDown(e) {
      this.mousedown = true;
      this.ctx.beginPath(); // начали рисовать
      this.startX = e.pageX - e.target.offsetLeft;
      this.startY = e.pageY - e.target.offsetTop;
      this.saved = this.canvas.toDataURL(); // сохранение изображения canvas при рисовании новой фигуры
   }
   mouseMove(e) {
      // рисуем, если кнопка нажата
      if (this.mousedown) {
         let currentX = e.pageX - e.target.offsetLeft;
         let currentY = e.pageY - e.target.offsetTop;
         this.width = currentX - this.startX;
         this.height = currentY - this.startY;
         this.draw(this.startX, this.startY, this.width, this.height)
     }
   }

   draw(x, y, w, h) {
      const img = new Image();
      img.src = this.saved;
      
      // очистка всех прошлых изображений canvas
      img.onload = async function() {
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // вставляем текущее изображение в canvas
         this.ctx.beginPath(); // начинаем рисовать новую фигуру
         this.ctx.rect(x, y, w, h);
         this.ctx.fill();
         this.ctx.stroke();
      }.bind(this);
   }

   static staticDraw(ctx, x, y, w, h, color, stroke, lineWidth) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = color;
      ctx.beginPath(); // начинаем рисовать новую фигуру
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();
   }
}