const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss(); // получение объекта, с помощью которого можно сделать широковещательную рассылку
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
   console.log(`Connection`);
   ws.on('message', msg => {
      msg = JSON.parse(msg); // парс сообщения с клиента
      switch (msg.method) {
         case 'connection':
            connection(ws, msg);
            break;
         case 'draw':
            broadcastConnection(ws, msg);
            break;
      }
   });
})

// сохраняем изображение
app.post('/image', (req, res) => {
   try {
       const data = req.body.img.replace(`data:image/png;base64,`, '')
       fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
       return res.status(200).json({message: "Загружено"})
   } catch (e) {
       console.log(e)
       return res.status(500).json('error')
   }
})
// отдаём изображение зашедшему юзеру
app.get('/image', (req, res) => {
   try {
      // отрисовка файла новому юзеру
      const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
      const data = 'data:image/png;base64,' + file.toString('base64');
      // возвращаем на клиент
      res.json(data);
   } catch (e) {
      console.log(e);
      return res.status(500).json('error');
   }
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

const connection = (ws, msg) => {
   ws.id = msg.id;
   broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
   // в clients хранятся все открытые вебсокеты на данный момент
   aWss.clients.forEach(client => {
      // если сессия одна и та же
      if (client.id === msg.id) {
         client.send(JSON.stringify(msg));
      }
   })
}