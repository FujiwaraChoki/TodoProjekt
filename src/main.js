const BASE_URL = "http://127.0.0.1:3000/";
let filterMethod;
const options = {
      method: 'GET',
      headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
      })
};

document.addEventListener('DOMContentLoaded', () => {
      // Variables we need from the beginning
      const tasksList = document.getElementById('tasksTable');

      /*
      Declare functions here
      */
      const error = () => {
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      };

      const clean = (tasksList) => {
            // remove all children elements from tasksList
            while (tasksList.firstChild) {
                  tasksList.removeChild(tasksList.firstChild);
            }
      };

      // Method to create a new task
      const createTaskElement = (id, completed, title) => {
            let element = document.createElement("tr");
            let text_to_show = 'Due';
            if (completed === 'true') {
                  text_to_show = 'Done';
            }
            element.innerHTML = `<th scope="row">${id}</th>
            <td>${title}</td>
            <td>${text_to_show}</td>`;
            return element;
      };

      const setCookie = (name, value, days) => {
            var expires = "";
            if (days) {
                  var date = new Date();
                  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                  expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
      }

      const eraseCookie = (name) => {
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }

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
                              alert('Login erfolgreich');
                              setCookie('login', 'true', 1);
                              setCookie('email', email, 1);
                              setCookie('password', password, 1);
                              window.location.href = 'dashboard.html';
                        } else {
                              error();
                        }
                  });
      };

      // Method to get completed Tasks
      const getCompletedTasks = () => {
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(commits => {
                        if (!commits.length === 0) {
                              const completedTasks = commits.filter(task => {
                                    task.completed === 'true';
                              });
                              completedTasks.forEach((task) => {
                                    tasksList.appendChild(createTaskElement(task.id, task.completed, task.title));
                              });
                        }
                  });

      };

      // Method to get uncompleted Tasks
      const getUncompletedTasks = () => {
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(tasks => {

                        const uncompletedTasks = tasks.filter((task) => {
                              task.completed === 'true';
                        });

                        uncompletedTasks.forEach((task) => {
                              tasksList.appendChild(createTaskElement(task.id, task.completed, task.title));
                        });
                  });
      };

      // Method to get all Tasks
      const getAllTasks = () => {
            let url = `${BASE_URL}auth/cookie/tasks`;

            fetch(url, options)
                  .then(response => response.json())
                  .then(tasks => {
                        tasks.forEach((task) => {
                              tasksList.appendChild(createTaskElement(task.id, task.completed, task.title));
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
                        tasksList.appendChild(createTaskElement(task.id, task.completed, task.title));
                  });
      };

      // -------------------------------------------------------------------
      // Display all tasks in all cases once the page loads
      if (window.location.href === 'http://localhost:5500/src/dashboard.html') {
            if (document.cookie.indexOf('login=true') === -1) {
                  window.location.href = 'index.html';
            }
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
      } else if (window.location.href === 'http://localhost:5500/src/login.html') {
            const loginButton = document.getElementById('loginButton');
            loginButton.addEventListener('click', (event) => {
                  event.preventDefault();
                  let email = document.querySelector('#emailInput').value;
                  let password = document.querySelector('#passwordInput').value;
                  login(email, password);
            });
      }
});