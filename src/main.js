const BASE_URL = "http://127.0.0.1:3000/";
let tasksLists = document.querySelector("#tasksTable");
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
};

const getCompletedTasks = () => {
      let url = `${BASE_URL}tasks`;
      let options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(url, options)
            .then(response => response.json())
            .then(commits => {
                  const completedTasks = commits.filter(task => {
                        task.completed === true
                  });
                  completedTasks.forEach((task) => {
                        tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
                  });
            });

};

const getUncompletedTasks = () => {
      let url = `${BASE_URL}tasks`;
      let options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(url, options)
            .then(response => response.json())
            .then(commits => {
                  const uncompletedTasks =  commits.filter(task => {task.completed === false});
                  uncompletedTasks.forEach((task) => {
                        tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
                  });
            });
};

const getAllTasks = () => {
      let url = `${BASE_URL}tasks`;
      let options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(url, options)
            .then(response => response.json())
            .then((tasks) => {
                  tasks.forEach((task) => {
                        // ! TODO Fix Please
                        console.log(tasksLists);
                        tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
                  });
            });

};

const getSpecificTask = (id) => {
      let url = `${BASE_URL}task/${id}`;
      let options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(url, options)
            .then(response => response.json())
            .then(commits => {
                  tasksLists.appendChild(createTaskElement(commits.id, commits.completed, commits.title));
            });
};


document.addEventListener('DOMContentLoaded', () => {
      console.log(tasksLists);
      // Display all tasks in all cases once the page loads
      const dashboardBody = document.querySelector('#dashboardBody');
      dashboardBody.addEventListener('load', getAllTasks());
      
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
                              getAllTasks();
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