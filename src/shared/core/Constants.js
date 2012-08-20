
ConstantsClass = Class.extend({

    GAME_UPDATES_PER_SEC : 10,
    GAME_LOOP_HZ : 1.0 / 10.0,

    PHYSICS_UPDATES_PER_SEC : 30,
    PHYSICS_LOOP_HZ : 1.0 / 30.0,

    //meters to pixels ratio 1m = 50px
    MPX_RATIO : 50

});


var Constants = new ConstantsClass();