GameEngineClass = Class.extend({
    clock: null,
    players: [],
    entities: [],

    init: function () {
        this.clock = new TimerClass();
    },

    setup: function () {

        //create physics
        gPhysicsEngine.create(Constants.PHYSICS_UPDATES_PER_SEC, false);
        gPhysicsEngine.addContactListener({
            BeginContact:function (idA, idB) {
                console.log('bc');
            },

            PostSolve:function (bodyA, bodyB, impulse) {
                console.log('ps');
            }
        });

        this.addWalls();

//        for(var i=0; i< 0; i++) {
//            this.spawnPlayer('test'+i, 'sess'+i, 10,10);
//        }
    },

    spawnEntity: function (typename, x, y, settings) {
        var className = Factory.getClass('Player');
        var ent = new (className)(x, y, settings);
        this.entities.push(ent);

        return ent;

    },

    getEntityById: function(id) {
        for (var i = 0; i < this.entities.length; i++) {
            var ent = this.entities[i];
            if (ent.id == id) {
                return ent;
            }
        }
        return null;
    },

    spawnPlayer: function (displayName, sessid, x, y) {
        var ent = this.spawnEntity('Player', x, y, {displayName:displayName});
        ent.sessid = sessid;
        this.players.push(ent);
        return ent;
    },

    addWalls: function() {
        var className = Factory.getClass('Wall');
        this.entities.push(new (className)(500 / Constants.MPX_RATIO, 10 / Constants.MPX_RATIO ,{size:{x:1000 / Constants.MPX_RATIO,y:20 / Constants.MPX_RATIO}})); //top
        this.entities.push(new (className)(500 / Constants.MPX_RATIO, 790 / Constants.MPX_RATIO ,{size:{x:1000 / Constants.MPX_RATIO,y:20 / Constants.MPX_RATIO}})); //bottom

        this.entities.push(new (className)(10 / Constants.MPX_RATIO, 400 / Constants.MPX_RATIO ,{size:{x:20 / Constants.MPX_RATIO,y:780 / Constants.MPX_RATIO}})); //left
        this.entities.push(new (className)(990 / Constants.MPX_RATIO, 400 / Constants.MPX_RATIO ,{size:{x:20 / Constants.MPX_RATIO,y:780 / Constants.MPX_RATIO}})); //right


        this.entities.push(new (className)(500 / Constants.MPX_RATIO, 400 / Constants.MPX_RATIO ,{size:{x:120 / Constants.MPX_RATIO,y:120 / Constants.MPX_RATIO}})); //block

    },

    getPlayerBySessId: function (sessId) {
        for (var i = 0; i < this.players.length; i++) {
            var ent = this.players[i];
            if(ent.sessid == sessId)
                return ent;
        }

        return null;
    },

    update: function() {
        for (var i = 0; i < this.players.length; i++) {
            var ent = this.players[i];
            ent.update();
        }

    },

    handleEvent: function(eventName, data) {
        console.log(eventName, data);
    }

});

var gGameEngine = new GameEngineClass();

