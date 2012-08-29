exports.kill = function (loop) {
  if (!loop) return;
  loop.alive = false;
};

exports.run = function(dt, f) {
  var loop = { alive: true };
  var start = Date.now();
  var scheduled = start + dt;
  var lastSend = dt;
  var tick = function() {
    if (!loop.alive) {
      return;
    }
    f();
    var now = Date.now();
    scheduled += dt;
    if (now > scheduled) {
      console.log("over ran timeslot by " + (now-scheduled) + "ms");
      scheduled = now;
    }
    var sleep = scheduled - now;
    setTimeout(tick, sleep);
  }
  setTimeout(tick, dt);
  return loop;
};

