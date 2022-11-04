// хранит состояние и логику по обработке состояния
import { makeAutoObservable } from "mobx";

class ToolState {
   tool = null;

   constructor() {
      makeAutoObservable(this); // данные, хранящиеся в классе теперь отслеживаемые
   }

   setTool(tool) {
      this.tool = tool; 
   }
   setFillColor(color) {
      this.tool.fillColor = color; 
   }
   setStrokeColor(color) {
      this.tool.strokeColor = color; 
   }
   setLineWidth(width) {
      this.tool.lineWidth = width; 
   }
}

export default new ToolState();