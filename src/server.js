import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let sPlayers = {};
let sActivePlayer = 0;
let sPaused = true;

wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log('Fetching current data');

  // Request the latest data from the first connected client
  const firstClient = Array.from(wss.clients).find(client => client.readyState === WebSocket.OPEN);
  if (firstClient) {
    firstClient.send(JSON.stringify({ type: 'requestLatestData' }));
  }

  // Send data to new client
  setTimeout(() => {
    ws.send(JSON.stringify({ type: 'serverData', data: {
      players: sPlayers,
      activePlayer: sActivePlayer,
      paused: sPaused,
    }}));
  }, 1000);
  console.log('Starting data to new client, package:\nPlayers - ',
              sPlayers, '\nActive player - ', sActivePlayer, '\nPaused - ', sPaused);

  ws.on('message', (message) => {
    console.log('Received message:', message);
    try {
      const data = JSON.parse(message);

      if (data.type === 'initialData') {
        sPlayers = data.data;
        console.log('Received initial data:', data);

      } else if (data.type === 'requestData') {
        console.log('Sent update to request, package:\nPlayers - ',
          sPlayers, '\nActive player - ', sActivePlayer, '\nPaused - ', sPaused);

        ws.send(JSON.stringify({ type: 'serverData', data: {
          players: sPlayers,
          activePlayer: sActivePlayer,
          paused: sPaused,
        }}));

      } else if (data.type === 'updateData') {
        console.log(data)
        sPlayers = data.players;
        sActivePlayer = data.activePlayer;
        sPaused = data.paused;
        console.log("Current server status:\n",
          'Players - ', sPlayers,
          '\nActive player - ', sActivePlayer,
          '\nPaused - ', sPaused);
        wss.clients.forEach((client) => {
          console.log("here2")
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'serverData', data: {
              players: sPlayers,
              activePlayer: sActivePlayer,
              paused: sPaused,
            }}));
            console.log('Sent update to all clients, package:\nPlayers - ',
              sPlayers, '\nActive player - ', sActivePlayer, '\nPaused - ', sPaused);
          }
        });
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');