import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let sPlayers = [];
let sPlayerNames = [];

let sTime = 1200;
let sIncrement = 60;

let sActivePlayer = 0;
let sPaused = true;

let timerInterval;

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!sPaused) {
      sPlayers[sActivePlayer] -= 1;
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
    ws.send(JSON.stringify({
      type: 'serverData',
      players: sPlayers,
      playerNames: sPlayerNames,
      activePlayer: sActivePlayer,
      paused: sPaused,
    }));
  console.log(
    'Starting data to new client, package:\nPlayers - ',sPlayers,
    '\nActive player - ', sActivePlayer,
    '\nPaused - ', sPaused);

  ws.on('message', (message) => {
    console.log('Received message:', message);
    try {
      const data = JSON.parse(message);

      if (data.type === 'setup') {
        sPlayers = new Array(data.playerCount).fill(data.initialTime);
        console.log(sPlayers)
        sPlayerNames = data.playerNames;
        sTime = data.initialTime;
        sIncrement = data.increment;

        broadcastUpdate(); 

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
        sPlayers[sActivePlayer] += sIncrement;

        if (sActivePlayer === playerCount - 1) {
          sActivePlayer = 0;
        } else {
          sActivePlayer = sActivePlayer + 1;
        }
        console.log('Toggled next player:', sActivePlayer);
        broadcastUpdate();
        
      } else if (data.type === 'reset') {
        sPlayers = new Array(sPlayers.length).fill(sTime);
        console.log(sPlayers)
        let sActivePlayer = 0;
        let sPaused = true;
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