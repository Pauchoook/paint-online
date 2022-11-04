import Tool from "./Tool";

export default class Brush extends Tool{
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
            type: 'finish',
         }
      }));
   }
   mouseDown(e) {
      this.mousedown = true;
      this.ctx.beginPath(); // начали рисовать новую линию
      this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop); // координаты курсора мышки
   }
   mouseMove(e) {
      // рисуем, если кнопка нажата
      if (this.mousedown) {
         // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
         // при каждом движении мышки отправляется сообщение на сервер
         this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
               type: 'brush',
               x: e.pageX - e.target.offsetLeft,
               y: e.pageY - e.target.offsetTop,
               stroke: this.ctx.strokeStyle,
               lineWidth: this.ctx.lineWidth
            }
         }));
      }
   }

   static draw(ctx, x, y, stroke, lineWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y); // рисуем линию
      ctx.stroke();
   }
}