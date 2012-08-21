PlayerClass = EntityClass.extend({

    init: function (inputx, inputy, settings) {
        this.zIndex = 1;
        this.physBody = null;
        this.sessid = null;

        this.keyboard = {
            left: false,
            up: false,
            right: false,
            down: false
        };

        this.controlls = {
            left: 38,
            up: 39,
            right: 40,
            down: 41
        };

        settings.size = {x:1, y:1};
        this._super(inputx, inputy, settings);

        this.displayName = settings.displayName;


        var entityDef = {
            id: "player",
            x: this.pos.x,
            y: this.pos.y,
            angle: 0,

            halfHeight: 0.5, //JJG: divide by 2 to let the player squeeze through narrow corridors
            halfWidth: 0.5,
            friction: 0.2,

            linearDamping: 7,
            angularDamping: 7,


            categories: ['player', 'team0'],
            collidesWith: ['all'],
            //mapobject','team0','team1','projectile','pickupobject'],
            userData: {
                "id": "player",
                "ent": this
            }
        };
        this.physBody = gPhysicsEngine.addBody(entityDef);


    },

    getSpeed: function() {
        var velocity = this.physBody.GetLinearVelocity();

        var len =  velocity.Length();
        if(len < 0.3) {
            this.physBody.SetLinearVelocity(new Vec2(0,0));
//            this.physBody.SetAwake(false);
//            this.physBody.SetAngularVelocity(0);
        }

        return len;
    },

    update: function () {
        this._super();

        var speed = 4;
        var force = new Vec2(0, 0);

        // according to the key(s) pressed, add the proper vector force
        if (this.keyboard.left) {
            force.Add(new Vec2(-speed,0));
        }
        if (this.keyboard.right) {
            force.Add(new Vec2(speed,0));
        }
        if (this.keyboard.up) {
            force.Add(new Vec2(0,-speed));
        }
        if (this.keyboard.down) {
            force.Add(new Vec2(0,speed));
        }
        // if there is any force, then apply it
        if (force.x||force.y) {
            this.physBody.ApplyImpulse(force, this.physBody.GetWorldCenter());
        }


//        this.physBody.ApplyImpulse(force, this.physBody.GetWorldCenter());


    }

});
Factory.nameClassMap["Player"] = PlayerClass;
