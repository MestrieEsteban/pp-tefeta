import { readFileSync } from "fs";
import { mainModule } from "process";

class Maze {
    mazeSize:       	Array<string>;
    mazeWithPosition:   object = {};
    mazeStart:      	string;
	mazeEnd:        	string;


}

function solveMaze(){
	console.time('Temps')

	const maze = myMaze(process.argv[2]);
	console.timeEnd('Temps')
	console.log(maze)
}
function myMaze(mazePath: string) {
    let mazeRaw = readFileSync(mazePath, 'utf8');
    let mazeLine = mazeRaw.split('\n');

    let maze = new Maze();
    
    maze.mazeSize = mazeLine[0].split("x")
    
    let y:number = -1;
	for (let line of mazeLine) {
		let x:number = -1;
		y++;
		if (!line) { break; }
		for (let value of line.split('')) {
			x++
			let position = `${x}:${y}`;
			maze.mazeWithPosition[position] = {
				path: value,
			}
			if(value == "1"){
				maze.mazeStart = position;
			}
			if(value == "2"){
				maze.mazeEnd = position;
			}			
		}
	}

	return maze
}

solveMaze()

