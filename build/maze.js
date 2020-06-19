"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Maze = /** @class */ (function () {
    function Maze() {
        this.mazeWithPosition = {};
    }
    return Maze;
}());
function solveMaze() {
    console.time('Temps');
    var maze = myMaze(process.argv[2]);
    console.timeEnd('Temps');
    console.log(maze);
}
function myMaze(mazePath) {
    var mazeRaw = fs_1.readFileSync(mazePath, 'utf8');
    var mazeLine = mazeRaw.split('\n');
    var maze = new Maze();
    maze.mazeSize = mazeLine[0].split("x");
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
