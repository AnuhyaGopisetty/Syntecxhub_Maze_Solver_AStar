# Syntecxhub Internship - Task 1: AI Maze Solver using A* Search

# AI Maze Solver (A* Search Algorithm)

This project is a high-performance implementation of the A* Search Algorithm written in pure vanilla JavaScript. It calculates the absolute shortest mathematical path through a 2D grid containing obstacles and walls.

I built this with zero external dependencies, meaning it runs entirely in the browser console out of the box without needing Node.js or any external package installations.

## Core Algorithmic Features

* **Euclidean Distance Heuristic:** Evaluates the optimal distance projection (h(n)) toward the target destination.
* **8-Directional Traversal:** Supports moving up, down, left, right, and diagonally across standard grid coordinates.
* **Custom Dynamic Weighting:** Balances movement costs by assigning a cost of 1.0 to lateral moves and 1.414 (\(\sqrt{2}\)) to diagonal adjustments.
* **Manual MinHeap Binary Tree:** Built completely from scratch for high-efficiency (\(O(\log n)\)) extraction of nodes with the lowest path cost functions (f(n) = g(n) + h(n)).
* **ASCII Grid Visualization:** Generates and prints a text-based map directly into the console to visually track the path around walls.

## How to Run the Project

Since this runs purely on client-side web technology, you don't need to install anything on your machine.

1. Open the live **GitHub Pages** link generated for this repository (found under the Deployments or About section).
2. Right-click anywhere on the webpage, select **Inspect**, and switch to the **Console** tab.
3. Refresh the page to see the automated algorithmic calculations and the final matrix layout.

---

## Live System Output

When the script executes in your browser console, it successfully maps the coordinates and draws the final path matrix layout:

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
