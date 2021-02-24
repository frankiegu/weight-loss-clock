module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1612663742077, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTickMethod = exports.getTickMethod = exports.registerScale = exports.getScale = exports.Scale = exports.Quantize = exports.Quantile = exports.TimeCat = exports.Time = exports.Pow = exports.Log = exports.Linear = exports.Identity = exports.Category = void 0;
var base_1 = require("./base");
exports.Scale = base_1.default;
var base_2 = require("./category/base");
exports.Category = base_2.default;
var time_1 = require("./category/time");
exports.TimeCat = time_1.default;
var linear_1 = require("./continuous/linear");
exports.Linear = linear_1.default;
var log_1 = require("./continuous/log");
exports.Log = log_1.default;
var pow_1 = require("./continuous/pow");
exports.Pow = pow_1.default;
var time_2 = require("./continuous/time");
exports.Time = time_2.default;
var quantize_1 = require("./continuous/quantize");
exports.Quantize = quantize_1.default;
var quantile_1 = require("./continuous/quantile");
exports.Quantile = quantile_1.default;
var factory_1 = require("./factory");
Object.defineProperty(exports, "getScale", { enumerable: true, get: function () { return factory_1.getScale; } });
Object.defineProperty(exports, "registerScale", { enumerable: true, get: function () { return factory_1.registerScale; } });
var index_1 = require("./identity/index");
exports.Identity = index_1.default;
var index_2 = require("./tick-method/index");
Object.defineProperty(exports, "getTickMethod", { enumerable: true, get: function () { return index_2.getTickMethod; } });
Object.defineProperty(exports, "registerTickMethod", { enumerable: true, get: function () { return index_2.registerTickMethod; } });
factory_1.registerScale('cat', base_2.default);
factory_1.registerScale('category', base_2.default);
factory_1.registerScale('identity', index_1.default);
factory_1.registerScale('linear', linear_1.default);
factory_1.registerScale('log', log_1.default);
factory_1.registerScale('pow', pow_1.default);
factory_1.registerScale('time', time_2.default);
factory_1.registerScale('timeCat', time_1.default);
factory_1.registerScale('quantize', quantize_1.default);
factory_1.registerScale('quantile', quantile_1.default);
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./base":1612663742078,"./category/base":1612663742080,"./category/time":1612663742081,"./continuous/linear":1612663742084,"./continuous/log":1612663742086,"./continuous/pow":1612663742088,"./continuous/time":1612663742089,"./continuous/quantize":1612663742090,"./continuous/quantile":1612663742091,"./factory":1612663742092,"./identity/index":1612663742093,"./tick-method/index":1612663742094}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742078, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var register_1 = require("./tick-method/register");
var Scale = /** @class */ (function () {
    function Scale(cfg) {
        /**
         * 度量的类型
         */
        this.type = 'base';
        /**
         * 是否分类类型的度量
         */
        this.isCategory = false;
        /**
         * 是否线性度量，有linear, time 度量
         */
        this.isLinear = false;
        /**
         * 是否连续类型的度量，linear,time,log, pow, quantile, quantize 都支持
         */
        this.isContinuous = false;
        /**
         * 是否是常量的度量，传入和传出一致
         */
        this.isIdentity = false;
        this.values = [];
        this.range = [0, 1];
        this.ticks = [];
        this.__cfg__ = cfg;
        this.initCfg();
        this.init();
    }
    // 对于原始值的必要转换，如分类、时间字段需转换成数值，用transform/map命名可能更好
    Scale.prototype.translate = function (v) {
        return v;
    };
    /** 重新初始化 */
    Scale.prototype.change = function (cfg) {
        // 覆盖配置项，而不替代
        util_1.assign(this.__cfg__, cfg);
        this.init();
    };
    Scale.prototype.clone = function () {
        return this.constructor(this.__cfg__);
    };
    /** 获取坐标轴需要的ticks */
    Scale.prototype.getTicks = function () {
        var _this = this;
        return util_1.map(this.ticks, function (tick, idx) {
            if (util_1.isObject(tick)) {
                // 仅当符合Tick类型时才有意义
                return tick;
            }
            return {
                text: _this.getText(tick, idx),
                tickValue: tick,
                value: _this.scale(tick),
            };
        });
    };
    /** 获取Tick的格式化结果 */
    Scale.prototype.getText = function (value, key) {
        var formatter = this.formatter;
        var res = formatter ? formatter(value, key) : value;
        if (util_1.isNil(res) || !util_1.isFunction(res.toString)) {
            return '';
        }
        return res.toString();
    };
    // 获取配置项中的值，当前 scale 上的值可能会被修改
    Scale.prototype.getConfig = function (key) {
        return this.__cfg__[key];
    };
    // scale初始化
    Scale.prototype.init = function () {
        util_1.assign(this, this.__cfg__);
        this.setDomain();
        if (util_1.isEmpty(this.getConfig('ticks'))) {
            this.ticks = this.calculateTicks();
        }
    };
    // 子类上覆盖某些属性，不能直接在类上声明，否则会被覆盖
    Scale.prototype.initCfg = function () { };
    Scale.prototype.setDomain = function () { };
    Scale.prototype.calculateTicks = function () {
        var tickMethod = this.tickMethod;
        var ticks = [];
        if (util_1.isString(tickMethod)) {
            var method = register_1.getTickMethod(tickMethod);
            if (!method) {
                throw new Error('There is no method to to calculate ticks!');
            }
            ticks = method(this);
        }
        else if (util_1.isFunction(tickMethod)) {
            ticks = tickMethod(this);
        }
        return ticks;
    };
    // range 的最小值
    Scale.prototype.rangeMin = function () {
        return util_1.head(this.range);
    };
    // range 的最大值
    Scale.prototype.rangeMax = function () {
        return util_1.last(this.range);
    };
    /** 定义域转 0~1 */
    Scale.prototype.calcPercent = function (value, min, max) {
        if (util_1.isNumber(value)) {
            return (value - min) / (max - min);
        }
        return NaN;
    };
    /** 0~1转定义域 */
    Scale.prototype.calcValue = function (percent, min, max) {
        return min + percent * (max - min);
    };
    return Scale;
}());
exports.default = Scale;
//# sourceMappingURL=base.js.map
}, function(modId) { var map = {"./tick-method/register":1612663742079}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742079, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTickMethod = exports.getTickMethod = void 0;
var methodCache = {};
/**
 * 获取计算 ticks 的方法
 * @param key 键值
 * @returns 计算 ticks 的方法
 */
function getTickMethod(key) {
    return methodCache[key];
}
exports.getTickMethod = getTickMethod;
/**
 * 注册计算 ticks 的方法
 * @param key 键值
 * @param method 方法
 */
function registerTickMethod(key, method) {
    methodCache[key] = method;
}
exports.registerTickMethod = registerTickMethod;
//# sourceMappingURL=register.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742080, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
/**
 * 分类度量
 * @class
 */
var Category = /** @class */ (function (_super) {
    tslib_1.__extends(Category, _super);
    function Category() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'cat';
        _this.isCategory = true;
        // 用于缓存 translate 函数
        _this.cache = new Map();
        return _this;
    }
    Category.prototype.translate = function (value) {
        if (this.cache.has(value)) {
            return this.cache.get(value);
        }
        var index = util_1.indexOf(this.values, value);
        if (index === -1) {
            index = util_1.isNumber(value) ? value : NaN;
        }
        this.cache.set(value, index);
        return index;
    };
    Category.prototype.scale = function (value) {
        var order = this.translate(value);
        // 分类数据允许 0.5 范围内调整
        // if (order < this.min - 0.5 || order > this.max + 0.5) {
        //   return NaN;
        // }
        var percent = this.calcPercent(order, this.min, this.max);
        return this.calcValue(percent, this.rangeMin(), this.rangeMax());
    };
    Category.prototype.invert = function (scaledValue) {
        var domainRange = this.max - this.min;
        var percent = this.calcPercent(scaledValue, this.rangeMin(), this.rangeMax());
        var idx = Math.round(domainRange * percent) + this.min;
        if (idx < this.min || idx > this.max) {
            return NaN;
        }
        return this.values[idx];
    };
    Category.prototype.getText = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var v = value;
        // value为index
        if (util_1.isNumber(value) && !this.values.includes(value)) {
            v = this.values[v];
        }
        return _super.prototype.getText.apply(this, tslib_1.__spreadArrays([v], args));
    };
    // 复写属性
    Category.prototype.initCfg = function () {
        this.tickMethod = 'cat';
    };
    // 设置 min, max
    Category.prototype.setDomain = function () {
        // 用户有可能设置 min
        if (util_1.isNil(this.getConfig('min'))) {
            this.min = 0;
        }
        if (util_1.isNil(this.getConfig('max'))) {
            var size = this.values.length;
            this.max = size > 1 ? size - 1 : size;
        }
        // domain 改变时清除缓存
        if (this.cache) {
            this.cache.clear();
        }
    };
    return Category;
}(base_1.default));
exports.default = Category;
//# sourceMappingURL=base.js.map
}, function(modId) { var map = {"../base":1612663742078}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742081, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var time_1 = require("../util/time");
var base_1 = require("./base");
/**
 * 时间分类度量
 * @class
 */
var TimeCat = /** @class */ (function (_super) {
    tslib_1.__extends(TimeCat, _super);
    function TimeCat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'timeCat';
        return _this;
    }
    /**
     * @override
     */
    TimeCat.prototype.translate = function (value) {
        value = time_1.toTimeStamp(value);
        var index = this.values.indexOf(value);
        if (index === -1) {
            if (util_1.isNumber(value) && value < this.values.length) {
                index = value;
            }
            else {
                index = NaN;
            }
        }
        return index;
    };
    /**
     * 由于时间类型数据需要转换一下，所以复写 getText
     * @override
     */
    TimeCat.prototype.getText = function (value, tickIndex) {
        var index = this.translate(value);
        if (index > -1) {
            var result = this.values[index];
            var formatter = this.formatter;
            result = formatter ? formatter(result, tickIndex) : time_1.timeFormat(result, this.mask);
            return result;
        }
        return value;
    };
    TimeCat.prototype.initCfg = function () {
        this.tickMethod = 'time-cat';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7; // 一般时间数据会显示 7， 14， 30 天的数字
    };
    TimeCat.prototype.setDomain = function () {
        var values = this.values;
        // 针对时间分类类型，会将时间统一转换为时间戳
        util_1.each(values, function (v, i) {
            values[i] = time_1.toTimeStamp(v);
        });
        values.sort(function (v1, v2) {
            return v1 - v2;
        });
        _super.prototype.setDomain.call(this);
    };
    return TimeCat;
}(base_1.default));
exports.default = TimeCat;
//# sourceMappingURL=time.js.map
}, function(modId) { var map = {"../util/time":1612663742082,"./base":1612663742080}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742082, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickInterval = exports.YEAR = exports.MONTH = exports.DAY = exports.HOUR = exports.MINUTE = exports.SECOND = exports.toTimeStamp = exports.timeFormat = void 0;
var util_1 = require("@antv/util");
var fecha_1 = require("fecha");
var fecha1 = require("fecha");
var bisector_1 = require("./bisector");
var FORMAT_METHOD = 'format';
function timeFormat(time, mask) {
    var method = fecha1[FORMAT_METHOD] || fecha_1.default[FORMAT_METHOD];
    return method(time, mask);
}
exports.timeFormat = timeFormat;
/**
 * 转换成时间戳
 * @param value 时间值
 */
function toTimeStamp(value) {
    if (util_1.isString(value)) {
        if (value.indexOf('T') > 0) {
            value = new Date(value).getTime();
        }
        else {
            // new Date('2010/01/10') 和 new Date('2010-01-10') 的差别在于:
            // 如果仅有年月日时，前者是带有时区的: Fri Jan 10 2020 02:40:13 GMT+0800 (中国标准时间)
            // 后者会格式化成 Sun Jan 10 2010 08:00:00 GMT+0800 (中国标准时间)
            value = new Date(value.replace(/-/gi, '/')).getTime();
        }
    }
    if (util_1.isDate(value)) {
        value = value.getTime();
    }
    return value;
}
exports.toTimeStamp = toTimeStamp;
var SECOND = 1000;
exports.SECOND = SECOND;
var MINUTE = 60 * SECOND;
exports.MINUTE = MINUTE;
var HOUR = 60 * MINUTE;
exports.HOUR = HOUR;
var DAY = 24 * HOUR;
exports.DAY = DAY;
var MONTH = DAY * 31;
exports.MONTH = MONTH;
var YEAR = DAY * 365;
exports.YEAR = YEAR;
var intervals = [
    ['HH:mm:ss', SECOND],
    ['HH:mm:ss', SECOND * 10],
    ['HH:mm:ss', SECOND * 30],
    ['HH:mm', MINUTE],
    ['HH:mm', MINUTE * 10],
    ['HH:mm', MINUTE * 30],
    ['HH', HOUR],
    ['HH', HOUR * 6],
    ['HH', HOUR * 12],
    ['YYYY-MM-DD', DAY],
    ['YYYY-MM-DD', DAY * 4],
    ['YYYY-WW', DAY * 7],
    ['YYYY-MM', MONTH],
    ['YYYY-MM', MONTH * 4],
    ['YYYY-MM', MONTH * 6],
    ['YYYY', DAY * 380],
];
function getTickInterval(min, max, tickCount) {
    var target = (max - min) / tickCount;
    var idx = bisector_1.default(function (o) { return o[1]; })(intervals, target) - 1;
    var interval = intervals[idx];
    if (idx < 0) {
        interval = intervals[0];
    }
    else if (idx >= intervals.length) {
        interval = util_1.last(intervals);
    }
    return interval;
}
exports.getTickInterval = getTickInterval;
//# sourceMappingURL=time.js.map
}, function(modId) { var map = {"./bisector":1612663742083}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742083, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * 二分右侧查找
 * https://github.com/d3/d3-array/blob/master/src/bisector.js
 */
function default_1(getter) {
    /**
     * x: 目标值
     * lo: 起始位置
     * hi: 结束位置
     */
    return function (a, x, _lo, _hi) {
        var lo = util_1.isNil(_lo) ? 0 : _lo;
        var hi = util_1.isNil(_hi) ? a.length : _hi;
        while (lo < hi) {
            var mid = (lo + hi) >>> 1;
            if (getter(a[mid]) > x) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        return lo;
    };
}
exports.default = default_1;
//# sourceMappingURL=bisector.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742084, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = require("./base");
/**
 * 线性度量
 * @class
 */
var Linear = /** @class */ (function (_super) {
    tslib_1.__extends(Linear, _super);
    function Linear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'linear';
        _this.isLinear = true;
        return _this;
    }
    Linear.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        return this.min + percent * (this.max - this.min);
    };
    Linear.prototype.initCfg = function () {
        this.tickMethod = 'wilkinson-extended';
        this.nice = false;
    };
    return Linear;
}(base_1.default));
exports.default = Linear;
//# sourceMappingURL=linear.js.map
}, function(modId) { var map = {"./base":1612663742085}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742085, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
/**
 * 连续度量的基类
 * @class
 */
var Continuous = /** @class */ (function (_super) {
    tslib_1.__extends(Continuous, _super);
    function Continuous() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContinuous = true;
        return _this;
    }
    Continuous.prototype.scale = function (value) {
        if (util_1.isNil(value)) {
            return NaN;
        }
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return rangeMin;
        }
        var percent = this.getScalePercent(value);
        return rangeMin + percent * (rangeMax - rangeMin);
    };
    Continuous.prototype.init = function () {
        _super.prototype.init.call(this);
        // init 完成后保证 min, max 包含 ticks 的范围
        var ticks = this.ticks;
        var firstTick = util_1.head(ticks);
        var lastTick = util_1.last(ticks);
        if (firstTick < this.min) {
            this.min = firstTick;
        }
        if (lastTick > this.max) {
            this.max = lastTick;
        }
        // strict-limit 方式
        if (!util_1.isNil(this.minLimit)) {
            this.min = firstTick;
        }
        if (!util_1.isNil(this.maxLimit)) {
            this.max = lastTick;
        }
    };
    Continuous.prototype.setDomain = function () {
        var _a = util_1.getRange(this.values), min = _a.min, max = _a.max;
        if (util_1.isNil(this.min)) {
            this.min = min;
        }
        if (util_1.isNil(this.max)) {
            this.max = max;
        }
        if (this.min > this.max) {
            this.min = min;
            this.max = max;
        }
    };
    Continuous.prototype.calculateTicks = function () {
        var _this = this;
        var ticks = _super.prototype.calculateTicks.call(this);
        if (!this.nice) {
            ticks = util_1.filter(ticks, function (tick) {
                return tick >= _this.min && tick <= _this.max;
            });
        }
        return ticks;
    };
    // 计算原始值值占的百分比
    Continuous.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        return (value - min) / (max - min);
    };
    Continuous.prototype.getInvertPercent = function (value) {
        return (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    };
    return Continuous;
}(base_1.default));
exports.default = Continuous;
//# sourceMappingURL=base.js.map
}, function(modId) { var map = {"../base":1612663742078}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742086, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var math_1 = require("../util/math");
var base_1 = require("./base");
/**
 * Log 度量，处理非均匀分布
 */
var Log = /** @class */ (function (_super) {
    tslib_1.__extends(Log, _super);
    function Log() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'log';
        return _this;
    }
    /**
     * @override
     */
    Log.prototype.invert = function (value) {
        var base = this.base;
        var max = math_1.log(base, this.max);
        var rangeMin = this.rangeMin();
        var range = this.rangeMax() - rangeMin;
        var min;
        var positiveMin = this.positiveMin;
        if (positiveMin) {
            if (value === 0) {
                return 0;
            }
            min = math_1.log(base, positiveMin / base);
            var appendPercent = (1 / (max - min)) * range; // 0 到 positiveMin的占比
            if (value < appendPercent) {
                // 落到 0 - positiveMin 之间
                return (value / appendPercent) * positiveMin;
            }
        }
        else {
            min = math_1.log(base, this.min);
        }
        var percent = (value - rangeMin) / range;
        var tmp = percent * (max - min) + min;
        return Math.pow(base, tmp);
    };
    Log.prototype.initCfg = function () {
        this.tickMethod = 'log';
        this.base = 10;
        this.tickCount = 6;
        this.nice = true;
    };
    // 设置
    Log.prototype.setDomain = function () {
        _super.prototype.setDomain.call(this);
        var min = this.min;
        if (min < 0) {
            throw new Error('When you use log scale, the minimum value must be greater than zero!');
        }
        if (min === 0) {
            this.positiveMin = math_1.getLogPositiveMin(this.values, this.base, this.max);
        }
    };
    // 根据当前值获取占比
    Log.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return 0;
        }
        // 如果值小于等于0，则按照0处理
        if (value <= 0) {
            return 0;
        }
        var base = this.base;
        var positiveMin = this.positiveMin;
        // 如果min == 0, 则根据比0大的最小值，计算比例关系。这个最小值作为坐标轴上的第二个tick，第一个是0但是不显示
        if (positiveMin) {
            min = (positiveMin * 1) / base;
        }
        var percent;
        // 如果数值小于次小值，那么就计算 value / 次小值 占整体的比例
        if (value < positiveMin) {
            percent = value / positiveMin / (math_1.log(base, max) - math_1.log(base, min));
        }
        else {
            percent = (math_1.log(base, value) - math_1.log(base, min)) / (math_1.log(base, max) - math_1.log(base, min));
        }
        return percent;
    };
    return Log;
}(base_1.default));
exports.default = Log;
//# sourceMappingURL=log.js.map
}, function(modId) { var map = {"../util/math":1612663742087,"./base":1612663742085}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742087, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogPositiveMin = exports.log = exports.calBase = void 0;
var util_1 = require("@antv/util");
// 求以a为次幂，结果为b的基数，如 x^^a = b;求x
// 虽然数学上 b 不支持负数，但是这里需要支持 负数
function calBase(a, b) {
    var e = Math.E;
    var value;
    if (b >= 0) {
        value = Math.pow(e, Math.log(b) / a); // 使用换底公式求底
    }
    else {
        value = Math.pow(e, Math.log(-b) / a) * -1; // 使用换底公式求底
    }
    return value;
}
exports.calBase = calBase;
function log(a, b) {
    if (a === 1) {
        return 1;
    }
    return Math.log(b) / Math.log(a);
}
exports.log = log;
function getLogPositiveMin(values, base, max) {
    if (util_1.isNil(max)) {
        max = Math.max.apply(null, values);
    }
    var positiveMin = max;
    util_1.each(values, function (value) {
        if (value > 0 && value < positiveMin) {
            positiveMin = value;
        }
    });
    if (positiveMin === max) {
        positiveMin = max / base;
    }
    if (positiveMin > 1) {
        positiveMin = 1;
    }
    return positiveMin;
}
exports.getLogPositiveMin = getLogPositiveMin;
//# sourceMappingURL=math.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742088, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var math_1 = require("../util/math");
var base_1 = require("./base");
/**
 * Pow 度量，处理非均匀分布
 */
var Pow = /** @class */ (function (_super) {
    tslib_1.__extends(Pow, _super);
    function Pow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'pow';
        return _this;
    }
    /**
     * @override
     */
    Pow.prototype.invert = function (value) {
        var percent = this.getInvertPercent(value);
        var exponent = this.exponent;
        var max = math_1.calBase(exponent, this.max);
        var min = math_1.calBase(exponent, this.min);
        var tmp = percent * (max - min) + min;
        var factor = tmp >= 0 ? 1 : -1;
        return Math.pow(tmp, exponent) * factor;
    };
    Pow.prototype.initCfg = function () {
        this.tickMethod = 'pow';
        this.exponent = 2;
        this.tickCount = 5;
        this.nice = true;
    };
    // 获取度量计算时，value占的定义域百分比
    Pow.prototype.getScalePercent = function (value) {
        var max = this.max;
        var min = this.min;
        if (max === min) {
            return 0;
        }
        var exponent = this.exponent;
        var percent = (math_1.calBase(exponent, value) - math_1.calBase(exponent, min)) / (math_1.calBase(exponent, max) - math_1.calBase(exponent, min));
        return percent;
    };
    return Pow;
}(base_1.default));
exports.default = Pow;
//# sourceMappingURL=pow.js.map
}, function(modId) { var map = {"../util/math":1612663742087,"./base":1612663742085}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742089, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var time_1 = require("../util/time");
var linear_1 = require("./linear");
/**
 * 时间度量
 * @class
 */
var Time = /** @class */ (function (_super) {
    tslib_1.__extends(Time, _super);
    function Time() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'time';
        return _this;
    }
    /**
     * @override
     */
    Time.prototype.getText = function (value, index) {
        var numberValue = this.translate(value);
        var formatter = this.formatter;
        return formatter ? formatter(numberValue, index) : time_1.timeFormat(numberValue, this.mask);
    };
    /**
     * @override
     */
    Time.prototype.scale = function (value) {
        var v = value;
        if (util_1.isString(v) || util_1.isDate(v)) {
            v = this.translate(v);
        }
        return _super.prototype.scale.call(this, v);
    };
    /**
     * 将时间转换成数字
     * @override
     */
    Time.prototype.translate = function (v) {
        return time_1.toTimeStamp(v);
    };
    Time.prototype.initCfg = function () {
        this.tickMethod = 'time-pretty';
        this.mask = 'YYYY-MM-DD';
        this.tickCount = 7;
        this.nice = false;
    };
    Time.prototype.setDomain = function () {
        var values = this.values;
        // 是否设置了 min, max，而不是直接取 this.min, this.max
        var minConfig = this.getConfig('min');
        var maxConfig = this.getConfig('max');
        // 如果设置了 min,max 则转换成时间戳
        if (!util_1.isNil(minConfig) || !util_1.isNumber(minConfig)) {
            this.min = this.translate(this.min);
        }
        if (!util_1.isNil(maxConfig) || !util_1.isNumber(maxConfig)) {
            this.max = this.translate(this.max);
        }
        // 没有设置 min, max 时
        if (values && values.length) {
            // 重新计算最大最小值
            var timeStamps_1 = [];
            var min_1 = Infinity; // 最小值
            var secondMin_1 = min_1; // 次小值
            var max_1 = 0;
            // 使用一个循环，计算min,max,secondMin
            util_1.each(values, function (v) {
                var timeStamp = time_1.toTimeStamp(v);
                if (isNaN(timeStamp)) {
                    throw new TypeError("Invalid Time: " + v + " in time scale!");
                }
                if (min_1 > timeStamp) {
                    secondMin_1 = min_1;
                    min_1 = timeStamp;
                }
                else if (secondMin_1 > timeStamp) {
                    secondMin_1 = timeStamp;
                }
                if (max_1 < timeStamp) {
                    max_1 = timeStamp;
                }
                timeStamps_1.push(timeStamp);
            });
            // 存在多个值时，设置最小间距
            if (values.length > 1) {
                this.minTickInterval = secondMin_1 - min_1;
            }
            if (util_1.isNil(minConfig)) {
                this.min = min_1;
            }
            if (util_1.isNil(maxConfig)) {
                this.max = max_1;
            }
        }
    };
    return Time;
}(linear_1.default));
exports.default = Time;
//# sourceMappingURL=time.js.map
}, function(modId) { var map = {"../util/time":1612663742082,"./linear":1612663742084}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742090, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("./base");
/**
 * 分段度量
 */
var Quantize = /** @class */ (function (_super) {
    tslib_1.__extends(Quantize, _super);
    function Quantize() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'quantize';
        return _this;
    }
    Quantize.prototype.invert = function (value) {
        var ticks = this.ticks;
        var length = ticks.length;
        var percent = this.getInvertPercent(value);
        var minIndex = Math.floor(percent * (length - 1));
        // 最后一个
        if (minIndex >= length - 1) {
            return util_1.last(ticks);
        }
        // 超出左边界， 则取第一个
        if (minIndex < 0) {
            return util_1.head(ticks);
        }
        var minTick = ticks[minIndex];
        var nextTick = ticks[minIndex + 1];
        // 比当前值小的 tick 在度量上的占比
        var minIndexPercent = minIndex / (length - 1);
        var maxIndexPercent = (minIndex + 1) / (length - 1);
        return minTick + (percent - minIndexPercent) / (maxIndexPercent - minIndexPercent) * (nextTick - minTick);
    };
    Quantize.prototype.initCfg = function () {
        this.tickMethod = 'r-pretty';
        this.tickCount = 5;
        this.nice = true;
    };
    Quantize.prototype.calculateTicks = function () {
        var ticks = _super.prototype.calculateTicks.call(this);
        if (!this.nice) { // 如果 nice = false ,补充 min, max
            if (util_1.last(ticks) !== this.max) {
                ticks.push(this.max);
            }
            if (util_1.head(ticks) !== this.min) {
                ticks.unshift(this.min);
            }
        }
        return ticks;
    };
    // 计算当前值在刻度中的占比
    Quantize.prototype.getScalePercent = function (value) {
        var ticks = this.ticks;
        // 超出左边界
        if (value < util_1.head(ticks)) {
            return 0;
        }
        // 超出右边界
        if (value > util_1.last(ticks)) {
            return 1;
        }
        var minIndex = 0;
        util_1.each(ticks, function (tick, index) {
            if (value >= tick) {
                minIndex = index;
            }
            else {
                return false;
            }
        });
        return minIndex / (ticks.length - 1);
    };
    return Quantize;
}(base_1.default));
exports.default = Quantize;
//# sourceMappingURL=quantize.js.map
}, function(modId) { var map = {"./base":1612663742085}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742091, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var quantize_1 = require("./quantize");
var Quantile = /** @class */ (function (_super) {
    tslib_1.__extends(Quantile, _super);
    function Quantile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'quantile';
        return _this;
    }
    Quantile.prototype.initCfg = function () {
        this.tickMethod = 'quantile';
        this.tickCount = 5;
        this.nice = true;
    };
    return Quantile;
}(quantize_1.default));
exports.default = Quantile;
//# sourceMappingURL=quantile.js.map
}, function(modId) { var map = {"./quantize":1612663742090}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742092, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScale = exports.getScale = exports.Scale = void 0;
var base_1 = require("./base");
exports.Scale = base_1.default;
var map = {};
function getClass(key) {
    return map[key];
}
exports.getScale = getClass;
function registerClass(key, cls) {
    if (getClass(key)) {
        throw new Error("type '" + key + "' existed.");
    }
    map[key] = cls;
}
exports.registerScale = registerClass;
//# sourceMappingURL=factory.js.map
}, function(modId) { var map = {"./base":1612663742078}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742093, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
/**
 * identity scale原则上是定义域和值域一致，scale/invert方法也是一致的
 * 参考R的实现：https://github.com/r-lib/scales/blob/master/R/pal-identity.r
 * 参考d3的实现（做了下转型）：https://github.com/d3/d3-scale/blob/master/src/identity.js
 */
var Identity = /** @class */ (function (_super) {
    tslib_1.__extends(Identity, _super);
    function Identity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'identity';
        _this.isIdentity = true;
        return _this;
    }
    Identity.prototype.calculateTicks = function () {
        return this.values;
    };
    Identity.prototype.scale = function (value) {
        // 如果传入的值不等于 identity 的值，则直接返回，用于一维图时的 dodge
        if (this.values[0] !== value && util_1.isNumber(value)) {
            return value;
        }
        return this.range[0];
    };
    Identity.prototype.invert = function (value) {
        var range = this.range;
        if (value < range[0] || value > range[1]) {
            return NaN;
        }
        return this.values[0];
    };
    return Identity;
}(base_1.default));
exports.default = Identity;
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"../base":1612663742078}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742094, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTickMethod = exports.getTickMethod = void 0;
var cat_1 = require("./cat");
var d3_linear_1 = require("./d3-linear");
var linear_1 = require("./linear");
var log_1 = require("./log");
var pow_1 = require("./pow");
var quantile_1 = require("./quantile");
var r_prettry_1 = require("./r-prettry");
var register_1 = require("./register");
Object.defineProperty(exports, "getTickMethod", { enumerable: true, get: function () { return register_1.getTickMethod; } });
Object.defineProperty(exports, "registerTickMethod", { enumerable: true, get: function () { return register_1.registerTickMethod; } });
var time_1 = require("./time");
var time_cat_1 = require("./time-cat");
var time_pretty_1 = require("./time-pretty");
register_1.registerTickMethod('cat', cat_1.default);
register_1.registerTickMethod('time-cat', time_cat_1.default);
register_1.registerTickMethod('wilkinson-extended', linear_1.default);
register_1.registerTickMethod('r-pretty', r_prettry_1.default);
register_1.registerTickMethod('time', time_1.default);
register_1.registerTickMethod('time-pretty', time_pretty_1.default);
register_1.registerTickMethod('log', log_1.default);
register_1.registerTickMethod('pow', pow_1.default);
register_1.registerTickMethod('quantile', quantile_1.default);
register_1.registerTickMethod('d3-linear', d3_linear_1.default);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./cat":1612663742095,"./d3-linear":1612663742097,"./linear":1612663742101,"./log":1612663742102,"./pow":1612663742103,"./quantile":1612663742105,"./r-prettry":1612663742106,"./register":1612663742079,"./time":1612663742107,"./time-cat":1612663742108,"./time-pretty":1612663742109}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742095, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var extended_1 = require("../util/extended");
/**
 * 计算分类 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculateCatTicks(cfg) {
    var values = cfg.values, tickInterval = cfg.tickInterval, tickCount = cfg.tickCount;
    var ticks = values;
    if (util_1.isNumber(tickInterval)) {
        return util_1.filter(ticks, function (__, i) { return i % tickInterval === 0; });
    }
    var min = cfg.min, max = cfg.max;
    if (util_1.isNil(min)) {
        min = 0;
    }
    if (util_1.isNil(max)) {
        max = values.length - 1;
    }
    if (util_1.isNumber(tickCount) && tickCount < max - min) {
        // 简单过滤，部分情况下小数的倍数也可以是整数
        // tslint:disable-next-line: no-shadowed-variable
        var ticks_1 = extended_1.default(min, max, tickCount, false, [1, 2, 5, 3, 4, 7, 6, 8, 9]).ticks;
        var valid = util_1.filter(ticks_1, function (tick) { return tick >= min && tick <= max; });
        return valid.map(function (index) { return values[index]; });
    }
    return values.slice(min, max + 1);
}
exports.default = calculateCatTicks;
//# sourceMappingURL=cat.js.map
}, function(modId) { var map = {"../util/extended":1612663742096}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742096, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_Q = exports.DEFAULT_Q = void 0;
var util_1 = require("@antv/util");
exports.DEFAULT_Q = [1, 5, 2, 2.5, 4, 3];
exports.ALL_Q = [1, 5, 2, 2.5, 4, 3, 1.5, 7, 6, 8, 9];
var eps = Number.EPSILON * 100;
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}
function simplicity(q, Q, j, lmin, lmax, lstep) {
    var n = util_1.size(Q);
    var i = util_1.indexOf(Q, q);
    var v = 0;
    var m = mod(lmin, lstep);
    if ((m < eps || lstep - m < eps) && lmin <= 0 && lmax >= 0) {
        v = 1;
    }
    return 1 - i / (n - 1) - j + v;
}
function simplicityMax(q, Q, j) {
    var n = util_1.size(Q);
    var i = util_1.indexOf(Q, q);
    var v = 1;
    return 1 - i / (n - 1) - j + v;
}
function density(k, m, dmin, dmax, lmin, lmax) {
    var r = (k - 1) / (lmax - lmin);
    var rt = (m - 1) / (Math.max(lmax, dmax) - Math.min(dmin, lmin));
    return 2 - Math.max(r / rt, rt / r);
}
function densityMax(k, m) {
    if (k >= m) {
        return 2 - (k - 1) / (m - 1);
    }
    return 1;
}
function coverage(dmin, dmax, lmin, lmax) {
    var range = dmax - dmin;
    return 1 - (0.5 * (Math.pow(dmax - lmax, 2) + Math.pow(dmin - lmin, 2))) / Math.pow(0.1 * range, 2);
}
function coverageMax(dmin, dmax, span) {
    var range = dmax - dmin;
    if (span > range) {
        var half = (span - range) / 2;
        return 1 - Math.pow(half, 2) / Math.pow(0.1 * range, 2);
    }
    return 1;
}
function legibility() {
    return 1;
}
/**
 * An Extension of Wilkinson's Algorithm for Position Tick Labels on Axes
 * https://www.yuque.com/preview/yuque/0/2019/pdf/185317/1546999150858-45c3b9c2-4e86-4223-bf1a-8a732e8195ed.pdf
 * @param dmin 最小值
 * @param dmax 最大值
 * @param m tick个数
 * @param onlyLoose 是否允许扩展min、max，不绝对强制，例如[3, 97]
 * @param Q nice numbers集合
 * @param w 四个优化组件的权重
 */
