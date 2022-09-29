const input_txt = document.getElementById("todotxt");
const add_btn = document.querySelector(".add-btn");
const deleteAllBtn = document.querySelector(".deleteAll");
const todolst = document.getElementById("todo-view");
const clear_btn = document.querySelector("#clear-btn");
const loginpromt = document.querySelector(".signuppromt");
const todoinput = document.getElementById("todolist");
const usernametag = document.querySelector(".name-tag p");
var allTodos = [];

let ref = localStorage.getItem("auth-token");
function getTodos() {
  if (ref) {
    axios
      .get("http://localhost:3000/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": ref,
        },
      })
      .then((data) => {
        usernametag.innerText = data.data.name;
      })
      .catch((err) => console.error(err));

    fetch("http://localhost:3000/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": ref,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((todos) => {
        todos.forEach((todo) => {
          renderTodo(todo);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    window.location.href = "loginsignup.html";
  }
}
function signout() {
  localStorage.removeItem("auth-token");
  window.location.href = "loginsignup.html";
}

var todos = [];
function addTodo() {
  axios
    .post(
      "http://localhost:3000/todos/create",
      {
        text: input_txt.value,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": ref,
        },
      }
    )

    .then((data) => {
      renderTodo(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function renderTodo(todo) {
  const li = document.createElement("li");
  const deleteIcon = document.createElement("img");
  const text = document.createTextNode(todo.text);

  li.setAttribute("data-id", todo._id);

  li.append(text);
  if (todo.deleted) {
    todolst.remove(li);
    return;
  }
  // TodosDone(todos);

  todolst.appendChild(li);
  deleteIcon.src = "./img/delete (1).png";
  deleteIcon.style.width = "2em";
  deleteIcon.style.height = "2em";
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.justifyContent = "space-between";
  li.append(deleteIcon);

  deleteIcon.addEventListener("click", () => {
    deleteTodo(todo._id);
  });

  li.addEventListener("click", () => {
    TickTodo(todo._id);
    if (li.style.textDecoration == "") {
      li.style.textDecoration = "line-through";
    } else {
      //set the textdecoration to null
      li.style.textDecoration = "";
    }
  });
  if (todo.checked) {
    if (li.style.textDecoration == "") {
      li.style.textDecoration = "line-through";
    } else {
      //set the textdecoration to null
      li.style.textDecoration = "";
    }
  }
}
function TickTodo(key) {
  axios
    .patch(`http://localhost:3000/todos/${key}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": ref,
      },
    })
    .then((todo) => {
      console.log(todo);
    })
    .catch((err) => {
      console.log(err);
    });
}
function deleteTodo(key) {
  axios
    .delete(`http://localhost:3000/todos/${key}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": ref,
      },
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        text: "Todo deleted",
      });
      setTimeout(() => {
        window.location.href = "index.html";
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteAll() {
  axios.get("http://localhost:3000/todos", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-token": ref,
    },
  }).then((todos) => {
    todos.forEach((todo) => {
      deleteTodo(todo._id);
    });
    console.log(todos)
  }).catch(err => {
    console.error(err)
  })

  
  // setTimeout(() => {
  //   window.location.href = "index.html";
  // }, 1000);
  
}

deleteAllBtn.addEventListener('click', deleteAll)

// todos.push(todo_data);
// localStorage.setItem("Todos", JSON.stringify(todos));

add_btn.addEventListener("click", () => {
  if (input_txt.value.trim() !== "") {
    addTodo();
    input_txt.value = "";
    input_txt.focus();
  }
});

window.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (input_txt.value.trim() !== "") {
      addTodo(input_txt.value);
      input_txt.value = "";
      input_txt.focus();
    }
  }
});
const lis = document.querySelector("#todo-view li");

//Dark mode feature
function Darkmode() {
  const todobtns = document.querySelectorAll(".user-inp button");
  const body = document.body;
  todobtns.forEach((btn) => {
    if (body.classList.contains("dark")) {
      btn.style.color = "black";
    } else {
      btn.style.color = "white";
    }
  });
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
  } else {
    body.classList.add("dark");
  }
}
window.onload = () => {
  getTodos();
  // TodosDone(todos);
};
