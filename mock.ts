import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { AddressInfo } from 'net';

// Configuration
const port = 8081; // Port for the mock WebSocket upstream server
let server: Server;
let wssServer: WebSocketServer;

function startMockWSS() {
  wssServer = new WebSocketServer({ port }, () => {
    const address = wssServer.address() as AddressInfo;
    console.log(
      `Mock WebSocket upstream server started on ws://localhost:${address.port}`
    );
  });

  wssServer.on('connection', (ws: WebSocket) => {
    console.log('New client connected.');

    // Echo messages back to the client
    ws.on('message', (message) => {
      console.log('Received message from client:', message.toString());

      // send mesage every 5 seconds
      setInterval(() => {
        let data = {
          jsonrpc: '2.0',
          method: 'eth_subscription',
          params: {
            subscription: '0x17f24e61d0609695000000000000efeb',
            result: {
              parentHash:
                '0x8706e5d2f343c28265a63b172206c18947aa66ef0d644f547904653113e75ef6',
              sha3Uncles:
                '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
              miner: '0x0000000000000000000000000000000000000000',
              stateRoot:
                '0x375e61be15934eda37571d45103a960a9d219925851f1aa0e2c2d8d61c5b3854',
              transactionsRoot:
                '0x490f58eb70480be2d9559069f3cd7768eb64c011ad7f2418b2714f5dfed3d276',
              receiptsRoot:
                '0x50b01c9736a4ef12d1a6d1650094fa8f58e251bcefbea3eed884a7db01140799',
              logsBloom:
                '0x0628dcce190248801481acaca490b87208c31122092d88057a3240210b40c501247c3048013641dc611b00d1203914130a95854059d32ed4641a2322902c2aa108b59a046a184e9a82a258dfa42609f401ee14edc38c8040a26ff60d839242a01350f1276a602541322f5f040a1a09e4446464c14cd91a61e8a2c231a6882000025b4d139a5d46c26829a0e4090944e9820b06e72e0030eb10d2aa4c040940113240890856c813308a461c508dc46580c3f62f82c1685c4c1d00232129008b47e8a2104322f5c7141b01e83228729863fc956552c4dd889556fbc209d916700e10d123a92912480a441488b202d25568c7680a410a08e4e94840396333345b0b',
              difficulty: '0x1a',
              number: '0x3a99f67',
              gasLimit: '0x1c63241',
              gasUsed: '0xc2f205',
              timestamp: '0x66d976ee',
              extraData:
                '0xd78301030683626f7288676f312e32322e35856c696e75780000000000000000f85a80f857c0c0c180c102c103c0c105c104c104c106c109c10ac108c20c07c10dc10ec10fc110c111c112c0c0c2150dc180c113c0c0c118c11bc11cc0c0c117c10bc0c10cc11dc22421c123c125c0c0c126c0c12bc0c120c0c0c11674fa1f1c2c67c01d33114d5cd132a00c560a4d1433cae2d28ff467598d3cb06c2ba1d6e80c2448382542fa54b17bca053be54a4493d32c7114c23a5889252f3f00',
              mixHash:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              nonce: '0x0000000000000000',
              baseFeePerGas: '0xe1a0',
              withdrawalsRoot: null,
              blobGasUsed: null,
              excessBlobGas: null,
              parentBeaconBlockRoot: null,
              hash: '0x1920e43fad2c53aff6d7b60b8f71483be3cb6ae41589447283c5d1ec91c2e787',
            },
          },
        };
        ws.send(JSON.stringify(data));
      }, 1000);

      // Simulate error and close connection
      setTimeout(() => {
        console.log('Simulating upstream server error (code 1006).');
        ws.close(4337, 'simulating 1006');
      }, 5000);
    });

    ws.on('close', (code, reason) => {
      console.log(`Client connection closed. Code: ${code}, Reason: ${reason}`);
    });

    ws.on('error', (error) => {
      console.error('Error occurred:', error);
    });
  });

  wssServer.on('error', (error) => {
    console.error('WebSocket Server Error:', error);
  });
}

function stopMockWSS() {
  if (wssServer) {
    wssServer.close(() => {
      console.log('Mock WebSocket upstream server stopped.');
    });
  }
}

startMockWSS();
