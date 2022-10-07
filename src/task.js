document.addEventListener('DOMContentLoaded', () => {

      const BASE_URL = "http://localhost:3000/";
      const TASKSLIST = document.getElementById('tasksTable');
      const OPTIONS = {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
            'Content-Type': 'application/json'
      })
      };
      let resultFromQuery = [];

      const clearScreen = () => {
            let children = TASKSLIST.children;
            for (let child of children) {
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
                              if (!(filter === 'all')) {
                                    clearScreen();
                              }

                              let tableRow = document.createElement('tr');

                              // Check if the task is completed or not and set the status_display variable accordingly.
                              status_display = currentTask.completed ? 'Erledigt' : 'Offen';

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
                              if (currentTask.completed) {
                                    checkboxElement.setAttribute('checked', true);
                              } else {
                                    checkboxElement.setAttribute('checked', false);
                              }

                              idElement.innerText = currentTask.id;
                              titleElement.innerText = currentTask.title;
                              statusElement.innerText = status_display;
                              deleteButton.classList.add('btn', 'btn-danger');
                              deleteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>";
                              deleteButton.style.marginLeft = '-100px';
                              updateButton.classList.add('btn', 'btn-primary');
                              updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
                              updateButton.style.marginRight = '-200px';
                              // Event Listeners

                              // When user clicks on the checkbox, update the task to the given status accordingly.
                              checkboxElement.addEventListener('change', () =>
                                    updateTask({ ...currentTask, completed: !currentTask.completed })
                              );

                              checkboxElement.checked = currentTask.completed;

                              // If the user clicks the update button, call the updateTask function.
                              updateButton.addEventListener('click', () => {
                                    let new_title = prompt('Neuer Titel: ');
                                    updateTask({ ...currentTask, title: new_title });
                              });

                              // If the user clicks the delete button, call the deleteTask function.
                              deleteButton.addEventListener('click', () => {
                                    deleteTask(currentTask.id);
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

      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      const taskId = params.get('id');

      if (taskId) {
            renderTasks(taskId, 'specificTask');
      }

});