function extended(dmin, dmax, m, onlyLoose, Q, w) {
    if (m === void 0) { m = 5; }
    if (onlyLoose === void 0) { onlyLoose = true; }
    if (Q === void 0) { Q = exports.DEFAULT_Q; }
    if (w === void 0) { w = [0.25, 0.2, 0.5, 0.05]; }
    // 异常数据情况下，直接返回，防止 oom
    if (typeof dmin !== 'number' || typeof dmax !== 'number' || !m) {
        return {
            min: 0,
            max: 0,
            ticks: [],
        };
    }
    // js 极大值极小值问题，差值小于 1e-15 会导致计算出错
    if (dmax - dmin < 1e-15 || m === 1) {
        return {
            min: dmin,
            max: dmax,
            ticks: [dmin],
        };
    }
    var best = {
        score: -2,
        lmin: 0,
        lmax: 0,
        lstep: 0,
    };
    var j = 1;
    while (j < Infinity) {
        for (var _i = 0, Q_1 = Q; _i < Q_1.length; _i++) {
            var q = Q_1[_i];
            var sm = simplicityMax(q, Q, j);
            if (Number.isNaN(sm)) {
                throw new Error('NaN');
            }
            if (w[0] * sm + w[1] + w[2] + w[3] < best.score) {
                j = Infinity;
                break;
            }
            var k = 2;
            while (k < Infinity) {
                var dm = densityMax(k, m);
                if (w[0] * sm + w[1] + w[2] * dm + w[3] < best.score) {
                    break;
                }
                var delta = (dmax - dmin) / (k + 1) / j / q;
                var z = Math.ceil(Math.log10(delta));
                while (z < Infinity) {
                    var step = j * q * Math.pow(10, z);
                    var cm = coverageMax(dmin, dmax, step * (k - 1));
                    if (w[0] * sm + w[1] * cm + w[2] * dm + w[3] < best.score) {
                        break;
                    }
                    var minStart = Math.floor(dmax / step) * j - (k - 1) * j;
                    var maxStart = Math.ceil(dmin / step) * j;
                    if (minStart > maxStart) {
                        z = z + 1;
                        continue;
                    }
                    for (var start = minStart; start <= maxStart; start = start + 1) {
                        var lmin = start * (step / j);
                        var lmax = lmin + step * (k - 1);
                        var lstep = step;
                        var s = simplicity(q, Q, j, lmin, lmax, lstep);
                        var c = coverage(dmin, dmax, lmin, lmax);
                        var g = density(k, m, dmin, dmax, lmin, lmax);
                        var l = legibility();
                        var score = w[0] * s + w[1] * c + w[2] * g + w[3] * l;
                        if (score > best.score && (!onlyLoose || (lmin <= dmin && lmax >= dmax))) {
                            best.lmin = lmin;
                            best.lmax = lmax;
                            best.lstep = lstep;
                            best.score = score;
                        }
                    }
                    z = z + 1;
                }
                k = k + 1;
            }
        }
        j = j + 1;
    }
    // 步长为浮点数时处理精度
    var toFixed = Number.isInteger(best.lstep) ? 0 : Math.ceil(Math.abs(Math.log10(best.lstep)));
    var range = [];
    for (var tick = best.lmin; tick <= best.lmax; tick += best.lstep) {
        range.push(tick);
    }
    var ticks = toFixed ? util_1.map(range, function (x) { return Number.parseFloat(x.toFixed(toFixed)); }) : range;
    return {
        min: Math.min(dmin, util_1.head(ticks)),
        max: Math.max(dmax, util_1.last(ticks)),
        ticks: ticks,
    };
}
exports.default = extended;
//# sourceMappingURL=extended.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742097, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var d3_linear_1 = require("../util/d3-linear");
var interval_1 = require("../util/interval");
var strict_limit_1 = require("../util/strict-limit");
function d3LinearTickMethod(cfg) {
    var min = cfg.min, max = cfg.max, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = d3_linear_1.default(cfg);
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = d3LinearTickMethod;
//# sourceMappingURL=d3-linear.js.map
}, function(modId) { var map = {"../util/d3-linear":1612663742098,"../util/interval":1612663742099,"../util/strict-limit":1612663742100}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742098, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.D3Linear = void 0;
function d3Linear(cfg) {
    var min = cfg.min, max = cfg.max, nice = cfg.nice, tickCount = cfg.tickCount;
    var linear = new D3Linear();
    linear.domain([min, max]);
    if (nice) {
        linear.nice(tickCount);
    }
    return linear.ticks(tickCount);
}
exports.default = d3Linear;
var DEFAULT_COUNT = 5;
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
// https://github.com/d3/d3-scale
var D3Linear = /** @class */ (function () {
    function D3Linear() {
        this._domain = [0, 1];
    }
    D3Linear.prototype.domain = function (domain) {
        if (domain) {
            this._domain = Array.from(domain, Number);
            return this;
        }
        return this._domain.slice();
    };
    D3Linear.prototype.nice = function (count) {
        var _a, _b;
        if (count === void 0) { count = DEFAULT_COUNT; }
        var d = this._domain.slice();
        var i0 = 0;
        var i1 = this._domain.length - 1;
        var start = this._domain[i0];
        var stop = this._domain[i1];
        var step;
        if (stop < start) {
            _a = [stop, start], start = _a[0], stop = _a[1];
            _b = [i1, i0], i0 = _b[0], i1 = _b[1];
        }
        step = tickIncrement(start, stop, count);
        if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
            step = tickIncrement(start, stop, count);
        }
        else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
            step = tickIncrement(start, stop, count);
        }
        if (step > 0) {
            d[i0] = Math.floor(start / step) * step;
            d[i1] = Math.ceil(stop / step) * step;
            this.domain(d);
        }
        else if (step < 0) {
            d[i0] = Math.ceil(start * step) / step;
            d[i1] = Math.floor(stop * step) / step;
            this.domain(d);
        }
        return this;
    };
    D3Linear.prototype.ticks = function (count) {
        if (count === void 0) { count = DEFAULT_COUNT; }
        return d3ArrayTicks(this._domain[0], this._domain[this._domain.length - 1], count || DEFAULT_COUNT);
    };
    return D3Linear;
}());
exports.D3Linear = D3Linear;
function d3ArrayTicks(start, stop, count) {
    var reverse;
    var i = -1;
    var n;
    var ticks;
    var step;
    (stop = +stop), (start = +start), (count = +count);
    if (start === stop && count > 0) {
        return [start];
    }
    // tslint:disable-next-line
    if ((reverse = stop < start)) {
        (n = start), (start = stop), (stop = n);
    }
    // tslint:disable-next-line
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) {
        return [];
    }
    if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array((n = Math.ceil(stop - start + 1)));
        while (++i < n) {
            ticks[i] = (start + i) * step;
        }
    }
    else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array((n = Math.ceil(start - stop + 1)));
        while (++i < n) {
            ticks[i] = (start - i) / step;
        }
    }
    if (reverse) {
        ticks.reverse();
    }
    return ticks;
}
function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count);
    var power = Math.floor(Math.log(step) / Math.LN10);
    var error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
