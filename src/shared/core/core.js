Number.prototype.map = function (istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((this - istart) / (istop - istart));
};

Number.prototype.limit = function (min, max) {
    return Math.min(max, Math.max(min, this));
};

Number.prototype.round = function (precision) {
    precision = Math.pow(10, precision || 0);
    return Math.round(this * precision) / precision;
};

Number.prototype.floor = function () {
    return Math.floor(this);
};

Number.prototype.ceil = function () {
    return Math.ceil(this);
};

Number.prototype.toInt = function () {
    return (this | 0);
};

Array.prototype.erase = function (item) {
    for (var i = this.length; i--; i) {
        if (this[i] === item) {
            this.splice(i, 1);
        }
    }
    return this;
};

Array.prototype.random = function () {
    return this[ (Math.random() * this.length).floor() ];
};

Function.prototype.bind = function (bind) {
    var self = this;
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return self.apply(bind || null, args);
    };
};

merge = function (original, extended) {
    for (var key in extended) {
        var ext = extended[key];
        if (
                typeof (ext) != 'object' ||
                        ext instanceof Class
                ) {
            original[key] = ext;
        }
        else {
            if (!original[key] || typeof (original[key]) != 'object') {
                original[key] = {};
            }
            merge(original[key], ext);
        }
    }
    return original;
};

function copy(object) {
    if (
            !object || typeof (object) != 'object' ||
                    object instanceof Class
            ) {
        return object;
    }
    else if (object instanceof Array) {
        var c = [];
        for (var i = 0, l = object.length; i < l; i++) {
            c[i] = copy(object[i]);
        }
        return c;
    }
    else {
        var c = {};
        for (var i in object) {
            c[i] = copy(object[i]);
        }
        return c;
    }
}
;

function ksort(obj) {
    if (!obj || typeof (obj) != 'object') {
        return [];
    }

    var keys = [], values = [];
    for (var i in obj) {
        keys.push(i);
    }

    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        values.push(obj[keys[i]]);
    }

    return values;
}
;

distSq = function(p1,p2) {
    return (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y);
}