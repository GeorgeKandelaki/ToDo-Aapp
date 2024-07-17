"use strict";

const inputAddTask = document.querySelector(".add-task");

const tasksContainer = document.querySelector(".tasks");
const todoStats = document.querySelector(".todo-stats");

const leftItems = document.querySelector(".left-quantity");

const themeModeSwitch = document.querySelector(".theme-switch");

// Declare/Define That theme is light by default
let lightTheme = true;
// Declare/Define Draggable Element

const tasksArr = [];

const createTaskObj = function ({ value }) {
	return { task: value, completed: false, id: Date.now() };
};

const activeTasksLeft = function (el, arr) {
	const filteredArr = arr.filter((el) => !el.completed);
	if (!filteredArr) 0;
	el.textContent = filteredArr.length;
};

const createTemplate = function (task) {
	const isChecked = task.completed ? "checked" : "";
	const taskTemplate = `				
    <div class="task-box" draggable="true">
        <p class="task">
            <input class="cb" id="${task.id}" type="checkbox" ${isChecked}/>
            <label class="task-text" for="${task.id}"
                >${task.task}</label
            >
        </p>
        <img
            src="./images/icon-cross.svg"
            alt="image of an X"
			class="rm-task"
        />
    </div>`;

	return taskTemplate;
};

const clearTasks = function (el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
};

const render = function (parentElement, arr) {
	clearTasks(parentElement);
	arr.forEach((el) =>
		parentElement.insertAdjacentHTML("afterbegin", createTemplate(el))
	);
	return activeTasksLeft(leftItems, arr);
};

const createAndRenderTask = function (e) {
	// 1) Get Task and Give It Special ID
	const task = createTaskObj(inputAddTask);

	if (e.key === "Enter") {
		// 2) Push Taks To tasks array
		tasksArr.push(task);
		// 3) Render Task
		render(tasksContainer, tasksArr);
	}
};

const completeTask = function (targetCb) {
	// Find the Clicked Task
	const task = tasksArr.find((task) => task.id == targetCb.id);
	// Mark As completed
	task.completed = targetCb.checked;
	// Update Items Counter
	activeTasksLeft(leftItems, tasksArr);
};

const changeSortState = function (el, className) {
	const children = Array.from(el.parentElement.children);
	children.forEach((el) => el.classList.remove(className));
	el.classList.add(className);
};

const filterAndRenderTasks = function (condition) {
	const filteredArr = tasksArr.filter(condition);
	return render(tasksContainer, filteredArr);
};

const sortTasks = function (parentElement, sortType) {
	// 1) If Sort === all, Then render all tasks
	if (sortType === "all") return render(parentElement, tasksArr);

	// 2) If Sort === active, Then render unfinished tasks
	if (sortType === "active")
		return filterAndRenderTasks((el) => !el.completed);

	// 3) If Sort === completed, Then render finished tasks
	if (sortType === "completed")
		return filterAndRenderTasks((el) => el.completed);

	return false;
};

const clearAndUpdateArr = function (arr, newArr) {
	// Clear The Array
	arr.length = 0;
	// Update the Array
	return arr.push(...newArr);
};

const clearCompletedTasksAndRender = function (arr) {
	// Filter out Completed tasks
	const newArr = arr.filter((el) => !el.completed);
	// Clear and Update the Array
	clearAndUpdateArr(arr, newArr);
	// Render the tasks
	return render(tasksContainer, arr);
};

const rmTasks = function (id, arr) {
	// Filter the New Arr Without the removed task
	const newArr = arr.filter((el) => el.id != id);
	// Clear the array
	clearAndUpdateArr(arr, newArr);
	// Render the tasks
	return render(tasksContainer, arr);
};

// Couldn't import drag and drop functionality

// Create Task and Render It
inputAddTask.addEventListener("keydown", createAndRenderTask);
// Complete task and mark the "completed" property of an task as true
tasksContainer.addEventListener("click", (e) => {
	const target = e.target;
	const targetCb = target.parentElement.querySelector(".cb");
	if (targetCb) completeTask(targetCb);

	if (target.classList.contains("rm-task")) {
		const targetId = targetCb.id;
		rmTasks(targetId, tasksArr);
	}
});
// Sort by all/active/completed
todoStats.querySelector(".sort").addEventListener("click", (e) => {
	const target = e.target;
	const targetSort = target.dataset.value;
	// Guard Clause
	if (!targetSort) return;
	// Remove Active Class on other elements except the current active one.
	changeSortState(target, "active-sort");
	// Sort the tasks
	sortTasks(tasksContainer, targetSort, "active-sort");
});
todoStats.addEventListener("click", (e) => {
	// Find the Clear items Button
	const targetBTN = e.target.classList.contains("clear-completed");
	// Guard Clause
	if (!targetBTN) return;
	// Clear The tasks
	clearCompletedTasksAndRender(tasksArr);
});
themeModeSwitch.addEventListener("click", function () {
	// Get Main Containers to Change up
	const background = document.querySelector(".bg-image");
	const todoBody = document.querySelector(".todo-body");
	// Declare/Define whne the theme is light and dark
	lightTheme = !lightTheme;

	// Change background img
	background.src = lightTheme
		? "./images/bg-desktop-light.jpg"
		: "./images/bg-desktop-dark.jpg";
	// Change theme Switch Icon
	themeModeSwitch.src = lightTheme
		? "./images/icon-moon.svg"
		: "./images/icon-sun.svg";

	// Change body color
	document.body.style.backgroundColor = lightTheme
		? "hsl(0, 0%, 98%)"
		: "hsl(235, 21%, 11%)";
	// Change the input Color
	document
		.querySelectorAll(".task-text")
		.forEach((el) => (el.style.color = lightTheme ? "black" : "white"));
	inputAddTask.style.color = lightTheme ? "black" : "white";

	// Change the tasks body and add task color
	inputAddTask.style.backgroundColor = todoBody.style.background = lightTheme
		? "white"
		: "hsl(235, 24%, 19%)";

	// Change the hover states on todo stats
});
