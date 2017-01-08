'use strict';

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

const rooms = {};

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/randomMessage/:roomName', function(req, res) {
    const message = Math.random();

    const color = getRandomColor();
    const backgroundColor = getRandomColor();
    rooms[req.params.roomName].forEach((wsClient) => {
        wsClient.send('<span style="color: ' + color + '; background-color: ' + backgroundColor + '">' + message + '</span>');
    });
    res.sendStatus(200);
});

app.get('/clearMessages/:roomName', function(req, res) {
    rooms[req.params.roomName].forEach((wsClient) => {
        wsClient.send('clear');
    });
    res.sendStatus(200);
});

app.ws('/register/:roomName', function(ws, req) {
    const roomName = req.params.roomName;
    if (!rooms[roomName]) {
        rooms[roomName] = [];
    }

    ws.on('close', function () {
        const index = rooms[roomName].indexOf(ws);
        if (index !== -1) {
            rooms[roomName].splice(index, 1);
        }
    });
    rooms[roomName].push(ws);

    console.log(rooms[roomName].length + ' users in room ' + roomName);
});

app.listen(3001);

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}