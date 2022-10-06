const BASE_URL = "http://127.0.0.1:3000/";
let token;
let filterMethod;

const options = {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
            'Content-Type': 'application/json'
      })
};

document.addEventListener('DOMContentLoaded', () => {
      // Variables we need from the beginning
      const tasksList = document.getElementById('tasksTable');

      const error = () => {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      };

      const clean = (tasksList) => {
            // Remove all children elements from tasksList
            for (let i = tasksList.children.length - 1; i >= 0; i--) {
                  tasksList.children[i].remove();
            }
      };

      // Method to create a new task
      const createTaskElement = (id, completed, title, deleteButtonTableData, updateButton) => {
            let element = document.createElement("tr");
            let text_to_show = 'Due';
            if (completed === 'true') {
                  text_to_show = 'Done';
            }
            element.innerHTML = `<th scope="row" style="margin-top: 2%;">${id}</th>
            <td style="margin-top: 2%;">${title}</td>
            <td style="margin-top: 2%;">${text_to_show}</td>`;
            element.appendChild(deleteButtonTableData);
            element.appendChild(updateButton);
            return element;
      };

      const login = (email, password) => {
            let url = `${BASE_URL}auth/cookie/login`;

            const data = {
                  email: email,
                  password: password
            };

            options.method = 'POST';
            options.body = JSON.stringify(data);
            fetch(url, options)
                  .then(response => {
                        if (response.status === 200 && response) {
                              console.log('Login erfolgreich');
                              if (response.ok === true) {
                                    window.location.href = 'dashboard.html';
                              } else {
                                    alert('Falsches E-Mail oder Passwort!');
                              }
                        } else {
                              error();
                        }
                  });
      };

      const updateTask = (id, new_title) => {
            let url = `${BASE_URL}tasks`;

            const data = {
                  id: id,
                  title: new_title
            };

            options.method = 'PUT';
            options.body = JSON.stringify(data);
            fetch(url, options);
      };

      // Method to get completed Tasks
      const getCompletedTasks = () => {
            clean(tasksList);
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(commits => {
                        if (!commits.length === 0) {
                              const completedTasks = commits.filter(task => {
                                    task.completed === 'true';
                              });
                              completedTasks.forEach((task) => {
                                    const deleteButton = document.createElement("td");
                                    deleteButton.innerHTML = "<button scope='row' class='btn btn-danger'>Delete</button>";
                                    deleteButton.addEventListener('click', () => {
                                          deleteTask(task.id);
                                    });
                                    let updateButton = document.createElement("button");
                                    updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'
                                    updateButton.style.marginTop = '2%';
                                    updateButton.style.marginLeft = '2%';
                                    updateButton.setAttribute('class', 'btn btn-primary');
                                    updateButton.setAttribute('scope', 'row');
                                    updateButton.addEventListener('click', () => {
                                          updateTask(task.id, prompt('Enter a new title for the task'));
                                    });
                                    tasksList.appendChild(createTaskElement(task.id, task.completed, task.title, deleteButton, updateButton));
                              });
                        }
                  });

      };

      // Method to get uncompleted Tasks
      const getUncompletedTasks = () => {
            clean(tasksList);
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(tasks => {

                        const uncompletedTasks = tasks.filter((task) => {
                              task.completed === 'true';
                        });

                        uncompletedTasks.forEach((task) => {
                              let deleteButton = document.createElement("button");
                              deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>";
                              deleteButton.setAttribute('class', 'btn btn-danger');
                              deleteButton.setAttribute('scope', 'row');
                              deleteButton.addEventListener('click', () => {
                                    deleteTask(task.id);
                              });
                              deleteButton.style.marginTop = '2%';
                              deleteButton.style.marginLeft = '2%';

                              let updateButton = document.createElement("button");
                              updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'
                              updateButton.style.marginTop = '2%';
                              updateButton.style.marginLeft = '2%';
                              updateButton.setAttribute('class', 'btn btn-primary');
                              updateButton.setAttribute('scope', 'row');
                              updateButton.addEventListener('click', () => {
                                    updateTask(task.id, prompt('Enter a new title for the task'));
                              });
                              tasksList.appendChild(createTaskElement(task.id, task.completed, task.title, deleteButton, updateButton));
                        });
                  });
      };

      // Method to get all Tasks
      const getAllTasks = () => {
            clean(tasksList);
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(tasks => {
                        tasks.forEach((task) => {
                              let deleteButton = document.createElement("button");
                              deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>";
                              deleteButton.setAttribute('class', 'btn btn-danger');
                              deleteButton.setAttribute('scope', 'row');
                              deleteButton.addEventListener('click', () => {
                                    deleteTask(task.id);
                              });
                              deleteButton.style.marginTop = '2%';
                              deleteButton.style.marginLeft = '2%';
                              let updateButton = document.createElement("button");
                              updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>'
                              updateButton.addEventListener('click', () => {
                                    updateTask(task.id, prompt('Enter a new title for the task'));
                              });
                              updateButton.style.marginTop = '2%';
                              updateButton.style.marginLeft = '2%';
                              updateButton.setAttribute('class', 'btn btn-primary');
                              updateButton.setAttribute('scope', 'row');
                              tasksList.appendChild(createTaskElement(task.id, task.completed, task.title, deleteButton, updateButton));
                        });
                  });
      };

      // Method to get a specific Task
      const getSpecificTask = (id) => {
            let url = `${BASE_URL}task/${id}`;

            fetch(url, options)
                  .then(response => {
                        if (response.status === 404) {
                              error();
                        } else {
                              return response.json();
                        }
                  })
                  .then(task => {
                        const deleteButtonTableData = document.createElement("td");
                        const deleteButton = document.createElement('button');
                        deleteButton.innerText = "Delete";
                        deleteButton.classList.add('btn', 'btn-danger');
                        deleteButton.setAttribute('scope', 'row');
                        deleteButton.addEventListener('click', () => {
                              deleteTask(task.id);
                        });
                        tasksList.appendChild(createTaskElement(task.id, task.completed, task.title, deleteButtonTableData));
                  });
      };

      const createTask = (title) => {
            let url = `${BASE_URL}auth/cookie/tasks`;

            let task = {
                  'title': title
            };

            options.method = 'POST';
            options.body = JSON.stringify(task);
            fetch(url, options)
                  .then(response => {
                        console.log(response);
                  });
      };

      const deleteTask = (id) => {
            let url = `${BASE_URL}auth/cookie/task/${id}`;

            options.method = 'DELETE';
            fetch(url, options);
      };

      // -------------------------------------------------------------------
      // Display all tasks in all cases once the page loads
      if (window.location.href === 'http://127.0.0.1:5500/src/dashboard.html') {
            const dashboardBody = document.querySelector('#dashboardBody');
            dashboardBody.addEventListener('load', getAllTasks());
            // Add Event Listener for the Selection of the Filtering method
            const selectFilterMethod = document.querySelector('#selectFilterMethod');

            // Add Event Listener for the Filter Button
            const filterButton = document.querySelector('#filterButton');
            selectFilterMethod.addEventListener('blur', (event) => {
                  let idField = document.querySelector('#askForTaskID');
                  let idInput = document.querySelector('#taskID');
                  filterMethod = event.target.value;
                  if (filterMethod === 'specificTask') {
                        idField.classList.remove('hidden');
                  } else {
                        idField.classList.add('hidden');
                  }

                  filterButton.addEventListener(('click'), () => {
                        switch (filterMethod) {
                              case "all":
                                    clean(tasksList);
                                    getAllTasks();
                                    break;
                              case "done":
                                    clean(tasksList);
                                    getCompletedTasks();
                                    break;
                              case "due":
                                    clean(tasksList);
                                    getUncompletedTasks();
                                    break;
                              case "specificTask":
                                    clean(tasksList);
                                    getSpecificTask(idInput.value);
                                    break;
                              default:
                                    error();
                                    break;
                        }
                  });
            });

            // Method: createTask
            const createTaskButton = document.querySelector('#createTaskButton');
            const taskTitle = document.querySelector('#taskTitle');
            createTaskButton.addEventListener('click', () => {
                  createTask(taskTitle.value);
            });

            // TODO: Add Checkbox to mark a task as completed
            


            // Add Event Listener for the Create Task Button
      } else if (window.location.href === 'http://127.0.0.1:5500/src/login.html') {
            const loginButton = document.getElementById('loginButton');
            loginButton.addEventListener('click', (event) => {
                  event.preventDefault();
                  let email = document.querySelector('#emailInput').value;
                  let password = document.querySelector('#passwordInput').value;
                  login(email, password);
            });
      }

      const logoutButton = document.querySelector('#logoutButton');
      logoutButton.addEventListener('click', () => {
            options.method = 'POST';
            fetch(`${BASE_URL}auth/cookie/logout`, options)
                  .then(response => {
                        if (response.status === 200) {
                              alert('Logout erfolgreich');
                              window.location.href = 'index.html';
                        } else {
                              error();
                        }
                  });
      });
});