
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let highestBid = 0;
let winningBidder = '';

wss.on('connection', (ws) => {
// Handle incoming WebSocket connections
ws.on('message', (message) => {
const data = JSON.parse(message);
if (data.type === 'bid') {
if (data.bid > highestBid) {
highestBid = data.bid;
winningBidder = data.bidder;
broadcast(JSON.stringify({ type: 'new_bid', highestBid, winningBidder }));
}
}
});
});

function broadcast(message) {
wss.clients.forEach((client) => {
if (client.readyState === WebSocket.OPEN) {
client.send(message);
}
});
}

// Serve static files
app.use(express.static('public'));

server.listen(4000, () => {
console.log('Server started on http://localhost:4000');
});