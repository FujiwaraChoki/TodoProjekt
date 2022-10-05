const BASE_URL = "http://127.0.0.1:3000/";
const tasksLists = document.querySelector("#taskTable");
let filterMethod;

// Method to create a new task
const createTaskElement = (id, completed, title) => {
      let element = document.createElement("tr");
      let text_to_show = "Due";
      if(completed) {
            text_to_show = "Done";
      }
      element.innerHTML = `<th scope="row">${id}</th>
      <td>${title}</td>
      <td>${text_to_show}</td>`;
      return element;
}

// Method to return all tasks from the local server
const getTasks = (url_extension) => {
      const url = `${BASE_URL}${url_extension}`;
      const options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(url, options)
      .then(response => {
            return response.json();
      })
};

const getCompletedTasks = () => {
      const completedTasks =  getTasks('tasks').filter(task => {task.completed});
      completedTasks.forEach((task) => {
            tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
      });
};

const getUncompletedTasks = () => {
      const completedTasks =  getTasks('tasks').filter(task => task.completed === false);
      completedTasks.forEach((task) => {
            tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
      });
};

const getAllTasks = () => {
      const data = getTasks('tasks');
      data.forEach((task) => {
            tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
      });
};

const getSpecificTask = (id) => {
      const data = getTasks('task');
      const task = data.filter(task => task.id === id);
      tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
};


document.addEventListener('DOMContentLoaded', () => {
      // Display all tasks in all cases once the page loads
      const dashboardBody = document.querySelector('#dashboardBody');
      dashboardBody.addEventListener('load', getTasks('tasks'));
      
      // Add Event Listener for the Selection of the Filtering method
      const selectFilterMethod = document.querySelector('#selectFilterMethod');
      // Add Event Listener for the Filter Button
      const filterButton = document.querySelector('#filterButton');
      selectFilterMethod.addEventListener('blur', (event) => {
            let idField = document.querySelector('#askForTaskID');
            filterMethod = event.target.value;
            if(filterMethod === "specificTask") {
                  // This needs some extra work to get the ID of the task
                  
                  idField.classList.remove('hidden');
            } else {
                  idField.classList.add('hidden');
            }

            filterButton.addEventListener(('click'), () => {
                  switch(filterMethod) {
                        case "all":
                              getTasks();
                              break;
                        case "done":
                              getCompletedTasks();
                              break;
                        case "due":
                              getUncompletedTasks();
                              break;
                        case "specificTask":
                              getSpecificTask(idField.value);
                              break;
                  }
            });
      });
});