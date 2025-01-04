const WebSocket = require('ws');

// Configuración del puerto dinámico proporcionado por Railway o 8080 para local
const PORT = process.env.PORT || 8080;

// Crear el servidor WebSocket
const server = new WebSocket.Server({ port: PORT });

// Lista para almacenar clientes conectados
let clients = [];

// Manejar nuevas conexiones
server.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');
  
  // Agregar cliente a la lista
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

  // Manejar desconexiones del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients = clients.filter((client) => client !== ws); // Eliminar cliente de la lista
  });

  // Manejar errores en la conexión
  ws.on('error', (error) => {
    console.error('Error en la conexión:', error);
  });
});

// Confirmar que el servidor está escuchando
console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
