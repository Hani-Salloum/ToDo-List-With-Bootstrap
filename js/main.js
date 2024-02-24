const title = document.getElementById("title");
const description = document.getElementById("description");
const date = document.getElementById("date");
const submit = document.querySelector("#submit");
const sort = document.getElementById("sort");
const search = document.getElementById("search");
const tasksContainer = document.querySelector(".task-container");

const arrayOfColors = ["warning", "danger", "info", "success"];
let colorIndex = -1;

let editingTask = 0;

let arrOfTasks = JSON.parse(localStorage.getItem("tasks")) || [];
showData(arrOfTasks);


function handleSubmit() {
    if(title.value === null || title.value === "") return;

    if(editingTask !== 0) {
        taskIsEdited(editingTask);
        editingTask = 0;
        return;
    }

    colorIndex = (colorIndex + 1) % arrayOfColors.length;

    const task= {
        id: Date.now(),
        title: title.value,
        description: description.value || "No description entered",
        date: new Date(date.value).toDateString(),
        color: arrayOfColors[colorIndex],
        done: false,
    }

    clearForm();

    arrOfTasks.push(task);
    showData(arrOfTasks);
    addDataToLocalStorage(arrOfTasks);
}

function showData(arrOfTasks) {
    let html = arrOfTasks.map(task => {
        return `
                <div data-num='${task.id}' class="task alert alert-${!task.done ? task.color : 'dark'}  d-flex align-items-center g-3" role="alert">
                    <div class="flex-grow-1 ${task.done ? 'text-decoration-line-through' : ''}">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text" style="word-break: break-all;">${task.description}</p>
                        <p class="card-text">${task.date}</p>
                    </div>
                    <button type="button" class="edit-button ${task.done ? 'disabled' : ''} btn btn-secondary">edit</button>
                    <button type="button" class="delete-button ms-2 btn btn-danger ">delete</button>
                </div>
        `;
    }).join("");
    tasksContainer.innerHTML = html;
}

function addDataToLocalStorage(arr) {
    let data = JSON.stringify(arr);
    localStorage.setItem("tasks", data);
}


function handleTasksClick(e) {
    if(e.target.classList.contains("delete-button")) deleteTask(e.target.parentElement.dataset.num);
    if(e.target.classList.contains("edit-button")) editTask(e.target.parentElement.dataset.num);
    if(e.target.classList.contains("task")) checkTask(e.target.dataset.num);
}

function deleteTask(id) {
    arrOfTasks = arrOfTasks.filter(task => task.id != id);
    showData(arrOfTasks);
    addDataToLocalStorage(arrOfTasks);
}

function editTask(id) {
    arrOfTasks.forEach(task => {
        if(task.id == id) {
            title.value = task.title;
            description.value = task.description;
            date.value =  new Date(task.date);
            editingTask = id;
        }
    });
}

function taskIsEdited(editingTask) {
    arrOfTasks.forEach(task => {
        if(task.id == editingTask) {
            task.title = title.value;
            task.date = new Date(date.value).toDateString();
            task.description = description.value || "No description entered";
        }
    })
    clearForm();

    showData(arrOfTasks);
    addDataToLocalStorage(arrOfTasks);
}
function checkTask(id) {
    arrOfTasks.forEach(task => {
        if(task.id == id) {
            task.done = !task.done;
        }
    });
    showData(arrOfTasks);
    addDataToLocalStorage(arrOfTasks);
}

function clearForm() {
    title.value = "";
    description.value = "";
    date.value = "";
}

function handleSort() {
    if(sort.value == "none") return;
    else if(sort.value == "date") {
        arrOfTasks = arrOfTasks.sort((a,b) => {
            a = new Date(a.date);
            b = new Date(b.date); 
            return a > b ? 1 : -1;
        });
    }
    else {
        arrOfTasks = arrOfTasks.sort((a,b) => a.done > b.done ? 1 : -1);
    }

    showData(arrOfTasks);
    addDataToLocalStorage(arrOfTasks);
}

function handleSearch() {
    let matches = findMatches(search.value, arrOfTasks);
    showData(matches);
}

function findMatches(wordToMatch, words) {
    return arrOfTasks.filter(task => {
        const regex = new RegExp(wordToMatch, 'ig');
        return task.title.match(regex) || task.description.match(regex);
    });
}

tasksContainer.addEventListener("click", handleTasksClick);
submit.addEventListener("click", handleSubmit);
sort.addEventListener("change", handleSort);
search.addEventListener("change", handleSearch);
search.addEventListener("keyup", handleSearch);