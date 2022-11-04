import React from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/toolbar.scss';
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';

function Toolbar(props) {
   const download = () => {
      const dataURL = canvasState.canvas.toDataURL(); // текущее изображние canvas
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = canvasState.sessionId + 'jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
   }

   return (
      <div className='toolbar'>
         <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
         <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
         <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
         <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
         <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
         <div className="toolbar__color">
            <input onChange={(e) => toolState.setFillColor(e.target.value)}  type="color" className="toolbar__color--input" />
         </div>
         <button className="toolbar__btn undo" onClick={() => canvasState.undo()}></button>
         <button className="toolbar__btn redo" onClick={() => canvasState.redo()}></button>
         <button className="toolbar__btn save" onClick={() => download()}></button>
      </div>
   );
}

export default Toolbar;