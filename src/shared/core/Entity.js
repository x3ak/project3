EntityClass = Class.extend({
    id: 0,
    size: { x:0, y:0 },
    pos: { x:0, y:0 },
    last: { x:0, y:0 },
    zIndex:0, // Entities will draw smaller zIndex values first, larger values on top.

    type: 0,            // TYPE.NONE
    checkAgainst: 0,    // TYPE.NONE
    collides: 0,        // COLLIDES.NEVER

    init: function (x, y, settings) {
        this.id = ++EntityClass._lastId;
        this.pos.x = x;
        this.pos.y = y;

        merge(this, settings);
    },

    update: function() {

    }
});


// Last used entity id; incremented with each spawned entity
EntityClass._lastId = 0;
