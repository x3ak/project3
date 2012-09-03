WallClass = EntityClass.extend({

    init: function (inputx, inputy, settings) {
        this.zIndex = 1;
        this.physBody = null;

        this._super(inputx, inputy, settings);

        this.displayName = 'wall';


        var entityDef = {
            id: "wall",
            x: inputx,
            y: inputy,
            angle: 0,

            halfHeight: settings.size.y / 2,
            halfWidth: settings.size.x / 2,

            friction: 0.7,
            type: 'static',
            categories: ['mapobject'],
            collidesWith: ['all'],
            //mapobject','team0','team1','projectile','pickupobject'],
            userData: {
                "id": "wall",
                "ent": this
            }
        };

        this.physBody = gPhysicsEngine.addBody(entityDef);
    },

    getSpeed: function() {
        var velocity = this.physBody.GetLinearVelocity();
        return velocity.Length();
    },

    update: function () {
        this._super();
    }

});
Factory.nameClassMap["Wall"] = WallClass;