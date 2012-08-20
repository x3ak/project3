
var fs = require('fs');
var vm = require('vm');

var ALL_SOURCE = [];

function include(name) {
    ALL_SOURCE.push({
        name: name,
        src: fs.readFileSync(__dirname + '/' + name)
    });
}

include("../shared/core/core.js");
include("../shared/core/Class.js");
include("../shared/core/Factory.js");
include("../shared/core/Constants.js");
include("../shared/core/Entity.js");
include("../shared/core/Timer.js");
include("../shared/core/box2D.js");

include("../shared/core/PhysicsEngine.js");
include("../shared/core/GameEngine.js");

include("../shared/core/Wall.js");
include("../shared/core/Player.js");

exports.createGameInstance = function (callbacks) {
    var fakeConsole = { log: console.log };

    var fakeContextGlobals = {
        IS_SERVER: true,
        console: fakeConsole,
        Server: callbacks
    };

    var fakeContext = vm.createContext(fakeContextGlobals);

    for (var i = 0; i < ALL_SOURCE.length; i++) {
        var s = ALL_SOURCE[i];
        try {
            vm.runInContext(String(s.src), fakeContext, s.name);
        } catch (e) {
            console.log("error loading game file " + s.name);
            throw e;
        }
    }

    fakeContext.enableLogging = function () {
        fakeConsole.log = console.log;
    };

    fakeContext.disableLogging = function () {
        fakeConsole.log = function () {};
    };

    return fakeContext;
};


exports.runInContext = function(code, context) {
    try {
        vm.runInContext(code, context);
    }
    catch (e) {
        console.log('problem while running code in context')
    }
};
