"use strict";
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
        this.nextPosition = [];
        this.step = 0;
        this.currentPos = [];
    }
    Maze.prototype.solve = function () {
        this.step++;
        for (var _i = 0, _a = this.currentPos; _i < _a.length; _i++) {
            var pos = _a[_i];
            if (pos === this.mazeStart) {
                this.mazeWithPosition[pos].step = 0;
            }
            var XandY = pos.split(":").map(function (val) { return parseInt(val, 10); });
            var X = XandY[0];
            var Y = XandY[1];
            this.changeStep(X, Y);
        }
        this.currentPos = this.nextPosition;
    };
    Maze.prototype.changeStep = function (X, Y) {
        this.stepPosition((X + 1) + ":" + Y, this.mazeWithPosition[X + ":" + Y].step + 1);
        this.stepPosition((X - 1) + ":" + Y, this.mazeWithPosition[X + ":" + Y].step + 1);
        this.stepPosition(X + ":" + (Y + 1), this.mazeWithPosition[X + ":" + Y].step + 1);
        this.stepPosition(X + ":" + (Y - 1), this.mazeWithPosition[X + ":" + Y].step + 1);
    };
    Maze.prototype.stepPosition = function (pos, step) {
        if (!this.mazeWithPosition[pos]) {
            return;
        }
        if (this.mazeWithPosition[pos].path == ' ') {
            if (this.mazeWithPosition[pos].step >= 0) {
                return;
            }
            this.mazeWithPosition[pos].step = step;
            this.nextPosition.push(pos);
        }
        if (this.mazeWithPosition[pos].path == '2') {
            this.mazeWithPosition[pos].step = step;
            console.log(step);
            this.isSolved = true;
        }
    };
    return Maze;
}());
function solveMaze() {
    console.time('Solved in');
    var maze = myMaze(process.argv[2]);
    maze.currentPos.push(maze.mazeStart);
    while (maze.isSolved != true) {
        maze.solve();
    }
    console.timeEnd('Solved in');
}
function myMaze(mazePath) {
    //Import du labyrinthe
    var mazeRaw = fs_1.readFileSync('data/maps/' + mazePath + '.map', 'utf8');
    //Split tout les ligne
    var mazeLine = mazeRaw.split('\n');
    var maze = new Maze();
    //Taille du labyrinthe
    maze.mazeSize = mazeLine[0].split("x");
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
