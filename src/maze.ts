import { readFileSync } from "fs";

class Maze {
	//Top 	= y -1
	//Bot 	= y +1
	//left 	= x -1
	//Right = x +1

	mazeSize: Array<string>;
	mazeWithPosition: object = {};
	mazeStart: string;
	mazeEnd: string;
	lastPos: string = 'Bot';
	isSolved: boolean = false;
	nextNode: string[] = [];
	step: number = 0;
	currentPos: string[] = [];




	solve(){
		this.step++
		for (let coord of this.currentPos) {
			if (coord === this.mazeStart) {
				this.mazeWithPosition[coord].step = 0;
			}
			let intCoord = coord.split(":").map((val) => { return parseInt(val, 10) });
			console.log(intCoord)
			
			this.updateStep((intCoord[0] + 1) + ":" + intCoord[1], this.mazeWithPosition[coord].step + 1);
			this.updateStep((intCoord[0] - 1) + ":" + intCoord[1], this.mazeWithPosition[coord].step + 1);
			this.updateStep(intCoord[0] + ":" + (intCoord[1] + 1), this.mazeWithPosition[coord].step + 1);
			this.updateStep(intCoord[0] + ":" + (intCoord[1] - 1), this.mazeWithPosition[coord].step + 1);
		}

		this.currentPos = this.nextNode;
		this.nextNode = [];
	}

	private updateStep(coord: string, step: number) {
		if (!this.mazeWithPosition[coord]) { return; }
		switch (this.mazeWithPosition[coord].path) {
			case " ":
				if (this.mazeWithPosition[coord].step >= 0) { return; }
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
	}

}

function solveMaze() {
	console.time('Solved in')

	const maze = myMaze(process.argv[2]);
	
	maze.currentPos.push(maze.mazeStart);
	
	console.log(maze.currentPos)
	while (maze.isSolved != true) {
		maze.solve()
	}
	console.timeEnd('Solved in')
}



function myMaze(mazePath: string) {
	//Import du labyrinthe
	let mazeRaw = readFileSync('data/maps/' + mazePath + '.map', 'utf8');
	//Split tout les ligne
	let mazeLine = mazeRaw.split('\n');

	let maze = new Maze();

	//Taille du labyrinthe
	maze.mazeSize = mazeLine[0].split("x")

	//Permet de donnée des position a différent case du labyrinthe
	let y: number = -1;
	for (let line of mazeLine) {
		let x: number = -1;
		y++;
		if (!line) { break; }
		for (let value of line.split('')) {
			x++
			let position = `${x}:${y}`;
			maze.mazeWithPosition[position] = {
				path: value,
			}
			if (value == "1") {
				maze.mazeStart = position;
			}
			if (value == "2") {
				maze.mazeEnd = position;
			}
		}
	}

	return maze
}

solveMaze()

