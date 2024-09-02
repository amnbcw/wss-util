import WebSocket from 'ws';

const wsUrl = process.argv[2];

if (!wsUrl) {
  console.error('Please provide a WebSocket URL as a command-line argument.');
  process.exit(1);
}

let startTime: number;
let endTime: number;
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  startTime = Date.now();
  console.log('Connected to the WebSocket server at', wsUrl);
  const message = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_subscribe',
    params: ['newHeads'],
  });

  setTimeout(() => {
    ws.send(message);
    console.log('Message sent:', message);
  }, 3000);
});

ws.on('message', (data) => {
  console.log(
    'Message rcvd from server: @ ' + +new Date(),
    data.toString().substring(0, 108)
  );
});

ws.on('close', (code, reason) => {
  endTime = Date.now();

  console.log('Disconnected from the WebSocket server');
  console.log('code=', code);
  console.log('reason str=', reason.toString());
  console.log(`reason json=`, JSON.stringify(reason));
  console.log(`reason length=`, reason.length);

  printElapsedTime();
});

ws.on('error', (error) => {
  endTime = Date.now();
  console.error('WebSocket error:', error);
  printElapsedTime();
});

function printElapsedTime() {
  if (startTime && endTime) {
    const elapsedTime = (endTime - startTime) / 1000;
    console.log(`Elapsed time: ${elapsedTime} seconds`);
  }
}
