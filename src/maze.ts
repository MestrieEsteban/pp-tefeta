import { readFileSync } from "fs";

class Maze {
	//Top 	= y -1
	//Bot 	= y +1
	//left 	= x -1
	//Right = x +1

	mazeWithPosition: object = {};
	mazeStart: string;
	mazeEnd: string;
	lastPos: string = 'Bot';
	isSolved: boolean = false;
	nextPosition: string[] = [];
	etp: number = 0;
	currentPos: string[] = [];
	count:number=0
	mazeSaveArray:string;

	solve(){
		this.etp++
		for (let pos of this.currentPos) {
			if (pos === this.mazeStart) {
				this.count++
				this.mazeWithPosition[pos].etp = 0;
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
		this.position((X + 1) + ":" + Y, this.mazeWithPosition[`${X}:${Y}`].etp + 1);
		this.position((X - 1) + ":" + Y, this.mazeWithPosition[`${X}:${Y}`].etp + 1);
		this.position(X + ":" + (Y + 1), this.mazeWithPosition[`${X}:${Y}`].etp + 1);
		this.position(X + ":" + (Y - 1), this.mazeWithPosition[`${X}:${Y}`].etp + 1);
	}

	private position(pos: string, etp: number) {

		if (!this.mazeWithPosition[pos]) { return; }
		if(this.mazeWithPosition[pos].path == ' ')
		{
			if (this.mazeWithPosition[pos].etp >= 0) { return; }
			this.mazeWithPosition[pos].etp = etp;
			this.mazeWithPosition[pos].isPath = '.';
			this.nextPosition.push(pos);
		}
		if(this.mazeWithPosition[pos].path == '2')
		{
			this.mazeWithPosition[pos].etp = etp;
			this.isSolved = true;
		}
	}


}

function solveMaze(): void {
	console.time('Solved in')

	const maze = myMaze(process.argv[2]);
	
	maze.currentPos.push(maze.mazeStart);
	
	while (maze.isSolved != true) {
		maze.solve()
	}
	save(maze)
	console.timeEnd('Solved in')
}

function save(maze:Maze){
	let oldY= 0
	for(let obj in maze.mazeWithPosition)
		{
			let XandY = obj.split(":");
			let X = parseInt(XandY[0], 10)
			let Y = parseInt(XandY[1], 10)
			if(Y > oldY)
			{
				maze.mazeSaveArray = maze.mazeSaveArray+'\n'
			}
			if(maze.mazeWithPosition[obj]['etp']){
				maze.mazeSaveArray = maze.mazeSaveArray+maze.mazeWithPosition[obj]['isPath']
			}else{
				maze.mazeSaveArray = maze.mazeSaveArray+maze.mazeWithPosition[obj]['path']
			}
			oldY = Y
		}
		console.log(maze.mazeSaveArray)

}

function myMaze(mazePath: string): Maze {
	let mazeRaw = readFileSync('data/maps/' + mazePath + '.map', 'utf8');
	let mazeLine = mazeRaw.split('\n');

	let maze = new Maze();
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
				isPath:'2'
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

