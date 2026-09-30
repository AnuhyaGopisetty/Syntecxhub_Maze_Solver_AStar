# Syntecxhub Internship - Task 1: AI Maze Solver using A* Search

A high-performance implementation of the **A* Search Algorithm** written in JavaScript. This project navigates a 2D grid containing obstacles, utilizing optimized data structures to guarantee the calculation of the shortest mathematical path.

## 🧠 Core AI & Algorithmic Features
* **Heuristic Functions:** Implements an accurate **Euclidean Distance** calculation (h(n)) to evaluate optimal movement projections toward the destination.
* **State-Space Space Graph:** Supports complex **8-directional path traversal** across standard coordinates (up, down, left, right) and diagonal nodes.
* **Custom Edge Weighting:** Accurately balances cost-to-travel parameters by assigning a cost of `1.0` to lateral movements and a weight of `1.414` (\(\sqrt{2}\)) to diagonal adjustments.
* **Optimized Priority Queue:** Built entirely using a manual **MinHeap Binary Tree data structure** for high-efficiency \(O(\log n)\) extraction of nodes with the absolute lowest structural cost functions (f(n) = g(n) + h(n)).
* **Multi-Environment Console Visualization:** Stripped of node-locked output streams (`process.stdout`), enabling real-time terminal outputs and standard web developer console parsing.

## 🚀 Execution & Environment Compatibility
This script is engineered to run seamlessly across local runtime nodes and browser engines out of the box.

### Execution Option A: Node.js Terminal
1. Verify that you have [Node.js](https://nodejs.org) installed locally.
2. Initialize your project directory and run the source file:
   ```bash
   node index.js
   ```

### Execution Option B: Web Browser Console
1. Copy the entire contents of your `index.js` file.
2. Open any fresh web browser tab (Chrome, Edge, Firefox, Safari).
3. Open the inspection panel (`Right Click` -> `Inspect` or press `F12`) and navigate to the **Console** tab.
4. Paste the raw script and press `Enter` to observe immediate code execution.

## 📊 Evaluation & System Outputs
Upon a successful path calculation run, the engine logs the raw string path array alongside an ASCII visual mapping matrix:

```text
The destination cell is found
The Path is:
-> (8, 0) -> (7, 0) -> (6, 0) -> (5, 0) -> (4, 1) -> (3, 2) -> (2, 2) -> (1, 2) -> (0, 2) -> (0, 1) -> (0, 0) 

Visual Grid Map (S=Start, G=Goal, *=Path, █=Wall, .=Empty):
 G  *  *  .  .  .  █  .  .  . 
 .  .  *  █  .  .  .  █  .  . 
 .  .  *  █  .  .  █  .  █  . 
 █  █  *  █  .  █  █  █  █  . 
 .  *  .  █  .  .  .  █  .  █ 
 *  █  .  .  .  .  █  .  █  █ 
 *  █  █  █  █  .  █  █  █  . 
 *  █  .  .  .  .  █  .  .  . 
 S  .  .  █  █  █  .  █  █  . 
```

## 🛠️ Project Repository Naming Architecture
In compliance with individual task criteria, this project is tracked inside the target structure:
`Syntecxhub_Maze_Solver_AStar`
