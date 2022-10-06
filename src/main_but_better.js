// ! Main
// ! Declare constants
const BASE_URL = "http://127.0.0.1:3000/";
const TASKSLIST = document.getElementById('tasksTable');
const OPTIONS = {
    method: 'GET',
    credentials: 'include',
    headers: new Headers({
        'Content-Type': 'application/json'
    })
};


// ! Declare variables
let filterMethod;
let resultFromQuery;
let status_display;

// ! Declare functions
const error = (err) => {
    console.log(err);
};

const clearScreen = () => {
    document.body.innerHTML = '';
};

/*
Method to render all the tasks.
An optional parameter can be provided
(id) to render a single task.
*/

const renderTasks = (id, filter = 'all') => {
    // Create the second base URL.
    let url = BASE_URL + 'tasks';

    // Check if ID is provided, if yes, add it to the URL.
    if (id && id !== 0) {
        url = BASE_URL + 'task/' + id;
    }

    // Fetch the data from the server.
    fetch(url, OPTIONS)
        // Convert response to json.
        .then((response) => response.json())
        .then((tasks) => {
            // Check if ID is provided, if yes, render the single task.
            if (id && id !== 0) {
                let tableRow = document.createElement('tr');

                let isChecked = 'off';

                // Check if the task is completed or not and set the status_display variable accordingly.
                status_display = tasks.completed === true ? 'Erledigt' : 'Offen';

                // Create an element to display the task.
                let checkboxElementParent = document.createElement('td');
                let checkboxElement = document.createElement('input');

                let idElement = document.createElement('td');

                let titleElement = document.createElement('td');

                let statusElement = document.createElement('td');

                let updateButtonParent = document.createElement('td');
                let updateButton = document.createElement('button');

                let deleteButtonParent = document.createElement('td');
                let deleteButton = document.createElement('button');

                // Set the attributes of the elements.
                checkboxElement.setAttribute('type', 'checkbox');
                if (tasks.completed === 'true') {
                    checkboxElement.setAttribute('checked', 'on');
                } else {
                    checkboxElement.setAttribute('checked', 'off');
                }

                idElement.innerText = tasks.id;
                titleElement.innerText = tasks.title;
                statusElement.innerText = status_display;
                deleteButton.classList.add('btn btn-danger');
                deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>";
                updateButton.classList.add('btn btn-primary');
                updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'

                // Event Listeners
                // When user clicks on the checkbox, update the task to the given status accordingly.
                checkboxElement.addEventListener('change', () => {
                    if (checkboxElement.checked) {
                        isChecked = 'on';
                        updateTask(id = tasks.id, completed = 'true');
                    } else {
                        isChecked = 'false';
                        updateTask(id = tasks.id, completed = 'false');
                    }
                });

                // If the user clicks the update button, call the updateTask function.
                updateButton.addEventListener('click', () => {
                    let new_title = prompt('Neuer Titel: ');
                    updateTask(id = tasks.id, title = new_title, completed = isChecked);
                });

                // If the user clicks the delete button, call the deleteTask function.
                deleteButton.addEventListener('click', () => {
                    deleteTask(id = tasks.id);
                });

                // Append elements to their respective parents.
                checkboxElementParent.appendChild(checkboxElement);
                updateButtonParent.appendChild(updateButton);
                deleteButtonParent.appendChild(deleteButton);

                // Append the elements to the table row.
                tableRow.append(checkboxElementParent, idElement, titleElement, statusElement, updateButtonParent, deleteButtonParent);

                TASKSLIST.appendChild(tableRow);
            }
            resultFromQuery = tasks;
            
            switch (filter) {
                case 'all':
                    resultFromQuery = tasks;
                    break;
                case 'due':
                    resultFromQuery = tasks.filter(task => task.completed === false);
                    break;
                case 'done':
                    resultFromQuery = tasks.filter(task => task.completed === true);
                    break;
                default:
                    error('Der angegebene Filter ist nicht bekannt.');
                    resultFromQuery = null;
                    break;
            }

            

            resultFromQuery.forEach((currentTask) => {
                let tableRow = document.createElement('tr');
                let isChecked = 'off';

                // Check if the task is completed or not and set the status_display variable accordingly.
                status_display = currentTask.completed === true ? 'Erledigt' : 'Offen';

                // Create an element to display the task.
                let checkboxElementParent = document.createElement('td');
                let checkboxElement = document.createElement('input');

                let idElement = document.createElement('td');

                let titleElement = document.createElement('td');

                let statusElement = document.createElement('td');

                let updateButtonParent = document.createElement('td');
                let updateButton = document.createElement('button');

                let deleteButtonParent = document.createElement('td');
                let deleteButton = document.createElement('button');

                // Set the attributes of the elements.
                checkboxElement.setAttribute('type', 'checkbox');
                if (currentTask.completed === 'true') {
                    checkboxElement.setAttribute('checked', 'on');
                } else {
                    checkboxElement.setAttribute('checked', 'off');
                }
                idElement.innerText = currentTask.id;
                titleElement.innerText = currentTask.title;
                statusElement.innerText = status_display;
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0";
                updateButton.classList.add('btn', 'btn-primary');
                updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';

                // Event Listeners

                // When user clicks on the checkbox, update the task to the given status accordingly.
                checkboxElement.addEventListener('change', () => {
                    if (checkboxElement.checked) {
                        updateTask(currentTask.id, currentTask.title, true);
                    } else {
                        updateTask(currentTask.id, currentTask.title, false);
                    }
                });

                // If the user clicks the update button, call the updateTask function.
                updateButton.addEventListener('click', () => {
                    let new_title = prompt('Neuer Titel: ');
                    updateTask(id = currentTask.id, title = new_title, completed = isChecked);
                });

                // If the user clicks the delete button, call the deleteTask function.
                deleteButton.addEventListener('click', () => {
                    deleteTask(id = currentTask.id);
                });

                // Append elements to their respective parents.
                checkboxElementParent.appendChild(checkboxElement);
                updateButtonParent.appendChild(updateButton);
                deleteButtonParent.appendChild(deleteButton);

                // Append the elements to the table row.
                tableRow.append(checkboxElementParent, idElement, titleElement, statusElement, updateButtonParent, deleteButtonParent);

                TASKSLIST.appendChild(tableRow);
            });
        });
};

