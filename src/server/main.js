var fs = require('fs')
    , express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , loop = require('./loop.js')
    , util = require("util");

io.set('log level', 1);

var config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

server.listen(config.gameServer.port);

// Shared libs
var game_module = require("./game.js");

var game = game_module.createGameInstance({});

game.gGameEngine.setup();

loop.run(50, function(){
    game.gGameEngine.update();
    game.gPhysicsEngine.update();

    io.sockets.emit('update', getWorldData());
});

function getWorldData() {
    var updateData = [];

    game.gGameEngine.players.forEach(function(player){

        //todo send only changed data
        updateData.push({
            id: player.id,
            pos: player.physBody.GetPosition(),
            speed: player.getSpeed(),
            angle: player.physBody.GetAngle()
        });
    });

    return updateData;
}

io.sockets.on('connection', function (socket) {


    socket.on('spawn', function(data){

        //retrieve already logged in player from memory
        var connectedPlayer = game.gGameEngine.getPlayerBySessId(data.sessid);


        if(!connectedPlayer) {
            //todo login player, for now just create dummy one
            connectedPlayer = game.gGameEngine.spawnPlayer(new Date().getTime(), data.sessid, 100 / game.Constants.MPX_RATIO, 100 / game.Constants.MPX_RATIO);
        }


        //save player and notify client(s) that new player is spawned
        socket.set('player', connectedPlayer, function() {
            socket.broadcast.emit('newPlayer', {id: connectedPlayer.id, sessid: connectedPlayer.sessid, pos: connectedPlayer.physBody.GetPosition()});
        });


        socket.on('game.event.keyboard', function(data){

            //retrieve player object from socket
            socket.get('player', function (err, player){
                for(var keyName in player.controlls) {

                    if(data.keyCode == player.controlls[keyName]) {
                        player.keyboard[keyName] = data.down;
                        break;
                    }

                }
            });
        });


    });
});