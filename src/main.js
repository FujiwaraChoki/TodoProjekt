const BASE_URL = "http://127.0.0.1:3000/";

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

const getTasks = () => {
      const tasksLists = document.querySelector("div table #taskTable");
      let url = BASE_URL + "tasks";
      const options = {
            method: "GET",
            headers: new Headers({
                  'Content-Type': 'application/json'
            })
      };
    
      fetch(`${url}`, options)
      .then(response => response.json())
      .then(data => {
            data.forEach((task) => {
                  tasksLists.appendChild(createTaskElement(task.id, task.completed, task.title));
            });
      });
};


document.addEventListener('DOMContentLoaded', () => {

});