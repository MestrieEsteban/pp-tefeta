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
	count:number=0

	solve(){
		this.step++
		for (let pos of this.currentPos) {
			if (pos === this.mazeStart) {
				this.count++
				this.mazeWithPosition[pos].step = 0;
				// for(let test in this.mazeWithPosition)
				// {
				// 	if(this.mazeWithPosition[test].isPath == 'yes'){
				// 		this.mazeWithPosition[test].isPath = 'no'
				// 	}
					
				// }
			}
			let XandY = pos.split(":");
			let X = parseInt(XandY[0], 10)
			let Y = parseInt(XandY[1], 10)
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
			this.mazeWithPosition[pos].isPath = 'yes';
			this.nextPosition.push(pos);
		}
		if(this.mazeWithPosition[pos].path == '2')
		{
			this.mazeWithPosition[pos].step = step;
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
	console.log(maze.mazeWithPosition)
	console.timeEnd('Solved in')
}



function myMaze(mazePath: string) {
	let mazeRaw = readFileSync('data/maps/' + mazePath + '.map', 'utf8');
	let mazeLine = mazeRaw.split('\n');

	let maze = new Maze();

	maze.mazeSize = mazeLine[0].split("x")

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
				isPath:'no'
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