//# sourceMappingURL=d3-linear.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742099, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
function snapMultiple(v, base, snapType) {
    var div;
    if (snapType === 'ceil') {
        div = Math.ceil(v / base);
    }
    else if (snapType === 'floor') {
        div = Math.floor(v / base);
    }
    else {
        div = Math.round(v / base);
    }
    return div * base;
}
function intervalTicks(min, max, interval) {
    // 变成 interval 的倍数
    var minTick = snapMultiple(min, interval, 'floor');
    var maxTick = snapMultiple(max, interval, 'ceil');
    // 统一小数位数
    minTick = util_1.fixedBase(minTick, interval);
    maxTick = util_1.fixedBase(maxTick, interval);
    var ticks = [];
    for (var i = minTick; i <= maxTick; i = i + interval) {
        var tickValue = util_1.fixedBase(i, interval); // 防止浮点数加法出现问题
        ticks.push(tickValue);
    }
    return {
        min: minTick,
        max: maxTick,
        ticks: ticks
    };
}
exports.default = intervalTicks;
//# sourceMappingURL=interval.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742100, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
/**
 * 按照给定的 minLimit/maxLimit/tickCount 均匀计算出刻度 ticks
 *
 * @param cfg Scale 配置项
 * @return ticks
 */
function strictLimit(cfg, defaultMin, defaultMax) {
    var _a;
    var minLimit = cfg.minLimit, maxLimit = cfg.maxLimit, min = cfg.min, max = cfg.max, _b = cfg.tickCount, tickCount = _b === void 0 ? 5 : _b;
    var tickMin = util_1.isNil(minLimit) ? (util_1.isNil(defaultMin) ? min : defaultMin) : minLimit;
    var tickMax = util_1.isNil(maxLimit) ? (util_1.isNil(defaultMax) ? max : defaultMax) : maxLimit;
    if (tickMin > tickMax) {
        _a = [tickMin, tickMax], tickMax = _a[0], tickMin = _a[1];
    }
    if (tickCount <= 2) {
        return [tickMin, tickMax];
    }
    var step = (tickMax - tickMin) / (tickCount - 1);
    var ticks = [];
    for (var i = 0; i < tickCount; i++) {
        ticks.push(tickMin + step * i);
    }
    return ticks;
}
exports.default = strictLimit;
//# sourceMappingURL=strict-limit.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742101, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var extended_1 = require("../util/extended");
var interval_1 = require("../util/interval");
var strict_limit_1 = require("../util/strict-limit");
/**
 * 计算线性的 ticks，使用 wilkinson extended 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function linear(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, nice = cfg.nice, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = extended_1.default(min, max, tickCount, nice).ticks;
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = linear;
//# sourceMappingURL=linear.js.map
}, function(modId) { var map = {"../util/extended":1612663742096,"../util/interval":1612663742099,"../util/strict-limit":1612663742100}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742102, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("../util/math");
/**
 * 计算 log 的 ticks，考虑 min = 0 的场景
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculateLogTicks(cfg) {
    var base = cfg.base, tickCount = cfg.tickCount, min = cfg.min, max = cfg.max, values = cfg.values;
    var minTick;
    var maxTick = math_1.log(base, max);
    if (min > 0) {
        minTick = Math.floor(math_1.log(base, min));
    }
    else {
        var positiveMin = math_1.getLogPositiveMin(values, base, max);
        minTick = Math.floor(math_1.log(base, positiveMin));
    }
    var count = maxTick - minTick;
    var avg = Math.ceil(count / tickCount);
    var ticks = [];
    for (var i = minTick; i < maxTick + avg; i = i + avg) {
        ticks.push(Math.pow(base, i));
    }
    if (min <= 0) {
        // 最小值 <= 0 时显示 0
        ticks.unshift(0);
    }
    return ticks;
}
exports.default = calculateLogTicks;
//# sourceMappingURL=log.js.map
}, function(modId) { var map = {"../util/math":1612663742087}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742103, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("../util/math");
var pretty_1 = require("../util/pretty");
/**
 * 计算 Pow 的 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculatePowTicks(cfg) {
    var exponent = cfg.exponent, tickCount = cfg.tickCount;
    var max = Math.ceil(math_1.calBase(exponent, cfg.max));
    var min = Math.floor(math_1.calBase(exponent, cfg.min));
    var ticks = pretty_1.default(min, max, tickCount).ticks;
    return ticks.map(function (tick) {
        var factor = tick >= 0 ? 1 : -1;
        return Math.pow(tick, exponent) * factor;
    });
}
exports.default = calculatePowTicks;
//# sourceMappingURL=pow.js.map
}, function(modId) { var map = {"../util/math":1612663742087,"../util/pretty":1612663742104}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742104, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
function pretty(min, max, n) {
    if (n === void 0) { n = 5; }
    var res = {
        max: 0,
        min: 0,
        ticks: [],
    };
    if (min === max) {
        return {
            max: max,
            min: min,
            ticks: [min],
        };
    }
    /*
      R pretty:
      https://svn.r-project.org/R/trunk/src/appl/pretty.c
      https://www.rdocumentation.org/packages/base/versions/3.5.2/topics/pretty
      */
    var h = 1.5; // high.u.bias
    var h5 = 0.5 + 1.5 * h; // u5.bias
    // 反正我也不会调参，跳过所有判断步骤
    var d = max - min;
    var c = d / n;
    // 当d非常小的时候触发，但似乎没什么用
    // const min_n = Math.floor(n / 3);
    // const shrink_sml = Math.pow(2, 5);
    // if (Math.log10(d) < -2) {
    //   c = (_.max([ Math.abs(max), Math.abs(min) ]) * shrink_sml) / min_n;
    // }
    var base = Math.pow(10, Math.floor(Math.log10(c)));
    var toFixed = base < 1 ? Math.ceil(Math.abs(Math.log10(base))) : 0;
    var unit = base;
    if (2 * base - c < h * (c - unit)) {
        unit = 2 * base;
        if (5 * base - c < h5 * (c - unit)) {
            unit = 5 * base;
            if (10 * base - c < h * (c - unit)) {
                unit = 10 * base;
            }
        }
    }
    var nu = Math.ceil(max / unit);
    var ns = Math.floor(min / unit);
    res.max = Math.max(nu * unit, max);
    res.min = Math.min(ns * unit, min);
    var x = Number.parseFloat((ns * unit).toFixed(toFixed));
    while (x < max) {
        res.ticks.push(x);
        x += unit;
        if (toFixed) {
            x = Number.parseFloat(x.toFixed(toFixed));
        }
    }
    res.ticks.push(x);
    return res;
}
exports.default = pretty;
//# sourceMappingURL=pretty.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742105, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 计算几分位 https://github.com/simple-statistics/simple-statistics/blob/master/src/quantile_sorted.js
 * @param x  数组
 * @param p  百分比
 */
