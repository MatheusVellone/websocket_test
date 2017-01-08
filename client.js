const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.sendfile('index.html');
});


app.listen(3002);