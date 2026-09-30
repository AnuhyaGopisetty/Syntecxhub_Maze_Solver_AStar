// Structure to hold a pair of coordinates.
class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
}

// Structure to hold necessary tracking parameters for each grid node.
class Cell {
    constructor() {
        this.parent_i = -1;
        this.parent_j = -1;
        this.f = Number.MAX_VALUE;
        this.g = Number.MAX_VALUE;
        this.h = Number.MAX_VALUE;
    }
}

// Priority Queue implementation using a Min Heap.
class MinHeap {
    constructor() { this.heap = []; }

    enqueue(item, priority) {
        this.heap.push({item, priority});
        let index = this.heap.length - 1;
        while (index > 0) {
            let parent = Math.floor((index - 1) / 2);
            if (this.heap[parent].priority <= this.heap[index].priority) break;
            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            index = parent;
        }
    }

    dequeue() {
        if (this.heap.length === 0) return null;
        let root = this.heap[0];
        let last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            let index = 0;
            while (true) {
                let left = 2 * index + 1;
                let right = 2 * index + 2;
                let smallest = index;
                
                if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
                if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
                if (smallest === index) break;
                
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            }
        }
        return root; // Returns full wrapper object (.item and .priority)
    }

    isEmpty() { return this.heap.length === 0; }
}

// Helper validations reading properties directly from run-time states
function isValid(grid, row, col) { 
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length; 
}
function isUnBlocked(grid, row, col) { return grid[row][col] === 1; }
function isDestination(row, col, dest) { return row === dest.first && col === dest.second; }
function calculateHValue(row, col, dest) {
    return Math.sqrt((row - dest.first) * (row - dest.first) + (col - dest.second) * (col - dest.second));
}

// Backtracks from destination back to source and renders the grid visual
function tracePath(cellDetails, dest, grid, src) {
    console.log("The destination cell is found!");
    const ROW = grid.length;
    const COL = grid[0].length;

    let row = dest.first;
    let col = dest.second;
    let path = [];
    let pathSet = new Set();

    while (!(cellDetails[row][col].parent_i === row && cellDetails[row][col].parent_j === col)) {
        path.push(new Pair(row, col));
        pathSet.add(`${row},${col}`);
        let tempRow = cellDetails[row][col].parent_i;
        let tempCol = cellDetails[row][col].parent_j;
        row = tempRow;
        col = tempCol;
    }
    path.push(new Pair(row, col));
    pathSet.add(`${row},${col}`);

    let pathString = "";
    while (path.length > 0) {
        let p = path.pop();
        pathString += `-> (${p.first}, ${p.second}) `;
    }
    console.log("The Path is:\n" + pathString);

    console.log("\nVisual Grid Map (S=Start, G=Goal, *=Path, █=Wall, .=Empty):");
    for (let i = 0; i < ROW; i++) {
        let rowStr = "";
        for (let j = 0; j < COL; j++) {
            if (i === src.first && j === src.second) rowStr += " S ";
            else if (i === dest.first && j === dest.second) rowStr += " G ";
            else if (pathSet.has(`${i},${j}`)) rowStr += " * ";
            else if (grid[i][j] === 0) rowStr += " █ ";
            else rowStr += " . ";
        }
        console.log(rowStr);
    }
}

// A* Search Algorithm Orchestrator
function aStarSearch(grid, src, dest) {
    const ROW = grid.length;
    const COL = grid[0].length;

    if (!isValid(grid, src.first, src.second) || !isValid(grid, dest.first, dest.second)) {
        console.log("Source or Destination is invalid");
        return;
    }
    if (!isUnBlocked(grid, src.first, src.second) || !isUnBlocked(grid, dest.first, dest.second)) {
        console.log("Source or destination is blocked");
        return;
    }

    let closedList = Array.from({length : ROW}, () => Array(COL).fill(false));
    let cellDetails = Array.from({length : ROW}, () => Array(COL));

    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            cellDetails[i][j] = new Cell();
        }
    }

    let row = src.first;
    let col = src.second;

    cellDetails[row][col].f = 0;
    cellDetails[row][col].g = 0;
    cellDetails[row][col].h = 0;
    cellDetails[row][col].parent_i = row;
    cellDetails[row][col].parent_j = col;

    let openList = new MinHeap();
    openList.enqueue(new Pair(row, col), 0);

    while (!openList.isEmpty()) {
        let nodeWrapper = openList.dequeue();
        let current = nodeWrapper.item;
        let priority = nodeWrapper.priority;
        
        row = current.first;
        col = current.second;

        // CORRECT PLACEMENT: Verify destination only when expanding the node from the heap
        if (isDestination(row, col, dest)) {
            tracePath(cellDetails, dest, grid, src);
            return;
        }

        // Optimization: Drop outdated paths early if a cheaper route was discovered later
        if (priority > cellDetails[row][col].f) continue;
        if (closedList[row][col]) continue;
        closedList[row][col] = true;

        let dRow = [ -1, 1, 0, 0, -1, -1, 1, 1 ];
        let dCol = [ 0, 0, 1, -1, 1, -1, 1, -1 ];

        for (let dir = 0; dir < 8; dir++) {
            let newRow = row + dRow[dir];
            let newCol = col + dCol[dir];

            if (!isValid(grid, newRow, newCol)) continue;

            if (!closedList[newRow][newCol] && isUnBlocked(grid, newRow, newCol)) {
                let gNew = cellDetails[row][col].g + ((Math.abs(dRow[dir]) + Math.abs(dCol[dir]) === 2) ? 1.414 : 1.0);
                let hNew = calculateHValue(newRow, newCol, dest);
                let fNew = gNew + hNew;

                if (cellDetails[newRow][newCol].f === Number.MAX_VALUE || cellDetails[newRow][newCol].f > fNew) {
                    openList.enqueue(new Pair(newRow, newCol), fNew);
                    cellDetails[newRow][newCol].f = fNew;
                    cellDetails[newRow][newCol].g = gNew;
                    cellDetails[newRow][newCol].h = hNew;
                    cellDetails[newRow][newCol].parent_i = row;
                    cellDetails[newRow][newCol].parent_j = col;
                }
            }
        }
    }
    console.log("Failed to find the Destination Cell");
}

// --- Driver Execution Code ---
let grid = [
    [ 1, 0, 1, 1, 1, 1, 0, 1, 1, 1 ],
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1 ],
    [ 1, 1, 1, 0, 1, 1, 0, 1, 0, 1 ],
    [ 0, 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 0 ],
    [ 1, 0, 1, 1, 1, 1, 0, 1, 0, 0 ],
    [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 1 ],
    [ 1, 0, 1, 1, 1, 1, 0, 1, 1, 1 ],
    [ 1, 1, 1, 0, 0, 0, 1, 0, 0, 1 ]
];

let src = new Pair(8, 0);
let dest = new Pair(0, 0);

aStarSearch(grid, src, dest);
