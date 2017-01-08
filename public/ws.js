'use strict';

let connected = false;
let socket;
const roomName = 'room_1';
const socketStatus = document.getElementById('socket-status');
const btnSocket = document.getElementById('btn-socket');
const btnSocketConnect = document.getElementById('btn-connect');
const btnSocketClose = document.getElementById('btn-close');
const btnClear = document.getElementById('btn-clear');
const messagesList = document.getElementById('socket-message-list');
const inputContent = document.getElementById('content');
const serverBaseUrl = 'http://localhost:3001';

btnSocketConnect.addEventListener('click', (event) => {
    if (!connected) {
        socket = new WebSocket('ws://localhost:3001/register/' + roomName);

        socket.onmessage = function(event) {
            const message = event.data;
            if (message === 'clear') {
                messagesList.innerHTML = '';
            } else {
                messagesList.innerHTML += '<li>' + message + '</li>';
            }
        };
        socket.onopen = function(event) {
            socketStatus.innerHTML = 'Connected';
            connected = true;
        };
        socket.onclose = function(event) {
            socketStatus.innerHTML = 'Disconnected';
            connected = false;
        };
    }
});

btnClear.addEventListener('click', (event) => {
    httpGetAsync('/clearMessages/' + roomName);
});
btnSocket.addEventListener('click', (event) => {
    if (!connected) {
        alert('Connect to the websocket first')
        return false;
    }

    httpGetAsync('/randomMessage/' + roomName);
});
btnSocketClose.addEventListener('click', (event) => {
    if (connected) {
        socket.close();
    }
});

function httpGetAsync(path) {
    const url = serverBaseUrl + path;
    return new Promise((resolve, reject) => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resolve(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    });
}