function quantileSorted(x, p) {
    var idx = x.length * p;
    /*if (x.length === 0) { // 当前场景这些条件不可能命中
      throw new Error('quantile requires at least one value.');
    } else if (p < 0 || p > 1) {
      throw new Error('quantiles must be between 0 and 1');
    } else */
    if (p === 1) {
        // If p is 1, directly return the last element
        return x[x.length - 1];
    }
    else if (p === 0) {
        // If p is 0, directly return the first element
        return x[0];
    }
    else if (idx % 1 !== 0) {
        // If p is not integer, return the next element in array
        return x[Math.ceil(idx) - 1];
    }
    else if (x.length % 2 === 0) {
        // If the list has even-length, we'll take the average of this number
        // and the next value, if there is one
        return (x[idx - 1] + x[idx]) / 2;
    }
    else {
        // Finally, in the simple case of an integer value
        // with an odd-length list, return the x value at the index.
        return x[idx];
    }
}
function calculateTicks(cfg) {
    var tickCount = cfg.tickCount, values = cfg.values;
    if (!values || !values.length) {
        return [];
    }
    var sorted = values.slice().sort(function (a, b) {
        return a - b;
    });
    var ticks = [];
    for (var i = 0; i < tickCount; i++) {
        var p = i / (tickCount - 1);
        ticks.push(quantileSorted(sorted, p));
    }
    return ticks;
}
exports.default = calculateTicks;
//# sourceMappingURL=quantile.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742106, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var interval_1 = require("../util/interval");
var pretty_1 = require("../util/pretty");
var strict_limit_1 = require("../util/strict-limit");
/**
 * 计算线性的 ticks，使用 R's pretty 方法
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function linearPretty(cfg) {
    var min = cfg.min, max = cfg.max, tickCount = cfg.tickCount, tickInterval = cfg.tickInterval, minLimit = cfg.minLimit, maxLimit = cfg.maxLimit;
    var ticks = pretty_1.default(min, max, tickCount).ticks;
    if (!util_1.isNil(minLimit) || !util_1.isNil(maxLimit)) {
        return strict_limit_1.default(cfg, util_1.head(ticks), util_1.last(ticks));
    }
    if (tickInterval) {
        return interval_1.default(min, max, tickInterval).ticks;
    }
    return ticks;
}
exports.default = linearPretty;
//# sourceMappingURL=r-prettry.js.map
}, function(modId) { var map = {"../util/interval":1612663742099,"../util/pretty":1612663742104,"../util/strict-limit":1612663742100}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742107, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var time_1 = require("../util/time");
function calculateTimeTicks(cfg) {
    var min = cfg.min, max = cfg.max, minTickInterval = cfg.minTickInterval;
    var tickInterval = cfg.tickInterval;
    var tickCount = cfg.tickCount;
    // 指定 tickInterval 后 tickCount 不生效，需要重新计算
    if (tickInterval) {
        tickCount = Math.ceil((max - min) / tickInterval);
    }
    else {
        tickInterval = time_1.getTickInterval(min, max, tickCount)[1];
        var count = (max - min) / tickInterval;
        var ratio = count / tickCount;
        if (ratio > 1) {
            tickInterval = tickInterval * Math.ceil(ratio);
        }
        // 如果设置了最小间距，则使用最小间距
        if (minTickInterval && tickInterval < minTickInterval) {
            tickInterval = minTickInterval;
        }
    }
    var ticks = [];
    for (var i = min; i < max + tickInterval; i += tickInterval) {
        ticks.push(i);
    }
    return ticks;
}
exports.default = calculateTimeTicks;
//# sourceMappingURL=time.js.map
}, function(modId) { var map = {"../util/time":1612663742082}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742108, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var cat_1 = require("./cat");
/**
 * 计算时间分类的 ticks, 保头，保尾
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function calculateTimeCatTicks(cfg) {
    var ticks = cat_1.default(cfg);
    var lastValue = util_1.last(cfg.values);
    if (lastValue !== util_1.last(ticks)) {
        ticks.push(lastValue);
    }
    return ticks;
}
exports.default = calculateTimeCatTicks;
//# sourceMappingURL=time-cat.js.map
}, function(modId) { var map = {"./cat":1612663742095}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1612663742109, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var time_1 = require("../util/time");
function getYear(date) {
    return new Date(date).getFullYear();
}
function createYear(year) {
    return new Date(year, 0, 1).getTime();
}
function getMonth(date) {
    return new Date(date).getMonth();
}
function diffMonth(min, max) {
    var minYear = getYear(min);
    var maxYear = getYear(max);
    var minMonth = getMonth(min);
    var maxMonth = getMonth(max);
    return (maxYear - minYear) * 12 + ((maxMonth - minMonth) % 12);
}
function creatMonth(year, month) {
    return new Date(year, month, 1).getTime();
}
function diffDay(min, max) {
    return Math.ceil((max - min) / time_1.DAY);
}
function diffHour(min, max) {
    return Math.ceil((max - min) / time_1.HOUR);
}
function diffMinus(min, max) {
    return Math.ceil((max - min) / (60 * 1000));
}
/**
 * 计算 time 的 ticks，对 month, year 进行 pretty 处理
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function timePretty(cfg) {
    var min = cfg.min, max = cfg.max, minTickInterval = cfg.minTickInterval, tickCount = cfg.tickCount;
    var tickInterval = cfg.tickInterval;
    var ticks = [];
    // 指定 tickInterval 后 tickCount 不生效，需要重新计算
    if (!tickInterval) {
        tickInterval = (max - min) / tickCount;
        // 如果设置了最小间距，则使用最小间距
        if (minTickInterval && tickInterval < minTickInterval) {
            tickInterval = minTickInterval;
        }
    }
    var minYear = getYear(min);
    // 如果间距大于 1 年，则将开始日期从整年开始
    if (tickInterval > time_1.YEAR) {
        var maxYear = getYear(max);
        var yearInterval = Math.ceil(tickInterval / time_1.YEAR);
        for (var i = minYear; i <= maxYear + yearInterval; i = i + yearInterval) {
            ticks.push(createYear(i));
        }
    }
    else if (tickInterval > time_1.MONTH) {
        // 大于月时
        var monthInterval = Math.ceil(tickInterval / time_1.MONTH);
        var mmMoth = getMonth(min);
        var dMonths = diffMonth(min, max);
        for (var i = 0; i <= dMonths + monthInterval; i = i + monthInterval) {
            ticks.push(creatMonth(minYear, i + mmMoth));
        }
    }
    else if (tickInterval > time_1.DAY) {
        // 大于天
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var mday = date.getDate();
        var day = Math.ceil(tickInterval / time_1.DAY);
        var ddays = diffDay(min, max);
        for (var i = 0; i < ddays + day; i = i + day) {
            ticks.push(new Date(year, month, mday + i).getTime());
        }
    }
    else if (tickInterval > time_1.HOUR) {
        // 大于小时
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var hours = Math.ceil(tickInterval / time_1.HOUR);
        var dHours = diffHour(min, max);
        for (var i = 0; i <= dHours + hours; i = i + hours) {
            ticks.push(new Date(year, month, day, hour + i).getTime());
        }
    }
    else if (tickInterval > time_1.MINUTE) {
        // 大于分钟
        var dMinus = diffMinus(min, max);
        var minutes = Math.ceil(tickInterval / time_1.MINUTE);
        for (var i = 0; i <= dMinus + minutes; i = i + minutes) {
            ticks.push(min + i * time_1.MINUTE);
        }
    }
    else {
        // 小于分钟
        var interval = tickInterval;
        if (interval < time_1.SECOND) {
            interval = time_1.SECOND;
        }
        var minSecond = Math.floor(min / time_1.SECOND) * time_1.SECOND;
        var dSeconds = Math.ceil((max - min) / time_1.SECOND);
        var seconds = Math.ceil(interval / time_1.SECOND);
        for (var i = 0; i < dSeconds + seconds; i = i + seconds) {
            ticks.push(minSecond + i * time_1.SECOND);
        }
    }
    // 最好是能从算法能解决这个问题，但是如果指定了 tickInterval，计算 ticks，也只能这么算，所以
    // 打印警告提示
    if (ticks.length >= 512) {
        console.warn("Notice: current ticks length(" + ticks.length + ") >= 512, may cause performance issues, even out of memory. Because of the configure \"tickInterval\"(in milliseconds, current is " + tickInterval + ") is too small, increase the value to solve the problem!");
    }
    return ticks;
}
exports.default = timePretty;
//# sourceMappingURL=time-pretty.js.map
}, function(modId) { var map = {"../util/time":1612663742082}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1612663742077);
})()
//# sourceMappingURL=index.js.map