window.onload = () => {
  tasks.forEach((item) => (item.state = "show"));
  Task.display();
};

let tasks = [];
const getTasks = localStorage.getItem("tasks");
if (getTasks) tasks = JSON.parse(getTasks);

let accounts = [];
const getAccounts = localStorage.getItem("accounts");

if (getAccounts) accounts = JSON.parse(getAccounts);

const input = document.getElementById("task"),
  request_demo = document.getElementById("request_demo")
register_btn = document.getElementById("signupreal"),
  register_text = document.getElementById("registerClass"),
  createBtn = document.getElementById("create-task"),
  search_btn = document.getElementById("search-task"),
  refresh = document.getElementById("refresh"),
  clear__all = document.querySelector(".clear__all");
login_text = document.querySelector(".loginClass");
login_btn = document.querySelector(".signinreal");
title = document.getElementById("title");
filters = document.querySelectorAll(".form-check-input");


let isLogined = localStorage.getItem("isLogined") === "true";
if (isLogined) {
  login_text.innerHTML = "Logout";
} else {
  window.location.href = "login.html";
  localStorage.setItem("isLogined",false);
}

const getPlant = (plan) => {

  if (plan == "free") return "premium";
  else return "free";
};

const getName = localStorage.getItem("name");
let user = {};
if (getName) {
  user = accounts.filter((e) => e.name == getName)[0];
}

register_text.innerHTML = "Plan " + user.plan;


class Task {
  // display tasks
  static display() {
    console.log(tasks);
    const tasks_container = document.getElementById("tasks");
    let _tasks = "";
    tasks.forEach((task, index) => {
      _tasks += ` 


                <div class="action btns ${
                  task.state === "show"
                    ? "gridTemplate"
                    : "d-none"
                } ${
        task.completed === "true" ? "text-decoration-line-through" : "text-dark"
      }">
                    
                    <h4>${task.title}</h4>
                    <div class="d-flex justify-content-between align-items-center" style="margin-bottom:1rem">
                        <span style="color:green">create at: ${this.unixTimeToHumanReadable(task.create_at)} </span>
                        update at: ${this.unixTimeToHumanReadable(task.update_at)}
                    </div>
                    <div class="d-flex justify-content-left align-items-center">
                        <button style="margin-right: 1rem" type="button" class="btn btn-sm btn-success is__completed" onclick="Task.todoCompleted('${
                          task.id
                        }')"><i class="fa-solid fa-circle-check"></i></button>
                        <button style="margin-right: 1rem" type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${
                          task.id
                        }')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button style="margin-right: 1rem" type="button" class="btn btn-sm btn-danger ms-1 delete" onclick="Task.delete('${
                          task.id
                        }')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div> 

                <div class="task-item ${
                  task.state === "show"
                    ? "mt-2 d-flex justify-content-between align-items-center"
                    : "d-none"
                }">
                    <div class="task-name">
                        <p  id="task__name">${task.name}</p>
                    </div>
                </div>
                <br/>
            `;
    });
    tasks.length === 0 || _tasks === "" ?
      clear__all.classList.add("d-none") :
      clear__all.classList.remove("d-none");
    tasks_container.innerHTML = _tasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // create task
  static create(task, title) {
    const generateRandomId = Math.floor(Math.random() * 99999);
    tasks.push({
      id: generateRandomId,
      name: task,
      title: title,
      completed: "false",
      state: "show",
      create_at: Math.round(+new Date() / 1000),
      update_at: Math.round(+new Date() / 1000),
    });
    this.display();
  }

  // completed
  static todoCompleted(task) {
    tasks.forEach((item) => {
      if (`${item.id}` === task) {
        if (item.completed === "false") item.completed = "true";
        else item.completed = "false";
      }
    });

    this.display();
  }

  // update/edit task
  static update(task) {
    const taskItems = document.querySelectorAll(".task-item");
    const taskInput = document.getElementById("task-input");
    const edit = document.querySelectorAll(".task-name");

    tasks.forEach((item, index) => {
      if (`${item.id}` === task) {
        taskItems[index].classList.add("task-editing");
        edit[index].innerHTML = `
                    <input type="text" id="task-title-${task}" class="form-control" value="${item.title}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                
                    <textarea id="task-name-${task}" style="margin-top:5px" >${item.name}</textarea>
                        
                    <button id="save-${task}" type="button" class="btn btn-primary">Edit This</button>
                `;

        const taskInputs = document.getElementById(`task-name-${task}`);
        const titleInputs = document.getElementById(`task-title-${task}`);

        const saveEditTodo = document.getElementById(`save-${task}`);

        if (taskInputs && titleInputs) {
          saveEditTodo.addEventListener("click", (e) => {
            let input_value = taskInputs.value;
            let title_value = titleInputs.value;
            if (input_value && title_value) {
              item.name = input_value;
              item.title = title_value;
              item.update_at = Math.round(+new Date() / 1000);
              this.display();
            } else {
              showError(".error", "Edit Field Cannot be Empty!");
            }
          });
        }
      }
    });
  }

  // delete task
  static delete(task) {
    tasks = tasks.filter((item) => `${item.id}` !== task);

    // tasks.forEach((item, index) => {
    //     if(`${item.id}` === task) {
    //         tasks.splice(index, 1)
    //     }
    // });
    this.display();
  }

  // search task
  static search(task) {

    tasks = tasks.filter((item) =>
      item.title.toLowerCase() === task.toLowerCase() ?
      (item.state = "show") :
      (item.state = "hide")
    );

    const checkTask = (element) =>
      element.title.toLowerCase() === task.toLowerCase();
    if (tasks.some(checkTask) === false) {
      tasks.forEach((item) => {
        item.state = "hide"
      });
    }
    this.display();
  }

  static unixTimeToHumanReadable(seconds) {
    seconds = seconds + 7 * 60 * 60;
    // Save the time in Human
    // readable format
    let ans = "";

    // Number of days in month
    // in normal year
    let daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let currYear,
      daysTillNow,
      extraTime,
      extraDays,
      index,
      date,
      month,
      hours,
      minutes,
      secondss,
      flag = 0;

    // Calculate total days unix time T
    daysTillNow = parseInt(seconds / (24 * 60 * 60), 10);
    extraTime = seconds % (24 * 60 * 60);
    currYear = 1970;

    // Calculating current year
    while (daysTillNow >= 365) {
      if (currYear % 400 == 0 || (currYear % 4 == 0 && currYear % 100 != 0)) {
        daysTillNow -= 366;
      } else {
        daysTillNow -= 365;
      }
      currYear += 1;
    }

    // Updating extradays because it
    // will give days till previous day
    // and we have include current day
    extraDays = daysTillNow + 1;

    if (currYear % 400 == 0 || (currYear % 4 == 0 && currYear % 100 != 0))
      flag = 1;

    // Calculating MONTH and DATE
    month = 0;
    index = 0;
    if (flag == 1) {
      while (true) {
        if (index == 1) {
          if (extraDays - 29 < 0) break;

          month += 1;
          extraDays -= 29;
        } else {
          if (extraDays - daysOfMonth[index] < 0) {
            break;
          }
          month += 1;
          extraDays -= daysOfMonth[index];
        }
        index += 1;
      }
    } else {
      while (true) {
        if (extraDays - daysOfMonth[index] < 0) {
          break;
        }
        month += 1;
        extraDays -= daysOfMonth[index];
        index += 1;
      }
    }

    // Current Month
    if (extraDays > 0) {
      month += 1;
      date = extraDays;
    } else {
      if (month == 2 && flag == 1) date = 29;
      else {
        date = daysOfMonth[month - 1];
      }
    }

    // Calculating HH:MM:YYYY
    hours = parseInt(extraTime / 3600, 10);
    minutes = parseInt((extraTime % 3600) / 60, 10);
    secondss = parseInt((extraTime % 3600) % 60, 10);

    ans += date.toString();
    ans += "/";
    ans += month.toString();
    ans += "/";
    ans += currYear.toString();
    ans += " ";
    ans += hours.toString();
    ans += ":";
    ans += minutes.toString();
    ans += ":";
    ans += secondss.toString();

    // Return the time
    return ans;
  }
}

// Create Btn
createBtn.addEventListener("click", (e) => {
  const input_value = input.value;
  const input_title = title.value;
  if (input_value !== "" && input_title !== "") {
    input.value = "";
    title.value = "";
    Task.create(input_value, input_title);
  } else {
    showError(".error", "Cannot Add Todo!");
  }
});

// Search Btn
search_btn.addEventListener("click", (e) => {
  let task = title;
  let search_value = title.value;

  if (search_value != "") {
    task.style.border = "1px solid gray";
    input.value = "";
    Task.search(search_value.toLowerCase());
  } else {
    showError(".error", "Search Field Cannot be Empty!");
    task.style.border = "1px solid red";
  }
});

// Prevent from Submit-ing the Form
let form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Keyboard Support Enter Key (To add a Task) and > Right Arrow (to Search)
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createBtn.click();

