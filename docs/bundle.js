/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Target_1 = __webpack_require__(/*! ./Target */ "./src/Target.ts");
var config_json_1 = __importDefault(__webpack_require__(/*! ./config.json */ "./src/config.json"));
var Game = /** @class */ (function () {
    function Game(canvas) {
        var _this = this;
        this.targets = {};
        this.timer = 0;
        this.spawnTimer = config_json_1.default.spawnDelayMax;
        this.spawnDelay = config_json_1.default.spawnDelayMax;
        this.targetLiveTime = config_json_1.default.liveTimeMax;
        this.lastId = 0;
        this.level = 1;
        this.hit = 0;
        this.miss = 0;
        if (!canvas) {
            throw new Error("Please provide correct canvas element");
        }
        this.canvas = canvas;
        this.canvas.width = config_json_1.default.canvas.width;
        this.canvas.height = config_json_1.default.canvas.height;
        this.canvas.style.background = config_json_1.default.canvas.background;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Can't create canvas 2d context");
        }
        this.ctx = ctx;
        canvas.addEventListener("click", function (event) {
            _this.mousePosition = {
                x: event.offsetX,
                y: event.offsetY
            };
        });
    }
    Game.prototype.update = function (deltaTime) {
        // update timers
        this.timer += deltaTime;
        this.spawnTimer += deltaTime;
        // check level time
        if (this.timer > config_json_1.default.levelTime * this.level) {
            this.level += 1;
            var newLiveTime = this.targetLiveTime - config_json_1.default.liveTimeStep;
            this.targetLiveTime = Math.max(newLiveTime, config_json_1.default.liveTimeMin);
            var newSpawnDeley = this.spawnDelay - config_json_1.default.spawnDelayStep;
            this.spawnDelay = Math.max(newSpawnDeley, config_json_1.default.spawnDelayMin);
        }
        // update gameobjects
        for (var key in this.targets) {
            var target = this.targets[key];
            target.update(deltaTime);
            // Check colision
            if (this.mousePosition) {
                var isHit = this.ctx.isPointInPath(target.path, this.mousePosition.x, this.mousePosition.y);
                if (isHit) {
                    this.hit += 1;
                    delete this.targets[key];
                }
            }
            if (target.isDead) {
                this.miss += 1;
                delete this.targets[key];
            }
        }
        // spawn new gameobjects
        if (this.targetsCount() < config_json_1.default.targetMax) {
            if (this.spawnTimer > this.spawnDelay || this.targetsCount() < 1) {
                this.lastId += 1;
                this.targets[this.lastId] = new Target_1.Target(this.lastId, this.getRandomPosition(), this.targetLiveTime);
                this.spawnTimer = 0;
            }
        }
        // reset user input
        this.mousePosition = undefined;
    };
    Game.prototype.render = function (deltaTime) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var key in this.targets) {
            var target = this.targets[key];
            target.render(this.ctx, deltaTime);
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeText("Level: " + this.level + ", Hit: " + this.hit + ", Miss: " + this.miss, 20, 20);
        this.ctx.strokeText("TargetLiveTime: " + this.targetLiveTime + ", TargetSpawnDelay: " + this.spawnDelay, 20, 40);
    };
    Game.prototype.targetsCount = function () {
        return Object.keys(this.targets).length;
    };
    Game.prototype.getRandomPosition = function () {
        var radius = config_json_1.default.target.radiusMax;
        var x = Math.floor(Math.random() * this.canvas.width);
        var y = Math.floor(Math.random() * this.canvas.height);
        return {
            x: this.restrictPosition(x, radius, this.canvas.width - radius),
            y: this.restrictPosition(y, radius, this.canvas.height - radius)
        };
    };
    Game.prototype.restrictPosition = function (num, min, max) {
        num = Math.max(min, num);
        num = Math.min(max, num);
        return num;
    };
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/Target.ts":
/*!***********************!*\
  !*** ./src/Target.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = __importDefault(__webpack_require__(/*! ./config.json */ "./src/config.json"));
var Target = /** @class */ (function () {
    function Target(id, pos, liveTime) {
        this.id = id;
        this.pos = pos;
        this.liveTime = liveTime;
        this.isDead = false;
        this.radius = config_json_1.default.target.radiusMax;
        this.path = this.drawPath(pos, this.radius);
        this.shrinkSpeed =
            (config_json_1.default.target.radiusMax - config_json_1.default.target.radiusMin) / liveTime;
    }
    Target.prototype.update = function (deltaTime) {
        if (!this.isDead) {
            this.liveTime -= deltaTime;
            this.radius -= this.shrinkSpeed * deltaTime;
            this.path = this.drawPath(this.pos, this.radius);
            if (this.liveTime < 0) {
                this.setDead();
            }
        }
    };
    Target.prototype.render = function (ctx, deltaTime) {
        ctx.fillStyle = config_json_1.default.target.fillStyle;
        ctx.strokeStyle = config_json_1.default.target.strokeStyle;
        ctx.lineWidth = config_json_1.default.target.lineWidth;
        ctx.fill(this.path);
        ctx.stroke(this.path);
    };
    Target.prototype.drawPath = function (pos, radius) {
        var path = new Path2D();
        path.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
        return path;
    };
    Target.prototype.setDead = function () {
        this.isDead = true;
    };
    return Target;
}());
exports.Target = Target;


