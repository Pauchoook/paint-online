// хранит информацию о canvas и вспомогательных элементах
import { makeAutoObservable } from "mobx";

class CanvasState {
   canvas = null;
   socket = null;
   sessionId = null;
   undoList = []; // действия, которые мы делали
   redoList = []; // действия, которые мы отменили 
   username = '';

   constructor() {
      makeAutoObservable(this); // данные, хранящиеся в классе теперь отслеживаемые
   }

   setSocket(socket) {
      this.socket = socket;
   }

   setSessionId(id) {
      this.sessionId = id;
   }

   setUsername(name) {
      this.username = name;
   }

   setCanvas(canvas) {
      this.canvas = canvas; 
   }

   pushToUndo(data) {
      this.undoList.push(data);
   }

   pushToRedo(data) {
      this.redoList.push(data);
   }

   undo() {
      const ctx = this.canvas.getContext('2d');
      if (this.undoList.length > 0) {
         const dataURL = this.undoList.pop(); // действие, которое нужно отменить
         this.redoList.push(this.canvas.toDataURL()); // закидываем текущее отменённое действие в undoList
         const img = new Image();
         img.src = dataURL;
         img.onload = function() {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очистка canvas
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // отрисовка предпоследнего действия
         }.bind(this);
      } else {
         ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очистка canvas
      }
   }
   redo() {
      const ctx = this.canvas.getContext('2d');
      if (this.redoList.length > 0) {
         const dataURL = this.redoList.pop();
         this.undoList.push(this.canvas.toDataURL()); // закидываем текущее действие в redoList
         const img = new Image();
         img.src = dataURL;
         img.onload = function() {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // очистка canvas
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // отрисовка предпоследнего действия
         }.bind(this);
      }
   }
}

export default new CanvasState();