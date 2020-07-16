import io from 'socket.io-client';

export default class WebSocket {
  constructor(clientID) {
    this.clientID = clientID;
    this.socket = io(process.env.API_URL, {
      reconnection: true,
      transports: ['websocket'],
      query: { authorization: `Bearer ${this.clientID}` },
    });
  }

  init = () => {
    this.socket.on('connect', () =>
      console.log('websocket event: connected to WS')
    );
    this.socket.on('event', (data) =>
      console.log(`websocket event: event - ${data}`)
    );
    this.socket.on('connect_error', (error) =>
      console.log(`websocket event: connection error - ${error}`)
    );
    this.socket.on('error', (error) =>
      console.log(`websocket event: error - ${error}`)
    );
    this.socket.on('disconnect', () =>
      console.log('websocket event: disconnect from WS')
    );
  };

  emit = (type) => this.socket.emit(type);

  subscribeTo = (type, callback) => {
    this.socket.on(type, (data, done) => callback(data, done));
  };

  unsubscribeTo = (type, doneFunction) => {
    this.socket.off(type);
    if (doneFunction) {
      doneFunction();
    }
  };

  disconnect = () => {
    this.socket.disconnect();
  };
}
