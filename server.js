const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'client')));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Listening on ' + port + '.'));