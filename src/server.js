import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let sPlayers = {};
let sPlayerNames = [];
let sSetup = {};

let sTime = 1200;
let sIncrement = 60;
let sActivePlayer = null;
let sPaused = true;

let timerInterval;

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!sPaused) {
      sPlayers[sActivePlayer].time -= 1;
      broadcastUpdate();
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const broadcastUpdate = () => {
  const data = {
    type: 'updateData',
    players: sPlayers,
    activePlayer: sActivePlayer,
    paused: sPaused,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log('Fetching current data');

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

      if (data.type === 'setup') {
        sPlayers = data.players;
        sPlayerNames = Object.keys(sPlayers);
        sActivePlayer = sPlayerNames[0];

        sTime = data.time;
        sIncrement = data.increment;
        sSetup = data.players;

        console.log('Setting up game with startup data:', sSetup);

        broadcastUpdate(); 

      } else if (data.type === 'initialData') {
        console.log('Sending game data to client');
        ws.send(JSON.stringify({ type: 'initialData', data: {
          players: sPlayers,
          paused: sPaused,
          activePlayer: sActivePlayer,
        }}));

      } else if (data.type === 'togglePause') {
        sPaused = !sPaused;
        console.log('Toggled pause:', sPaused);
        if (sPaused) {
          stopTimer();
        } else {
          startTimer();
        }
        broadcastUpdate();

      } else if (data.type === 'toggleNext') {
        const playerCount = Object.keys(sPlayers).length;
        if (sActivePlayer === playerCount - 1) {
          sActivePlayer = 0;
        } else {
          sActivePlayer += 1;
        }
        console.log('Toggled next player:', sActivePlayer);
        broadcastUpdate();
        
      } else if (data.type === 'reset') {
        sPlayers = sSetup;
        broadcastUpdate();
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');