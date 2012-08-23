<?php
$config = file_get_contents(dirname(__DIR__).DIRECTORY_SEPARATOR.'server'.DIRECTORY_SEPARATOR.'config.json');
$config = json_decode($config);

?>

<!DOCTYPE html>
<html>

<head>
    <title>Project 3</title>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>

    <!--<script src="http://localhost/node/Box2dWeb-2.1.a.3.js"></script>-->
    <!--<script src="http://localhost/node/Core/Class.js"></script>-->
    <!--<script src="http://localhost/node/Core/PhysicsEngine.js"></script>-->
    <script src="./js/cookie.js"></script>
    <script src="./js/utils.js"></script>
    <script src="http://<?=$config->gameServer->address?>:<?=$config->gameServer->port?>/socket.io/socket.io.js"></script>
    <script>
        var resolution = [1000, 800];
        var pixelsInMeter = 50.0;


        var players = {};

        var socket;

        var keysPressed = {};

        var canvas, ctx;

        function Shape(x, y, color) {
            this.x = x;
            this.y = y;
            this.strokeStyle = color;
            this.angle = 0;

            this.pos = {x:0, y: 0};

            this.speed = 0;

            this.draw = function() {

                ctx.translate(this.x, this.y);
//                ctx.translate(-25,-25);

                ctx.rotate(this.angle);
                ctx.translate(-25,-25);

                ctx.fillStyle   = this.strokeStyle;
                ctx.fillRect(0, 0,  50, 50);

                ctx.fillStyle   = '#fff';
                ctx.font         = 'normal 10px sans-serif';
                ctx.textBaseline = 'top';
//                ctx.fillText  (this.speed, 0, 0);
//                ctx.fillText  (this.pos.x +";"+this.pos.y, 0, 10);
            }
        };



        function draw() {
            ctx.clearRect ( 0 , 0 , resolution[0] , resolution[1] );

            ctx.strokeStyle = "#F00";
            ctx.lineWidth   = 2;
            ctx.strokeRect(20,20, 960, 760);

            ctx.strokeRect(500-60,400-60, 120, 120);

            for(var id in players) {
                ctx.save();
                players[id].draw();
                ctx.restore();
            }

            window.requestAnimationFrame(draw);
        }

        $(document).ready(function(){

            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');

            socket = io.connect('http://<?=$config->gameServer->address?>:<?=$config->gameServer->port?>');

            socket.on('connect', function(){
                console.log('connected!');
                $('#spawn').show();
            });

            socket.on('disconnect', function(){
                console.log('disconnected!');
                $('#spawn').hide();
            });

            socket.on('newPlayer', function(data) {
                //if new player spawned is our player
                if(data.sessid == getSessId()) {
                    players[data.id] = new Shape(100,80, "#0F0");
                }
            });

            socket.on('update', function (worldData) {

                worldData.forEach(function(data){
                    var shape = players[data.id];

                    if(!shape) {
                        shape = new Shape(100,80, "#F00");
                        players[data.id] = shape;
                    }

                    var pos = screenPosition(data.pos);
                    shape.x = pos.x;
                    shape.y = pos.y;

                    shape.angle = data.angle;
                    shape.pos = data.pos;
                    shape.speed = data.speed;

                });


            });

            window.requestAnimationFrame(draw);


        });


        $(window).keydown(function(e){
            //do not send event if its already pressed
            if(keysPressed[e.keyCode]) return;

            socket.emit('game.event.keyboard', {down: true, keyCode: e.keyCode});

            keysPressed[e.keyCode] = true;
        });

        $(window).keyup(function(e){
            //do not send event if its not pressed
            if(keysPressed[e.keyCode] == false) return;

            socket.emit('game.event.keyboard', {down: false, keyCode: e.keyCode});

            delete keysPressed[e.keyCode];
        });







        function spawn() {
            socket.emit('spawn', {sessid: getSessId()});
        }








    </script>

</head>

<body>
<canvas id="canvas" width="1000" height="800" style="background-color:#333333;"></canvas>
<input type="button" onclick="spawn()" value="spawn" id="spawn" style="display: none;" />
</body>

</html>
