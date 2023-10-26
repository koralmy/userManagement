const usersList = document.getElementById("usersList");

const nameInput = document.getElementById("name");
nameInput.addEventListener("input", () => validateAddUserForm());

const emailInput = document.getElementById("email");
emailInput.addEventListener("input", () => validateAddUserForm());

const addBtn = document.getElementById("add");
addBtn.addEventListener("click", addUser);

validateAddUserForm();

function validateAddUserForm() {
  const name = nameInput.value;
  const email = emailInput.value;

  if (validateUserInputs(email, name)) {
    addBtn.removeAttribute("disabled");
  } else {
    addBtn.setAttribute("disabled", true);
  }
}

function fetchUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((users) => {
      usersList.innerHTML = "";
      users.forEach((user) => appendUserToList(user));
    });
}

function appendUserToList(user) {
  const userElement = document.createElement("div");
  userElement.className = "user";
  userElement.innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <button class="edit" data-id="${user.id}">Edit</button>
        <button class="delete" data-id="${user.id}">Delete</button>
    `;
  usersList.appendChild(userElement);

  const deleteButton = userElement.querySelector(".delete");
  deleteButton.addEventListener("click", deleteUser);

  const editButton = userElement.querySelector(".edit");
  editButton.addEventListener("click", editUser);
}

function addUser() {
  const name = nameInput.value;
  const email = emailInput.value;

  const newUserPayload = {
    name,
    email,
  };

  fetch(`https://jsonplaceholder.typicode.com/users`, {
    method: "POST",
    body: JSON.stringify(newUserPayload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((user) => {
      nameInput.value = "";
      emailInput.value = "";
      validateAddUserForm();
      appendUserToList(user);
    });
}

function deleteUser(event) {
  const userId = event.target.getAttribute("data-id");
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.ok) {
      const userCard = event.target.parentElement;
      userCard.remove();
    } else {
      console.error("Could not delete user with id: " + userId);
    }
  });
}

function editUser(event) {
  const userId = event.target.getAttribute("data-id");
  const userCard = event.target.parentElement;

  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  const name = userCard.querySelector("h3").innerText;
  const email = userCard.querySelector("p").innerText;

  modal.querySelector(".modal-content").innerHTML = `
        <span class="close">&times;</span>
        <h2>Update user: ${name}</h2>
        <div class="form">
            <label for="modal-name">Full name:</label>
            <input type="text" id="modal-name" value="${name}" />
            <label for="modal-email">Email:</label>
            <input
                type="email"
                name="modal-email"
                id="modal-email" 
                value="${email}"
            />
            <button id="modal-edit-btn">Update</button>
        </div>
    `;

  const nameInput = modal.querySelector("#modal-name");
  const emailInput = modal.querySelector("#modal-email");
  nameInput.addEventListener("input", (event) => {
    validateEditUserModal();
  });

  emailInput.addEventListener("input", (event) => {
    validateEditUserModal();
  });

  const closeModalBtn = modal.querySelector(".close");
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  const modalEditBtn = modal.querySelector("#modal-edit-btn");
  modalEditBtn.addEventListener("click", function () {
    const updateUserPayload = {
      name: modal.querySelector("#modal-name").value,
      email: modal.querySelector("#modal-email").value,
    };

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(updateUserPayload),
    }).then((res) => {
      if (res.ok) {
        modal.style.display = "none";
        userCard.querySelector("h3").innerText = updateUserPayload.name;
        userCard.querySelector("p").innerText = updateUserPayload.email;
      } else {
        console.error("Could not edit user with id: " + userId);
      }
    });
  });
}

fetchUsers();

function validateEditUserModal() {
  const modal = document.getElementById("myModal");
  const modalEditBtn = modal.querySelector("#modal-edit-btn");
  const nameInput = modal.querySelector("#modal-name");
  const emailInput = modal.querySelector("#modal-email");

  if (validateUserInputs(emailInput.value, nameInput.value)) {
    modalEditBtn.removeAttribute("disabled");
  } else {
    modalEditBtn.setAttribute("disabled", true);
  }
}

function validateUserInputs(email, name) {
  return validateEmail(email) && validateName(name);
}

function validateEmail(email) {
  if (!email) return false; // if email is null, undefiend, ''

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateName(name) {
  if (!name) return false;

  const nameParts = name.split(" "); // "Omer Tashir" ==> ["Omer", "Tashir"]
  return nameParts.length >= 2 && nameParts.every((name) => !!name);
}
