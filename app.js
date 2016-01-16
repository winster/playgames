var WebSocketServer = require("ws").Server;
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();
app.use(jsonParser);
var port = 8000;

app.use(express.static(__dirname + '/public'));

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./lobby1');
}

app.get('/', function(request, response) {
  response.render('public/index.html');
});

var lobbyJSON =  {
  type:'launch',
  data: [
    {
      id:'123',
      name:'PointsRummy_123',
      decks:2,
      point:0.05,
      entrymin:4,
      status:'Seating',
      sitting:1,
      sittingmax:6
    },
    {
      id:'234',
      name:'PointsRummy_234',
      decks:2,
      point:0.05,
      entrymin:4,
      status:'Seating',
      sitting:1,
      sittingmax:6
    },
    {
      id:'345',
      name:'PointsRummy_345',
      decks:2,
      point:0.05,
      entrymin:4,
      status:'Seating',
      sitting:1,
      sittingmax:6
    }
  ]
};
var deltaJSON = {type:'delta',id:123,col:'point',val:Math.random()};
    
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")
var websocket;
wss.on("connection", function(ws) {
  websocket = ws;
  ws.send(JSON.stringify(lobbyJSON), function() {  })
  console.log("websocket connection open")
  setInterval(function(){
    deltaJSON.val = Math.random();
    ws.send(JSON.stringify(deltaJSON), function() {  })
  }, 3000);
  ws.on("close", function() {
    console.log("websocket connection close")
    
  })
});

app.post('/tournament', function(request, response) {
  console.log('inside post');
  var tournament = request.body;
  if(tournament.type==='new'){
    tournament.id = Math.random();
  }
  console.log("new tournament broadcasted"+tournament);
  websocket.send(JSON.stringify(tournament), function() {  })
  response.send(true);
});
