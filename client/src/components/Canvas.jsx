import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';
import {Button, Modal} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import Eraser from '../tools/Eraser';
import Circle from '../tools/Circle';
import Line from '../tools/Line';
import axios from 'axios';

// с помощью observer ведётся слежка за состоянием в классе, и при изменение компонент перерендеривается
const Canvas = observer((props) => {
   const canvasRef = useRef();
   const usernameRef = useRef();
   const [modal, setModal] = useState(true);
   const params = useParams(); // объект с id текущей сессии

   useEffect(() => {
      canvasState.setCanvas(canvasRef.current); // при загрузке страницы текущий canvas добавляется в canvasState(состояние)
      const ctx = canvasRef.current.getContext('2d');
      axios.get(`http://localhost:5000/image?id=${params.id}`)
         .then(res => {
            const img = new Image();
            img.src = res.data;
            
            // очистка всех прошлых изображений canvas
            img.onload = async function() {
               ctx.clearRect(0, 0,canvasRef.current.width,canvasRef.current.height);
               ctx.drawImage(img, 0, 0,canvasRef.current.width,canvasRef.current.height); // вставляем текущее изображение в canvas
            }.bind(this); 
         })
         .catch(e => {
            console.log(e.message)
         })
   }, []);

   useEffect(() => {
      if (canvasState.username) {
         const socket = new WebSocket(`ws://localhost:5000/`);
         canvasState.setSocket(socket); // сохранение сокета в состояние
         canvasState.setSessionId(params.id);
         toolState.setTool(new Brush(canvasRef.current, socket, params.id));
         socket.onopen = () => {
            console.log('connection client')
            // отправка сообщения при открытии сокета
            socket.send(JSON.stringify({
               id: params.id,
               username: canvasState.username,
               method: 'connection'
            }));
         }
         socket.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            switch (msg.method) {
               case 'connection':
                  console.log(`User ${msg.username} connection`);
                  break;
               case 'draw':
                  draw(msg);
                  break;
            }
         }
      }
   }, [canvasState.username]);

   const draw = (msg) => {
      const figure = msg.figure;
      const ctx = canvasRef.current.getContext('2d');

      switch (figure.type) {
         case 'brush':
            Brush.draw(ctx, figure.x, figure.y, figure.stroke, figure.color, figure.lineWidth);
            break;
         case 'eraser':
            Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
            break;
         case 'rect':
            Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.stroke, figure.lineWidth);
            break;
         case 'circle':
            Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.stroke, figure.lineWidth);
            break;
         case 'line':
            Line.staticDraw(ctx, figure.x, figure.y, figure.x1, figure.y1, figure.stroke, figure.lineWidth)
         case 'finish':
            ctx.beginPath(); // начинаем новый путь рисования. Тогда линии не соединятся
            break;
      } 
   }

   const mouseDown = () => {
      canvasState.pushToUndo(canvasRef.current.toDataURL()); // сохраняем действие в undoList
      // сохранение свежего изображения для нового пользователя
      axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
         .then(res => console.log(res.data))
   }

   const connection = () => {
      canvasState.setUsername(usernameRef.current.value); // запись текущего юзера в состояние
      setModal(false);
   }

   return (
      <div className='canvas'>
         <Modal show={modal} onHide={() => {}}>
            <Modal.Header>
               <Modal.Title>Введите ваше имя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <input ref={usernameRef} type="text" />
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => connection()}>
                  Войти
               </Button>
            </Modal.Footer>
         </Modal>
         <canvas onMouseDown={() => mouseDown()} ref={canvasRef} width={600} height={400} />
      </div>
   );
});

export default Canvas;