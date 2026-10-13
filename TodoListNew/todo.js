
const readline = require("readline/promises");

let tasks = [];

const PRIORITIES = ["low", "medium", "high"];

function isValidTitle(title) {
  return typeof title === "string" && title.trim() !== "";
}

function isValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const d = new Date(dateString);
  return !isNaN(d) && d.toISOString().slice(0, 10) === dateString;
}

function generateId() {
  let maxId = 0;
  for (const task of tasks) {
    if (task.id > maxId) maxId = task.id;
  }
  return maxId + 1;
}

function addTask(title, priority = "medium", dueDate = null) {
  if (!isValidTitle(title)) {
    console.log("Error: title cannot be empty.");
    return null;
  }
  if (!PRIORITIES.includes(priority)) {
    console.log("Error: priority must be low, medium or high.");
    return null;
  }
  if (dueDate !== null && !isValidDate(dueDate)) {
    console.log("Error: due date must be a real date in YYYY-MM-DD format.");
    return null;
  }

  const task = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    priority: priority,
    dueDate: dueDate,
  };
  tasks.push(task);
  console.log(`Task added: "${task.title}" (id ${task.id})`);
  return task;
}

function showTasks(list = tasks) {
  if (list.length === 0) {
    console.log("No tasks to show.");
    return;
  }
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    const mark = t.completed ? "x" : " ";
    const extras = [];
    if (t.priority) extras.push(t.priority);
    if (t.dueDate) extras.push(`due ${t.dueDate}`);
    const suffix = extras.length ? `  (${extras.join(", ")})` : "";
    console.log(`[${mark}] ${t.id} - ${t.title}${suffix}`);
  }
}

function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

function markCompleted(id) {
  const task = getTaskById(id);
  if (!task) {
    console.log(`Error: no task with id ${id}.`);
    return null;
  }
  task.completed = true;
  console.log(`Task ${id} marked as completed.`);
  return task;
}

function removeTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log(`Error: no task with id ${id}.`);
    return null;
  }
  const [removed] = tasks.splice(index, 1);
  console.log(`Task ${id} ("${removed.title}") removed.`);
  return removed;
}

function findTask(keyword) {
  if (!isValidTitle(keyword)) {
    console.log("Error: search keyword cannot be empty.");
    return [];
  }
  const needle = keyword.trim().toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(needle));
}

function countTasks() {
  console.log(`Total tasks: ${tasks.length}`);
  return tasks.length;
}

function countCompletedTasks() {
  const count = tasks.filter((t) => t.completed).length;
  console.log(`Completed tasks: ${count}`);
  return count;
}

function exportTasks() {
  return JSON.stringify(tasks, null, 2);
}

function importTasks(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (err) {
    console.log("Error: that is not valid JSON.");
    return false;
  }

  if (!Array.isArray(data)) {
    console.log("Error: JSON must contain an array of tasks.");
    return false;
  }

  const allValid = data.every(
    (t) =>
      t !== null &&
      typeof t === "object" &&
      typeof t.id === "number" &&
      isValidTitle(t.title) &&
      typeof t.completed === "boolean"
  );
  if (!allValid) {
    console.log("Error: each task needs id (number), title (string), completed (boolean).");
    return false;
  }

  const ids = data.map((t) => t.id);
  if (new Set(ids).size !== ids.length) {
    console.log("Error: task ids must be unique.");
    return false;
  }

  tasks = data;
  console.log(`Imported ${tasks.length} task(s).`);
  return true;
}

function sortByName() {
  tasks.sort((a, b) => a.title.localeCompare(b.title));
  console.log("Tasks sorted by name.");
}

function sortByPriority() {
  const rank = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1));
  console.log("Tasks sorted by priority (high to low).");
}

function showStatistics() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const open = total - done;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);
  console.log(`Total Tasks: ${total}`);
  console.log(`Completed: ${done}`);
  console.log(`Open: ${open}`);
  console.log(`Completion Rate: ${rate}%`);
}

function runDemo() {
  console.log("=== DEMO: adding 6 tasks ===");
  addTask("Learn Arrays", "high", "2026-10-15");
  addTask("Practice Functions", "medium");
  addTask("Learn Closures", "high", "2026-10-20");
  addTask("Practice Loops", "low");
  addTask("Read about JSON", "medium", "2026-10-18");
  addTask("Build the To-Do app", "high");

  console.log("\n=== showTasks ===");
  showTasks();

  console.log("\n=== markCompleted(2) and markCompleted(4) ===");
  markCompleted(2);
  markCompleted(4);
  showTasks();

  console.log("\n=== findTask('loop') ===");
  showTasks(findTask("loop"));

  console.log("\n=== counts ===");
  countTasks();
  countCompletedTasks();

  console.log("\n=== validation ===");
  addTask("");
  addTask("   ");
  removeTask(999);
  markCompleted(999);

  console.log("\n=== removeTask(5) ===");
  removeTask(5);

  console.log("\n=== sortByPriority ===");
  sortByPriority();
  showTasks();

  console.log("\n=== sortByName ===");
  sortByName();
  showTasks();

  console.log("\n=== statistics ===");
  showStatistics();

  console.log("\n=== exportTasks ===");
  const json = exportTasks();
  console.log(json);

  console.log("\n=== importTasks (valid, then invalid) ===");
  importTasks(json);
  importTasks("this is not json");
  importTasks('{"id": 1}');
}

// ---------- Menu ----------
function printMenu() {
  console.log(`
===== To-Do List Manager =====
1. Add Task
2. Show Tasks
3. Complete Task
4. Remove Task
5. Search Task
6. Count Tasks
7. Export JSON
8. Exit
--- extras ---
9. Import JSON
10. Sort by name
11. Sort by priority
12. Statistics`);
}

async function askId(rl, prompt) {
  const answer = (await rl.question(prompt)).trim();
  return /^\d+$/.test(answer) ? Number(answer) : NaN;
}

async function main() {
  if (process.argv.includes("--demo")) {
    runDemo();
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let running = true;

  while (running) {
    printMenu();
    const choice = (await rl.question("Choose an option: ")).trim();

    switch (choice) {
      case "1": {
        const title = await rl.question("Title: ");
        const priority = (await rl.question("Priority (low/medium/high, Enter = medium): ")).trim().toLowerCase() || "medium";
        const due = (await rl.question("Due date YYYY-MM-DD (Enter to skip): ")).trim();
        addTask(title, priority, due === "" ? null : due);
        break;
      }
      case "2":
        showTasks();
        break;
      case "3":
        markCompleted(await askId(rl, "Task id to complete: "));
        break;
      case "4":
        removeTask(await askId(rl, "Task id to remove: "));
        break;
      case "5": {
        const keyword = await rl.question("Search keyword: ");
        const results = findTask(keyword);
        if (results.length > 0) showTasks(results);
        else if (isValidTitle(keyword)) console.log("No matching tasks.");
        break;
      }
      case "6":
        countTasks();
        countCompletedTasks();
        break;
      case "7":
        console.log(exportTasks());
        break;
      case "8":
        running = false;
        console.log("Goodbye!");
        break;
      case "9": {
        const json = await rl.question("Paste JSON on one line: ");
        importTasks(json);
        break;
      }
      case "10":
        sortByName();
        showTasks();
        break;
      case "11":
        sortByPriority();
        showTasks();
        break;
      case "12":
        showStatistics();
        break;
      default:
        console.log("Invalid option, please choose 1-12.");
    }
  }
  rl.close();
}

main();
