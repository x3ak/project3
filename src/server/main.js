var fs = require('fs')
    , express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , loop = require('./loop.js')
    , util = require("util");

io.set('log level', 1);

server.listen(3000);

var games = [];

// Shared libs
var game_module = require("./game.js");

var game = game_module.createGameInstance({
    stats: {},
    broadcaster: {io : io}
});

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

        var connectedPlayer = game.gGameEngine.getPlayerBySessId(data.sessid);
        if(!connectedPlayer) {
            connectedPlayer = game.gGameEngine.spawnPlayer(new Date().getTime(), data.sessid, 100 / game.Constants.MPX_RATIO, 100 / game.Constants.MPX_RATIO);
        }


        socket.set('player', connectedPlayer, function(){
            socket.emit('spawned', {id: connectedPlayer.id, sessid: connectedPlayer.sessid})
            socket.broadcast.emit('newPlayer', {id: connectedPlayer.id, sessid: connectedPlayer.sessid});
        });

        socket.on('keypress_event', function(data){
            socket.get('player', function (err, player){


                switch (data.keyCode) {
                    case 37 :
                        player.controlls.left=true;
                        player.controllsStart.left=new Date().getTime();
                        break;
                    case 38 :
                        player.controlls.up=true;
                        player.controllsStart.up=new Date().getTime();
                        break;
                    case 39 :
                        player.controlls.right=true;
                        player.controllsStart.right=new Date().getTime();
                        break;
                    case 40 :
                        player.controlls.down=true;
                        player.controllsStart.down=new Date().getTime();
                        break;
                }

                console.log('keypress_event %j, from: %s', data, player.sessid);
            });


        });

        socket.on('game.event', function(data){
            game_module.runInContext(data, game)
        });


        socket.on('keyup_event', function(data){
            socket.get('player', function (err, player){

                switch (data.keyCode) {
                    case 37 :
                        player.controlls.left=false;
                        break;
                    case 38 :
                        player.controlls.up=false;
                        break;
                    case 39 :
                        player.controlls.right=false;
                        break;
                    case 40 :
                        player.controlls.down=false;
                        break;
                }

                console.log('keyup_event %j, from: %s', data, player.sessid);
            } );
        });
    });





});