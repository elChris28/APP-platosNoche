const WebSocket = require('ws');

// Configura el puerto dinámico proporcionado por la plataforma o usa 8080 localmente
const PORT = process.env.PORT || 8080;

// Crea el servidor WebSocket
const server = new WebSocket.Server({ port: PORT });

// Lista de clientes conectados
let clients = [];

server.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Agregar el cliente a la lista
  clients.push(ws);

  // Manejar mensajes recibidos del cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);

    // Reenviar el mensaje a todos los demás clientes conectados
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Manejar cuando un cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients = clients.filter((client) => client !== ws); // Remover cliente de la lista
  });

  // Manejar errores en la conexión
  ws.on('error', (error) => {
    console.error('Error en la conexión:', error);
  });
});

// Confirmar que el servidor está escuchando
console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
