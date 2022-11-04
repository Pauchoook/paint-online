// класс, от которого наследуются все инструменты

export default class Tool {
   constructor(canvas, socket, id) {
      this.canvas = canvas;
      this.socket = socket;
      this.id = id;
      this.ctx = canvas.getContext('2d');
      this.destroyEvents();
   }

   set fillColor(color) {
      this.ctx.fillStyle = color;
   }

   set strokeColor(color) {
      this.ctx.strokeStyle = color;
   }

   set lineWidth(width) {
      this.ctx.lineWidth = width;
   }

   destroyEvents() {
      // при смене объекта(инструмента) удаляем слушатели с canvas
      this.canvas.onmouseup = null;
      this.canvas.onmousedown = null;
      this.canvas.onmousemove = null;
   }
}