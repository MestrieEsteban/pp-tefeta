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
        this.etp = 0;
        this.currentPos = [];
        this.count = 0;
    }
    Maze.prototype.solve = function () {
        this.etp++;
        for (var _i = 0, _a = this.currentPos; _i < _a.length; _i++) {
            var pos = _a[_i];
            if (pos === this.mazeStart) {
                this.count++;
                this.mazeWithPosition[pos].etp = 0;
                // for(let test in this.mazeWithPosition)
                // {
                // 	if(this.mazeWithPosition[test].isPath == 'yes'){
                // 		this.mazeWithPosition[test].isPath = 'no'
                // 	}
                // }
            }
            var XandY = pos.split(":");
            var X = parseInt(XandY[0], 10);
            var Y = parseInt(XandY[1], 10);
            this.changeStep(X, Y);
        }
        this.currentPos = this.nextPosition;
    };
    Maze.prototype.changeStep = function (X, Y) {
        this.position((X + 1) + ":" + Y, this.mazeWithPosition[X + ":" + Y].etp + 1);
        this.position((X - 1) + ":" + Y, this.mazeWithPosition[X + ":" + Y].etp + 1);
        this.position(X + ":" + (Y + 1), this.mazeWithPosition[X + ":" + Y].etp + 1);
        this.position(X + ":" + (Y - 1), this.mazeWithPosition[X + ":" + Y].etp + 1);
    };
    Maze.prototype.position = function (pos, etp) {
        if (!this.mazeWithPosition[pos]) {
            return;
        }
        if (this.mazeWithPosition[pos].path == ' ') {
            if (this.mazeWithPosition[pos].etp >= 0) {
                return;
            }
            this.mazeWithPosition[pos].etp = etp;
            this.mazeWithPosition[pos].isPath = '.';
            this.nextPosition.push(pos);
        }
        if (this.mazeWithPosition[pos].path == '2') {
            this.mazeWithPosition[pos].etp = etp;
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
    save(maze);
    console.timeEnd('Solved in');
}
function save(maze) {
    var oldY = 0;
    for (var obj in maze.mazeWithPosition) {
        var XandY = obj.split(":");
        var X = parseInt(XandY[0], 10);
        var Y = parseInt(XandY[1], 10);
        if (Y > oldY) {
            maze.mazeSaveArray = maze.mazeSaveArray + '\n';
        }
        if (maze.mazeWithPosition[obj]['etp']) {
            maze.mazeSaveArray = maze.mazeSaveArray + maze.mazeWithPosition[obj]['isPath'];
        }
        else {
            maze.mazeSaveArray = maze.mazeSaveArray + maze.mazeWithPosition[obj]['path'];
        }
        oldY = Y;
    }
    console.log(maze.mazeSaveArray);
}
function myMaze(mazePath) {
    var mazeRaw = fs_1.readFileSync('data/maps/' + mazePath + '.map', 'utf8');
    var mazeLine = mazeRaw.split('\n');
    var maze = new Maze();
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
                path: value,
                isPath: '2'
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
