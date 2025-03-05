import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let timers = {};

wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log('Fetching current data from all clients');

  // Request the latest data from the first connected client
  const firstClient = Array.from(wss.clients).find(client => client.readyState === WebSocket.OPEN);
  if (firstClient) {
    firstClient.send(JSON.stringify({ type: 'requestLatestData' }));
  }

  // Send data to new client
  setTimeout(() => {
    ws.send(JSON.stringify(timers));
    console.log('Sent timers to new client:', timers);
  }, 1000);

  ws.on('message', (message) => {
    console.log('Received message:', message);
    try {
      const data = JSON.parse(message);
      console.log('Parsed data:', data);

      if (data.type === 'initialData') {
        timers = data.data;
        console.log('Received initial data:', timers);
      } else if (data.type === 'requestInitialData') {
        timers[data.timerId] = data;
        console.log('Sent update:', timers);
      } else if (data.type === 'updateData' && data.timerId && data.time !== undefined && data.isRunning !== undefined) {
        timers[data.timerId] = data;
        console.log('Updated timers:', timers);
      } else {
        console.error('Invalid data format:', data);
      }

      // Broadcast the updated timer state to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(timers));
          console.log('Updated timers on all clients to:\n', timers);
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Send the current state of all timers to the newly connected client
  ws.send(JSON.stringify(timers));
  console.log('Sent current timers to new client:', timers);
});

console.log('WebSocket server is running on ws://localhost:8080');