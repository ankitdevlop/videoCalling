var PeerServer = require('peer').PeerServer;

var server = new PeerServer({port: 3001, path: '/'})
console.log("server is runnig")