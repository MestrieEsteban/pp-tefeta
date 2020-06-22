"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var fs_1 = require("fs");
var Maze = /** @class */ (function () {
    function Maze() {
        //Top 	= y -1
        //Bot 	= y +1
        //left 	= x -1
        //Right = x +1
        this.mazeWithPosition = {};
        this.lastPos = 'Bot';
        this.isSolved = false;
        this.nextNode = [];
        this.step = 0;
        this.currentPos = [];
    }
    Maze.prototype.getSize = function () {
        return this.mazeSize.split(":").map(function (val) { return parseInt(val, 10); });
    };
    Maze.prototype.solve = function () {
        this.step++;
        for (var _i = 0, _a = this.currentPos; _i < _a.length; _i++) {
            var coord = _a[_i];
            if (coord === this.mazeStart) {
                this.mazeWithPosition[coord].step = 0;
            }
            var intCoord = coord.split(":").map(function (val) { return parseInt(val, 10); });
            console.log(intCoord);
            this.updateStep((intCoord[0] + 1) + ":" + intCoord[1], this.mazeWithPosition[coord].step + 1);
            this.updateStep((intCoord[0] - 1) + ":" + intCoord[1], this.mazeWithPosition[coord].step + 1);
            this.updateStep(intCoord[0] + ":" + (intCoord[1] + 1), this.mazeWithPosition[coord].step + 1);
            this.updateStep(intCoord[0] + ":" + (intCoord[1] - 1), this.mazeWithPosition[coord].step + 1);
        }
        this.currentPos = this.nextNode;
        this.nextNode = [];
    };
    Maze.prototype.updateStep = function (coord, step) {
        if (!this.mazeWithPosition[coord]) {
            return;
        }
        switch (this.mazeWithPosition[coord].path) {
            case " ":
                if (this.mazeWithPosition[coord].step >= 0) {
                    return;
                }
                this.mazeWithPosition[coord].step = step;
                this.nextNode.push(coord);
                break;
            case "2":
                this.mazeWithPosition[coord].step = step;
                this.nextNode.push(coord);
                this.mazeEnd = coord;
                this.isSolved = true;
                break;
            default:
                break;
        }
    };
    Maze.prototype.drawPath = function () {
        var step = this.mazeWithPosition[this.mazeEnd].step;
        var prevCoord = this.mazeEnd;
        for (var i = step; i > 0; i--) {
            var currentCoord = prevCoord;
            var intCoord = currentCoord.split(";").map(function (val) { return parseInt(val, 10); });
            prevCoord = this.isLowerStep((intCoord[0] + 1) + ";" + intCoord[1], i) ? prevCoord = (intCoord[0] + 1) + ";" + intCoord[1] : prevCoord;
            prevCoord = this.isLowerStep((intCoord[0] - 1) + ";" + intCoord[1], i) ? prevCoord = (intCoord[0] - 1) + ";" + intCoord[1] : prevCoord;
            prevCoord = this.isLowerStep(intCoord[0] + ";" + (intCoord[1] + 1), i) ? prevCoord = intCoord[0] + ";" + (intCoord[1] + 1) : prevCoord;
            prevCoord = this.isLowerStep(intCoord[0] + ";" + (intCoord[1] - 1), i) ? prevCoord = intCoord[0] + ";" + (intCoord[1] - 1) : prevCoord;
            this.mazeWithPosition[prevCoord].isResult = true;
        }
    };
    Maze.prototype.isLowerStep = function (coord, step) {
        if (this.mazeWithPosition[coord] && this.mazeWithPosition[coord].step && this.mazeWithPosition[coord].step > -1 && this.mazeWithPosition[coord].step < step) {
            return true;
        }
        else {
            return false;
        }
    };
    return Maze;
}());
function printMap(map, info) {
    if (info === void 0) { info = false; }
    var intSize = map.getSize();
    var rawRes = new Array(intSize[1]).fill("").map(function () { return Array(intSize[0]).fill(""); });
    for (var coord in map.mazeWithPosition) {
        var intCoord = coord.split(";").map(function (val) { return parseInt(val, 10); });
        if (map.mazeWithPosition[coord].isResult && coord !== map.mazeStart && coord !== map.mazeEnd[0]) {
            rawRes[intCoord[1]][intCoord[0]] = ".";
        }
        else {
            if (info && map.mazeWithPosition[coord].step >= 0 && coord !== map.mazeStart && coord !== map.mazeEnd[0]) {
                rawRes[intCoord[1]][intCoord[0]] = "+";
            }
            else {
                rawRes[intCoord[1]][intCoord[0]] = map.mazeWithPosition[coord].value;
            }
        }
    }
    var result = rawRes.map(function (line) { return line.join(""); }).join("\n");
    if (info) {
        var infoRes = __assign(__assign({}, map), { table: null });
        // const infoRes = { ...map }
        console.log(infoRes);
    }
    console.log(result);
}
function solveMaze() {
    console.time('Solved in');
    var maze = myMaze(process.argv[2]);
    maze.currentPos.push(maze.mazeStart);
    console.log(maze.currentPos);
    while (maze.isSolved != true) {
        maze.solve();
    }
    if (maze.isSolved == true) {
        maze.drawPath();
    }
    else {
        console.log("solution not found");
    }
    printMap(maze, false);
    console.timeEnd('Solved in');
}
function myMaze(mazePath) {
    //Import du labyrinthe
    var mazeRaw = fs_1.readFileSync('data/maps/' + mazePath + '.map', 'utf8');
    //Split tout les ligne
    var mazeLine = mazeRaw.split('\n');
    var maze = new Maze();
    //Taille du labyrinthe
    if (mazeLine[0][0] !== "*") {
        maze.mazeSize = mazeLine.shift();
    }
    else {
        maze.mazeSize = mazeLine[0].length + "x" + mazeLine.length;
    }
    //Permet de donnée des position a différent case du labyrinthe
    var y = -1;
    for (var _i = 0, mazeLine_1 = mazeLine; _i < mazeLine_1.length; _i++) {
        var line = mazeLine_1[_i];
        var x = -1;
        y++;
        if (!line) {
            break;
        }
        for (var _a = 0, _b = line.split(''); _a < _b.length; _a++) {
            var value = _b[_a];
            x++;
            var position = x + ":" + y;
            maze.mazeWithPosition[position] = {
                path: value
            };
            if (value == "1") {
                maze.mazeStart = position;
            }
            if (value == "2") {
                maze.mazeEnd = position;
            }
        }
    }
    return maze;
}
solveMaze();