  if (e.key === "ArrowRight") search_btn.click();
});

// Errors Function
function showError(error_place, error_message) {
  const error_container = document.querySelector(error_place);
  if (error_container) {
    error_container.innerHTML = `
            <div class="alert alert-danger error" role="alert">
                ${error_message}
            </div>
        `;
    setTimeout(() => (error_container.innerHTML = ""), 0);
  }
}

// Clear All Btn
function clearAll() {
  tasks = [];
  Task.display();
}

clear__all.addEventListener("click", clearAll);

register_text.addEventListener("click", () => {


  accounts.map((o) => {
    if (o.name == user.name) {

      o.plan = getPlant(o.plan)
    }

  });
  localStorage.setItem("accounts", JSON.stringify(accounts))
  location.reload();

});

login_text.addEventListener("click", () => {
  // alert("Clicked Login!");
  setTimeout(function () {
    window.location.href = "login.html";
  }, 0);
});

filters.forEach((item) => {
  item.addEventListener("change", (event) => {
    console.log(item.id);
    if (item.id == "completed") {
      tasks = tasks.filter((item) =>
        item.completed.toLowerCase() != "false" ?
        (item.state = "show") :
        (item.state = "hide")
      );
    } else if (item.id == "uncompleted") {
      tasks = tasks.filter((item) =>
        item.completed.toLowerCase() == "false" ?
        (item.state = "show") :
        (item.state = "hide")
      );
    } else {
      tasks = tasks.filter((item) => (item.state = "show"));
    }
    Task.display();
  });
});


// Refresh Page
refresh.addEventListener("click", (e) => {
  location.href = location.href
});


request_demo.addEventListener("click", (e) => {
  window.location.href = "request.html";
})