/***/ }),

/***/ "./src/config.json":
/*!*************************!*\
  !*** ./src/config.json ***!
  \*************************/
/*! exports provided: canvas, targetMax, spawnDelayMax, spawnDelayMin, spawnDelayStep, liveTimeMin, liveTimeMax, liveTimeStep, levelTime, target, default */
/***/ (function(module) {

module.exports = {"canvas":{"width":640,"height":480,"background":"rgba(138, 136, 136, 0.78)"},"targetMax":10,"spawnDelayMax":1000,"spawnDelayMin":500,"spawnDelayStep":100,"liveTimeMin":1000,"liveTimeMax":5000,"liveTimeStep":200,"levelTime":5000,"target":{"strokeStyle":"green","fillStyle":"white","lineWidth":5,"radiusMax":30,"radiusMin":5}};

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ./Game */ "./src/Game.ts");
var canvas = document.getElementById("game");
if (!canvas) {
    throw new Error("Cant find canvas element");
}
var game = new Game_1.Game(canvas);
var timer = Date.now();
setInterval(function () {
    var now = Date.now();
    var delta = now - timer;
    timer = now;
    game.update(delta);
    game.render(delta);
}, 35);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1RhcmdldC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakZBLHNFQUFrQztBQUNsQyxtR0FBbUM7QUFFbkM7SUFjRSxjQUFZLE1BQXlCO1FBQXJDLGlCQXFCQztRQWhDTyxZQUFPLEdBQTZCLEVBQUUsQ0FBQztRQUV2QyxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLGVBQVUsR0FBVyxxQkFBTSxDQUFDLGFBQWEsQ0FBQztRQUMxQyxlQUFVLEdBQVcscUJBQU0sQ0FBQyxhQUFhLENBQUM7UUFDMUMsbUJBQWMsR0FBVyxxQkFBTSxDQUFDLFdBQVcsQ0FBQztRQUM1QyxXQUFNLEdBQVcs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Q0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFdkIsV0FBVyxDQUFDO0lBQ1YsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7SUFDMUIsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBQb3NpdGlvbiB9IGZyb20gXCIuL0lHYW1lT2JqZWN0XCI7XHJcbmltcG9ydCB7IFRhcmdldCB9IGZyb20gXCIuL1RhcmdldFwiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuL2NvbmZpZy5qc29uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgcHJpdmF0ZSB0YXJnZXRzOiB7IFtpZDogbnVtYmVyXTogVGFyZ2V0IH0gPSB7fTtcclxuICBwcml2YXRlIG1vdXNlUG9zaXRpb24/OiBQb3NpdGlvbjtcclxuICBwcml2YXRlIHRpbWVyOiBudW1iZXIgPSAwO1xyXG4gIHByaXZhdGUgc3Bhd25UaW1lcjogbnVtYmVyID0gY29uZmlnLnNwYXduRGVsYXlNYXg7XHJcbiAgcHJpdmF0ZSBzcGF3bkRlbGF5OiBudW1iZXIgPSBjb25maWcuc3Bhd25EZWxheU1heDtcclxuICBwcml2YXRlIHRhcmdldExpdmVUaW1lOiBudW1iZXIgPSBjb25maWcubGl2ZVRpbWVNYXg7XHJcbiAgcHJpdmF0ZSBsYXN0SWQ6IG51bWJlciA9IDA7XHJcbiAgcHJpdmF0ZSBsZXZlbDogbnVtYmVyID0gMTtcclxuICBwcml2YXRlIGhpdDogbnVtYmVyID0gMDtcclxuICBwcml2YXRlIG1pc3M6IG51bWJlciA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgIGlmICghY2FudmFzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBwcm92aWRlIGNvcnJlY3QgY2FudmFzIGVsZW1lbnRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IGNvbmZpZy5jYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBjb25maWcuY2FudmFzLmhlaWdodDtcclxuICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmQgPSBjb25maWcuY2FudmFzLmJhY2tncm91bmQ7XHJcblxyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIGlmICghY3R4KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBjYW52YXMgMmQgY29udGV4dFwiKTtcclxuICAgIH1cclxuICAgIHRoaXMuY3R4ID0gY3R4O1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XHJcbiAgICAgIHRoaXMubW91c2VQb3NpdGlvbiA9IHtcclxuICAgICAgICB4OiBldmVudC5vZmZzZXRYLFxyXG4gICAgICAgIHk6IGV2ZW50Lm9mZnNldFlcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcbiAgICAvLyB1cGRhdGUgdGltZXJzXHJcbiAgICB0aGlzLnRpbWVyICs9IGRlbHRhVGltZTtcclxuICAgIHRoaXMuc3Bhd25UaW1lciArPSBkZWx0YVRpbWU7XHJcbiAgICAvLyBjaGVjayBsZXZlbCB0aW1lXHJcbiAgICBpZiAodGhpcy50aW1lciA+IGNvbmZpZy5sZXZlbFRpbWUgKiB0aGlzLmxldmVsKSB7XHJcbiAgICAgIHRoaXMubGV2ZWwgKz0gMTtcclxuICAgICAgY29uc3QgbmV3TGl2ZVRpbWUgPSB0aGlzLnRhcmdldExpdmVUaW1lIC0gY29uZmlnLmxpdmVUaW1lU3RlcDtcclxuICAgICAgdGhpcy50YXJnZXRMaXZlVGltZSA9IE1hdGgubWF4KG5ld0xpdmVUaW1lLCBjb25maWcubGl2ZVRpbWVNaW4pO1xyXG4gICAgICBjb25zdCBuZXdTcGF3bkRlbGV5ID0gdGhpcy5zcGF3bkRlbGF5IC0gY29uZmlnLnNwYXduRGVsYXlTdGVwO1xyXG4gICAgICB0aGlzLnNwYXduRGVsYXkgPSBNYXRoLm1heChuZXdTcGF3bkRlbGV5LCBjb25maWcuc3Bhd25EZWxheU1pbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGdhbWVvYmplY3RzXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnRhcmdldHMpIHtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXRzW2tleV07XHJcbiAgICAgIHRhcmdldC51cGRhdGUoZGVsdGFUaW1lKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGNvbGlzaW9uXHJcbiAgICAgIGlmICh0aGlzLm1vdXNlUG9zaXRpb24pIHtcclxuICAgICAgICBjb25zdCBpc0hpdCA9IHRoaXMuY3R4LmlzUG9pbnRJblBhdGgoXHJcbiAgICAgICAgICB0YXJnZXQucGF0aCxcclxuICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbi54LFxyXG4gICAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uLnlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoaXNIaXQpIHtcclxuICAgICAgICAgIHRoaXMuaGl0ICs9IDE7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy50YXJnZXRzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGFyZ2V0LmlzRGVhZCkge1xyXG4gICAgICAgIHRoaXMubWlzcyArPSAxO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnRhcmdldHNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNwYXduIG5ldyBnYW1lb2JqZWN0c1xyXG4gICAgaWYgKHRoaXMudGFyZ2V0c0NvdW50KCkgPCBjb25maWcudGFyZ2V0TWF4KSB7XHJcbiAgICAgIGlmICh0aGlzLnNwYXduVGltZXIgPiB0aGlzLnNwYXduRGVsYXkgfHwgdGhpcy50YXJnZXRzQ291bnQoKSA8IDEpIHtcclxuICAgICAgICB0aGlzLmxhc3RJZCArPSAxO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0c1t0aGlzLmxhc3RJZF0gPSBuZXcgVGFyZ2V0KFxyXG4gICAgICAgICAgdGhpcy5sYXN0SWQsXHJcbiAgICAgICAgICB0aGlzLmdldFJhbmRvbVBvc2l0aW9uKCksXHJcbiAgICAgICAgICB0aGlzLnRhcmdldExpdmVUaW1lXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnNwYXduVGltZXIgPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyByZXNldCB1c2VyIGlucHV0XHJcbiAgICB0aGlzLm1vdXNlUG9zaXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoZGVsdGFUaW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMudGFyZ2V0cykge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnRhcmdldHNba2V5XTtcclxuICAgICAgdGFyZ2V0LnJlbmRlcih0aGlzLmN0eCwgZGVsdGFUaW1lKTtcclxuICAgIH1cclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIHRoaXMuY3R4LnN0cm9rZVRleHQoXHJcbiAgICAgIGBMZXZlbDogJHt0aGlzLmxldmVsfSwgSGl0OiAke3RoaXMuaGl0fSwgTWlzczogJHt0aGlzLm1pc3N9YCxcclxuICAgICAgMjAsXHJcbiAgICAgIDIwXHJcbiAgICApO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlVGV4dChcclxuICAgICAgYFRhcmdldExpdmVUaW1lOiAke3RoaXMudGFyZ2V0TGl2ZVRpbWV9LCBUYXJnZXRTcGF3bkRlbGF5OiAke1xyXG4gICAgICAgIHRoaXMuc3Bhd25EZWxheVxyXG4gICAgICB9YCxcclxuICAgICAgMjAsXHJcbiAgICAgIDQwXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgdGFyZ2V0c0NvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy50YXJnZXRzKS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRSYW5kb21Qb3NpdGlvbigpOiBQb3NpdGlvbiB7XHJcbiAgICBjb25zdCByYWRpdXMgPSBjb25maWcudGFyZ2V0LnJhZGl1c01heDtcclxuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCk7XHJcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiB0aGlzLnJlc3RyaWN0UG9zaXRpb24oeCwgcmFkaXVzLCB0aGlzLmNhbnZhcy53aWR0aCAtIHJhZGl1cyksXHJcbiAgICAgIHk6IHRoaXMucmVzdHJpY3RQb3NpdGlvbih5LCByYWRpdXMsIHRoaXMuY2FudmFzLmhlaWdodCAtIHJhZGl1cylcclxuICAgIH07XHJcbiAgfVxyXG4gIHJlc3RyaWN0UG9zaXRpb24obnVtOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBudW0gPSBNYXRoLm1heChtaW4sIG51bSk7XHJcbiAgICBudW0gPSBNYXRoLm1pbihtYXgsIG51bSk7XHJcbiAgICByZXR1cm4gbnVtO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJR2FtZU9iamVjdCwgUG9zaXRpb24gfSBmcm9tIFwiLi9JR2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuL2NvbmZpZy5qc29uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFyZ2V0IGltcGxlbWVudHMgSUdhbWVPYmplY3Qge1xyXG4gIHB1YmxpYyBpc0RlYWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIHJhZGl1czogbnVtYmVyO1xyXG4gIHByaXZhdGUgc2hyaW5rU3BlZWQ6IG51bWJlcjtcclxuICBwdWJsaWMgcGF0aDogUGF0aDJEO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBpZDogbnVtYmVyLFxyXG4gICAgcHVibGljIHBvczogUG9zaXRpb24sXHJcbiAgICBwdWJsaWMgbGl2ZVRpbWU6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5yYWRpdXMgPSBjb25maWcudGFyZ2V0LnJhZGl1c01heDtcclxuICAgIHRoaXMucGF0aCA9IHRoaXMuZHJhd1BhdGgocG9zLCB0aGlzLnJhZGl1cyk7XHJcbiAgICB0aGlzLnNocmlua1NwZWVkID1cclxuICAgICAgKGNvbmZpZy50YXJnZXQucmFkaXVzTWF4IC0gY29uZmlnLnRhcmdldC5yYWRpdXNNaW4pIC8gbGl2ZVRpbWU7XHJcbiAgfVxyXG4gIHVwZGF0ZShkZWx0YVRpbWU6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLmlzRGVhZCkge1xyXG4gICAgICB0aGlzLmxpdmVUaW1lIC09IGRlbHRhVGltZTtcclxuICAgICAgdGhpcy5yYWRpdXMgLT0gdGhpcy5zaHJpbmtTcGVlZCAqIGRlbHRhVGltZTtcclxuICAgICAgdGhpcy5wYXRoID0gdGhpcy5kcmF3UGF0aCh0aGlzLnBvcywgdGhpcy5yYWRpdXMpO1xyXG4gICAgICBpZiAodGhpcy5saXZlVGltZSA8IDApIHtcclxuICAgICAgICB0aGlzLnNldERlYWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZW5kZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGRlbHRhVGltZTogbnVtYmVyKSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLnRhcmdldC5maWxsU3R5bGU7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcudGFyZ2V0LnN0cm9rZVN0eWxlO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy50YXJnZXQubGluZVdpZHRoO1xyXG5cclxuICAgIGN0eC5maWxsKHRoaXMucGF0aCk7XHJcbiAgICBjdHguc3Ryb2tlKHRoaXMucGF0aCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdQYXRoKHBvczogUG9zaXRpb24sIHJhZGl1czogbnVtYmVyKTogUGF0aDJEIHtcclxuICAgIGNvbnN0IHBhdGggPSBuZXcgUGF0aDJEKCk7XHJcbiAgICBwYXRoLmFyYyhwb3MueCwgcG9zLnksIHJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgIHJldHVybiBwYXRoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXREZWFkKCkge1xyXG4gICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vR2FtZVwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuaWYgKCFjYW52YXMpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoXCJDYW50IGZpbmQgY2FudmFzIGVsZW1lbnRcIik7XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZShjYW52YXMpO1xyXG5sZXQgdGltZXIgPSBEYXRlLm5vdygpO1xyXG5cclxuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgZGVsdGEgPSBub3cgLSB0aW1lcjtcclxuICB0aW1lciA9IG5vdztcclxuICBnYW1lLnVwZGF0ZShkZWx0YSk7XHJcbiAgZ2FtZS5yZW5kZXIoZGVsdGEpO1xyXG59LCAzNSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=