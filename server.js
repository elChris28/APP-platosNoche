const WebSocket = require('ws');

// Crear el servidor WebSocket en el puerto 8080
const server = new WebSocket.Server({ port: 8080 });

let clients = []; // Lista para almacenar clientes conectados

server.on('connection', (ws) => {
  console.log('Cliente conectado');
  clients.push(ws);

  // Cuando se recibe un mensaje desde un cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);

    // Reenviar el mensaje a todos los clientes conectados
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Cuando un cliente se desconecta
  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket escuchando en el puerto 8080');
