// ! Main
// ! Declare constants
const BASE_URL = "http://localhost:3000/";
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
let resultFromQuery = [];
let status_display;

// ! Declare functions
const error = (err) => {
    console.log(err);
};

const clearScreen = () => {
    // Remove all children from the table.
    let children = TASKSLIST.children;
    for(let child of children) {
        TASKSLIST.removeChild(child);
    }
};

/*
Method to render all the tasks.
An optional parameter can be provided
(id) to render a single task.
*/

const renderTasks = (id, filter) => {
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
            clearScreen();  // Clear the screen.
            // Switch Statement to filter the tasks into the given filter.

            switch (filter) {
                case 'specificTask':
                    // Get the task with the given ID.
                    resultFromQuery.push(tasks);
                    break;
                case 'all':
                    clearScreen();
                    resultFromQuery = tasks;
                    break;
                case 'due':
                    resultFromQuery = tasks.filter(task => task.completed === false);
                    break;
                case 'done':
                    resultFromQuery = tasks.filter(task => task.completed);
                    break;
                default:
                    error('Der angegebene Filter ist nicht bekannt.');
                    resultFromQuery = null;
                    break;
            }
            resultFromQuery.forEach((currentTask) => {
                if(!(filter === 'all')) {
                    clearScreen();
                }

                let tableRow = document.createElement('tr');

                // Check if the task is completed or not and set the status_display variable accordingly.
                status_display = currentTask.completed ? 'Erledigt' : 'Offen';

                // Create an element to display the task.
                let checkboxElementParent = document.createElement('td');
                let checkboxElement = document.createElement('input');

                let idElement = document.createElement('td');

                let titleElementParent = document.createElement('td');
                let titleElement = document.createElement('input');

                let statusElement = document.createElement('td');

                let updateButtonParent = document.createElement('td');
                let updateButton = document.createElement('button');

                let deleteButtonParent = document.createElement('td');
                let deleteButton = document.createElement('button');

                // Set the attributes of the elements.
                checkboxElement.setAttribute('type', 'checkbox');
                if (currentTask.completed) {
                    checkboxElement.setAttribute('checked', true);
                } else {
                    checkboxElement.setAttribute('checked', false);
                }

                idElement.innerText = currentTask.id;
                titleElement.value = currentTask.title;
                titleElement.setAttribute('type', 'text');
                titleElement.setAttribute('class', 'form-control');
                titleElement.setAttribute('readonly', 'true');
                statusElement.innerText = status_display;
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>";
                //deleteButton.style.marginLeft = '-100px';
                updateButton.classList.add('btn', 'btn-primary');
                updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
                //updateButton.style.marginRight = '-200px';
                // Event Listeners
                
                // When user clicks on the checkbox, update the task to the given status accordingly.
                checkboxElement.addEventListener('change', () => 
                    updateTask({...currentTask, completed: !currentTask.completed})
                );

                checkboxElement.checked = currentTask.completed;

                // If the user clicks the update button, call the updateTask function.
                updateButton.addEventListener('click', () => {
                    titleElement.removeAttribute('readonly');
                    titleElement.addEventListener('blur', () => {
                        let new_title = titleElement.value;
                        updateTask({...currentTask, title: new_title});
                        titleElement.setAttribute('readonly', 'true');
                    });
                });

                // If the user clicks the delete button, call the deleteTask function.
                deleteButton.addEventListener('click', () => {
                    deleteTask(currentTask.id);
                });

                // Append elements to their respective parents.
                checkboxElementParent.appendChild(checkboxElement);
                updateButtonParent.appendChild(updateButton);
                deleteButtonParent.appendChild(deleteButton);
                titleElementParent.appendChild(titleElement);

                // Append the elements to the table row.
                tableRow.append(
                    checkboxElementParent,
                    idElement,
                    titleElementParent,
                    statusElement,
                    updateButtonParent,
                    deleteButtonParent);

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
                    localStorage.setItem('login', true);
                } else {
                    error('Falsches E-Mail oder Passwort!');
                    let emailField = document.getElementById('email-group');
                    let passwordField = document.getElementById('password-group');
                    emailField.style.borderColor = 'red';
                    passwordField.style.borderColor = 'red';
                    localStorage.setItem('login', false);
                }
            } else {
                error('Etwas ist schief gelaufen!');
                localStorage.setItem('login', false);
            }
        });
};

const logout = () => {
    // Edit the method to POST and the url.
    let url = BASE_URL + 'auth/cookie/logout';
    OPTIONS.method = 'POST';

    // Send the request.
    fetch(url, OPTIONS);
    window.location.href = 'index.html';
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
    location.reload();
};

const updateTask = (task) => {
    // Change url based on given ID.
    let url = `${BASE_URL}auth/cookie/tasks`;

    // Change the method to PUT.
    OPTIONS.method = 'PUT';
    // Add the body to the request (and convert to JSON in the process)
    OPTIONS.body = JSON.stringify(task);

    fetch(url, OPTIONS);
};

/*
Check the current site and run methods accordingly.
*/
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href === 'http://localhost:5500/src/dashboard.html') {
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
                location.reload();
            }
        });

        // Render all tasks, so user doesn't have to do manually everytime.
        clearScreen();
        renderTasks(0, 'all');

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
            let providedId = document.querySelector('#taskID');

            if (filterMethod === 'specificTask') {
                // Unhide the input field for the Task-ID.
                idField.classList.remove('hidden');
            } else {
                // Hide the input field for the Task-ID.
                idField.classList.add('hidden');
            }

            // Add an Event Listener for the filter button.
            filterButton.addEventListener('click', (evnt2) => {
                
                clearScreen();
                evnt2.preventDefault();
                // Check the provided filter-method.
                switch (filterMethod) {
                    case 'all':
                        // Render all tasks.
                        renderTasks(0, filterMethod);
                        break;

                    case 'specificTask':
                        // Render a specific task.
                        renderTasks(providedId.value, 'specificTask');
                        break;

                    case 'done':
                        // Render all done tasks.
                        renderTasks(0, filterMethod);
                        break;

                    case 'due':
                        // Render all due tasks.
                        renderTasks(0, filterMethod);
                        break;

                    default:
                        // Render nothing and alert the user.
                        error('Diese Filter-Methode ist nicht verfügbar.');
                        break;
                }

            });
        });
        
    } else if (window.location.href === ('http://localhost:5500/src/login.html' || 'http://localhost:5500/src/login.html?')) {
        // Get the elements needed for the login.
        let loginForm = document.querySelector('#loginForm');
        loginForm.addEventListener('submit', () => {
            let email = document.querySelector('#emailInput').value;
            let password = document.querySelector('#passwordInput').value;
            login(email, password);
        });
    }
});