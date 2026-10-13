# To-Do List Manager

## Purpose
A console-based JavaScript application for managing a list of tasks. It was built to practice arrays, objects, loops, functions, scope, JSON and array methods.

## How to run
```
node todo.js          # interactive menu
node todo.js --demo   # runs every feature with 6 sample tasks (used for screenshots)
```
Requires Node.js 17 or newer.

## Implemented features
- `addTask(title)`: creates a task with a unique id and `completed: false`, adds it with `push`
- `showTasks()`: prints every task using a `for` loop, e.g. `[x] 2 - Practice Functions`
- `markCompleted(id)`: finds the task with `find` and sets `completed` to `true`
- `removeTask(id)`: finds the index and removes the task with `splice`, then prints a confirmation
- `findTask(keyword)`: case-insensitive search using `filter`
- `countTasks()` and `countCompletedTasks()`
- `exportTasks()` / `importTasks(jsonString)`: `JSON.stringify(tasks, null, 2)` and `JSON.parse`
- Validation: empty or whitespace titles, unknown ids, invalid JSON, malformed task data
- Bonus: priorities, due dates, `sortByName()`, `sortByPriority()`, statistics with completion rate

## Challenges encountered
(Write your own here. Ideas: generating unique ids after removing tasks, validating dates, handling bad JSON on import.)

## Lessons learned
(Write your own here. Ideas: difference between `find`, `filter` and `findIndex`; why `splice` changes the original array; how `try/catch` protects against invalid JSON.)
