import { ref } from 'vue';

const connection = ref(null);

const connect = (url) => {
  connection.value = new WebSocket(url);

  connection.value.onopen = (event) => {
    console.log('WebSocket OPEN\n Event:', event, '\n Data:', event.data);
  };

  connection.value.onmessage = (event) => {
    console.log('WebSocket MESSAGE\n Event:', event, '\n Data:', event.data);
  };

  connection.value.onclose = (event) => {
    console.log('WebSocket CLOSED:', event);
  };

  connection.value.onerror = (event) => {
    console.error('WebSocket ERROR:', event);
  };
};

const sendMessage = (message) => {
  if (connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.send(message);
  } else {
    console.error('WebSocket connection is not open');
  }
};

export default {
  connect,
  sendMessage,
  connection,
};