/*
Every method which has to do with the user's account
and session.
* login();
* lologoutgin();
*/
const login = (email, password) => {
    // Change the method to POST
    OPTIONS.method = 'POST';

    // Add the body to the request (and convert to JSON in the process)
    OPTIONS.body = JSON.stringify({
        email: email,
        password: password
    });

    // Send the request
    fetch(`${BASE_URL}auth/cookie/login`, OPTIONS)
        .then(response => {
            // Check response status
            if (response.status === 200 && response) {
                if (response.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    error('Falsches E-Mail oder Passwort!');
                }
            } else {
                error('Etwas ist schief gelaufen!');
            }
        });
};

const logout = () => {
    // Edit the method to POST and the url.
    let url = BASE_URL + 'auth/cookie/logout';
    OPTIONS.method = 'POST';

    // Send the request.
    fetch(url, OPTIONS)
        .then((response) => response)
        .then((data) => {
            // Alert the response from the server.
            alert(data.text());
        });
};

/*
Methods for the tasks.
* updateTask(old_task, new_task);
It will update the task.
* createTask();
It will create a task along with an update and delete button.
*/
const createTask = (title) => {
    // Edit the method to POST and the url.
    let task = {
        'title': title
    };

    OPTIONS.method = 'POST';
    OPTIONS.body = JSON.stringify(task);
    fetch(`${BASE_URL}auth/cookie/tasks`, OPTIONS)
        .then(response => {
            if (response.status === 200 && response) {
                if (!response.ok) {
                    error('Etwas ist schief gelaufen!');
                }
            } else {
                error('Etwas ist schief gelaufen!');
            }
        });
};

const deleteTask = (id) => {
    // Change url based on given ID.
    let url = `${BASE_URL}auth/cookie/task/${id}`;

    // Change the method to DELETE.
    OPTIONS.method = 'DELETE';
    fetch(url, OPTIONS);
};

const updateTask = (taskId, title = null, completed = null) => {
    // Change url based on given ID.
    let url = `${BASE_URL}auth/cookie/tasks`;

    // Change the method to PUT.
    OPTIONS.method = 'PUT';
    // Add the body to the request (and convert to JSON in the process)
    if (title) {
        OPTIONS.body = JSON.stringify({
            id: taskId,
            title: title
        });
    } else if (title && completed) {
        OPTIONS.body = JSON.stringify({
            id: taskId,
            title: title,
            completed: completed
        });
    } else if (completed) {
        OPTIONS.body = JSON.stringify({
            id: taskId,
            completed: completed
        });
    } else {
        OPTIONS.body = JSON.stringify({
            id: taskId
        });
    }
    fetch(url, OPTIONS);
};

/*
Check the current site and run methods accordingly.
*/
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href === 'http://127.0.0.1:5500/src/dashboard.html') {
        // Get the elements needed for the task creation.
        const createTaskButton = document.querySelector('#createTaskButton');
        const taskTitle = document.querySelector('#taskTitle');

        // Add an Event Listener for the task creation.
        createTaskButton.addEventListener('click', (evnt) => {
            evnt.preventDefault();
            // Check if the user provided a title.
            if (taskTitle.value) {
                // Create the task.
                createTask(taskTitle.value);
            }
        });

        // Render all tasks, so user doesn't have to do manually everytime.
        renderTasks(0);

        // Get the elements needed for the filter-method selection.
        const filterMethodSelect = document.querySelector('#selectFilterMethod');
        const filterButton = document.querySelector('#filterButton');

        // Add Event Listener for the filter-method selection.
        filterMethodSelect.addEventListener('blur', (evnt1) => {
            // Best Practice: Use the event object to get the value.
            evnt1.preventDefault();

            // Get the selected filter-method.
            filterMethod = evnt1.target.value;

            // Check if the filter-method is `specificTask`.
            let idField = document.querySelector('#askForTaskID');
            let providedId = document.querySelector('#taskID').value;

            if (filterMethod === 'specificTask') {
                // Unhide the input field for the Task-ID.
                idField.classList.remove('hidden');
            } else {
                // Hide the input field for the Task-ID.
                idField.classList.add('hidden');
            }

            // Add an Event Listener for the filter button.
            filterButton.addEventListener('click', (evnt2) => {
                evnt2.preventDefault();
                // Check the provided filter-method.
                switch (filterMethod) {
                    case 'all':
                        // Render all tasks.
                        renderTasks();
                        break;

                    case 'specificTask':
                        // Render a specific task.
                        renderTasks(id = providedId);
                        break;

                    case 'done':
                        // Render all done tasks.
                        renderTasks(filter = 'done');
                        break;

                    case 'due':
                        // Render all due tasks.
                        renderTasks(filter = 'due');
                        break;

                    default:
                        // Render nothing and alert the user.
                        error('Diese Filter-Methode ist nicht verfügbar.');
                        break;
                }

            });
        });
    } else if (window.location.href === 'http://127.0.0.1:5500/src/login.html') {
        document.getElementById('loginButton').addEventListener('click', (event) => {
            event.preventDefault();
            let email = document.querySelector('#emailInput').value;
            let password = document.querySelector('#passwordInput').value;
            login(email, password);
        });
    }
});
