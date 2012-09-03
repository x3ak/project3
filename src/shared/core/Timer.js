TimerClass = Class.extend({
  target: 0,
  base: 0,
  last: 0,

  init: function (seconds) {
    this.base = GlobalTimer.time;
    this.last = GlobalTimer.time;

    this.target = seconds || 0;
  },


  set: function (seconds) {
    this.target = seconds || 0;
    this.base = GlobalTimer.time;
  },


  reset: function () {
    this.base = GlobalTimer.time;
  },


  tick: function () {
    var delta = GlobalTimer.time - this.last;
    this.last = GlobalTimer.time;
    return delta;
  },


  delta: function () {
    return GlobalTimer.time - this.base - this.target;
  }
});

GlobalTimer = {};
GlobalTimer._last = 0;
GlobalTimer.time = Date.now();
GlobalTimer.timeScale = 1;
GlobalTimer.maxStep = 0.05;

GlobalTimer.step = function () {
  var current = Date.now();
  var delta = (current - GlobalTimer._last) / 1000;
  GlobalTimer.time += Math.min(delta, GlobalTimer.maxStep) * GlobalTimer.timeScale;
  GlobalTimer._last = current;
};
