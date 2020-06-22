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
	nextPosition: string[] = [];
	step: number = 0;
	currentPos: string[] = [];

	solve(){
		this.step++
		for (let pos of this.currentPos) {
			if (pos === this.mazeStart) {
				this.mazeWithPosition[pos].step = 0;
			}
			let XandY = pos.split(":").map((val) => { return parseInt(val, 10) });
			let X = XandY[0]
			let Y = XandY[1]
			this.changeStep(X,Y)
		}
		this.currentPos = this.nextPosition;
	}

	private changeStep(X:number, Y:number)
	{
		this.stepPosition((X + 1) + ":" + Y, this.mazeWithPosition[`${X}:${Y}`].step + 1);
		this.stepPosition((X - 1) + ":" + Y, this.mazeWithPosition[`${X}:${Y}`].step + 1);
		this.stepPosition(X + ":" + (Y + 1), this.mazeWithPosition[`${X}:${Y}`].step + 1);
		this.stepPosition(X + ":" + (Y - 1), this.mazeWithPosition[`${X}:${Y}`].step + 1);
	}

	private stepPosition(pos: string, step: number) {

		if (!this.mazeWithPosition[pos]) { return; }

		if(this.mazeWithPosition[pos].path == ' ')
		{
			if (this.mazeWithPosition[pos].step >= 0) { return; }
			this.mazeWithPosition[pos].step = step;
			this.nextPosition.push(pos);
		}
		if(this.mazeWithPosition[pos].path == '2')
		{
			this.mazeWithPosition[pos].step = step;
			console.log(step)
			this.isSolved = true;
		}
	}

}

function solveMaze() {
	console.time('Solved in')

	const maze = myMaze(process.argv[2]);
	
	maze.currentPos.push(maze.mazeStart);
	
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

