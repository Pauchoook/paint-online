import Brush from "./Brush";

export default class Eraser extends Brush{
   constructor(canvas, socket, id) {
      super(canvas, socket, id);
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
               type: 'eraser',
               x: e.pageX - e.target.offsetLeft,
               y: e.pageY - e.target.offsetTop,
               lineWidth: this.ctx.lineWidth
            }
         }));
      }
   }

   static draw(ctx, x, y, lineWidth) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y); // рисуем линию
      ctx.stroke();
   }
}