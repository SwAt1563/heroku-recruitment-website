// FOR SHUFFLE AN ARRAY
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// FOR SAVE THE ENTIRE EMPLOYEE ID
function saveId(element, id) {
  localStorage.setItem("empId", id);
  location.replace("employee.html");
}

// FOR CREATE TITLE BAR IN THE EMPLOYEE PAGE
function createTitle(emp) {
  return `
      <h2>${emp.nickname}</h2>
      <span class="hired" onclick="changeState(this, '${
        emp.name
      }')">${emp.hire.toUpperCase()}</span>
      `;
}

// FOR FILL THE CONTENT OF AN EMPLOYEE IN THE EMPLOYEE PAGE
function createEmp(emp) {
  return `
          
      <img src="${emp.img}" alt="${emp.nickname}" class="std">
  
      <dl>
          <dt>Name:</dt>
          <dd>${emp.name}</dd>
  
          <dt>Portrayed:</dt>
          <dd>${emp.portrayed}</dd>
  
          <dt>Status:</dt>
          <dd>${emp.status}</dd>
      </dl>
      `;
}

// FOR MAKE CONTAINERS FOR THE EMPLOYEES
function createContainer(emp) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return `
      <div class="container" onclick="saveId(this, '${emp.name}')">
          
      <div class="left-side">
          <img src="${emp.img}" alt="${emp.nickname}"/>
          <h3>${emp.nickname}</h3>
      </div>
      <div class="right-side">
          <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
           Tempore iusto doloribus dolore quia enim voluptates optio veniam mollitia
            deserunt asperiores placeat at nihil natus dolor a eaque, et velit! Quo?
          Id dicta atque pariatur molestiae laborum, 
          soluta nulla quos voluptates nesciunt voluptatum optio laboriosam quia perferendis
           esse ea veritatis odit a quas alias itaque explicabo debitis. Architecto neque odio libero?
          Qui labore eaque asperiores nostrum dolorum nulla. 
          Voluptatem ut eius quam, voluptatum reiciendis id
           delectus laboriosam reprehenderit omnis harum fugiat vel! 
           Aspernatur quia neque quis nam velit voluptas quasi fugiat.
      </p>
      </div>
  
      <span class="state">${capitalizeFirstLetter(emp.hire)}</span>
      </div>
      `;
}

// FOR SEARCH ABOUT AN EMPLOYEE DEPEND ON THE NAME
function search() {
  input = document.querySelector(".search-content");
  filter = input.value.toLowerCase();

  if (filter == "") {
    location.replace("index.html");
  } else {
    const allEmps = JSON.parse(localStorage.getItem("emps"));
    new_content = [];
    allEmps.map((emp) => {
      if (emp.name.toLowerCase().indexOf(filter) > -1) {
        new_content.push(emp);
      }
    });
    prev_content = document.querySelector(".lsem");
    prev_content.innerHTML = ``;
    new_content.map((emp) => (prev_content.innerHTML += createContainer(emp)));
  }
}

// FOR CHANGE BETWEEN 'hired' AND 'free' STATE OF AN EMPLOYEE THEN CHANGE ON THE LOCAL STORGE
function changeState(element, id) {
  function swap(current) {
    return current == "hired" ? "free" : "hired";
  }
  const allEmps = JSON.parse(localStorage.getItem("emps"));

  allEmps.map((emp) => {
    if (emp.name.indexOf(id) > -1) {
      emp.hire = swap(emp.hire);
      document.querySelector(".hired").innerHTML = emp.hire.toUpperCase();
    }
  });

  const str = JSON.stringify(allEmps);
  localStorage.setItem("emps", str);
}

// FOR GENERATE RANDOM STAUTS FOR EMPLOYEES THROUGH CREATIION
function generateRandomState() {
  let status = ["free", "hired"];
  return status[Math.floor(Math.random() * status.length)];
}

// FOR CREATE NEW LIST OF EMPLOYEE WITH REQUIRED DATA FROM THE API
function generateEmployees(data) {
  let employees = [];

  data.map((actor) => {
    let emp = {
      name: actor.name,
      nickname: actor.nickname,
      status: actor.status,
      img: actor.img,
      portrayed: actor.portrayed,
      hire: generateRandomState(),
    };
    employees.push(emp);
  });

  return employees;
}

// https://www.breakingbadapi.com/documentation
async function getAPI() {
  try {
    const response = await fetch(
      "https://www.breakingbadapi.com/api/characters?limit=20&offset=20"
    );
    const data = await response.json();
    return generateEmployees(data);
  } catch (e) {
    console.log("Wrong in API", e.message);
  }
}

// FOR SAVE THE EMPLOYEES DATA IN THE LOCAL STORGE AFTER FETCH THEM FROM THE API
async function storeEmpsInStorge() {
  const api = await getAPI();
  const str = JSON.stringify(api);
  localStorage.setItem("emps", str);
}

// ACTION WHEN LOAD THE PAGES
window.onload = function (e) {
  // GET THE CURRENT LOCATION
  let loc = location.href.split("/").pop();

  if (loc == "employee.html") {
    let empId = localStorage.getItem("empId");
    const allEmps = JSON.parse(localStorage.getItem("emps"));

    if (empId == null || allEmps == null) {
      // WHEN THERE IS LACK IN INFORMATION
      location.replace("index.html");
    } else {
      const emp = allEmps.filter((e) => e.name.indexOf(empId) > -1)[0];

      title = document.querySelector(".title");
      empContent = document.querySelector("#emp-content");

      // FILL THE CONTENT OF 'employee.html' PAGE AFTER CLICKED ON AN EMPLOYEE IN 'index.html' PAGE
      title.innerHTML = createTitle(emp);
      empContent.innerHTML = createEmp(emp);
    }
  } else if (loc == "index.html") {
    if (localStorage.getItem("emps") == null) {
      //STORE 20 EMPLOYEES FROM AN API WHEN LOAD THE PAGE AT FIRST TIME
      storeEmpsInStorge();
    } else {
      // LOAD 8 EMPLOYEES IN THE 'index.html' PAGE RANDMOLY LISTED 'alphabetically' DEPEND ON THE NAME
      const allEmps = JSON.parse(localStorage.getItem("emps"));
      shuffle(allEmps);
      const emps = allEmps.slice(0, 8);
      emps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

      content = document.querySelector(".lsem");
      emps.map((emp) => (content.innerHTML += createContainer(emp)));
    }
  }
};
