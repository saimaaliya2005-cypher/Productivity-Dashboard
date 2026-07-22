function openFeatures() {
  let allElems = document.querySelectorAll(".elem");
  let FullElemPage = document.querySelectorAll(".fullElem");
  let FullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach((elem) => {
    elem.addEventListener("click", function () {
      // console.log(elem.id);

      FullElemPage[elem.id].style.display = "block";
    });
  });

  FullElemPageBackBtn.forEach((back) => {
    back.addEventListener("click", function () {
      FullElemPage[back.id].style.display = "none";
    });
  });
}

openFeatures();

function todoList() {
  var currentTasks = [];

  if (localStorage.getItem("currentTasks")) {
    //console.log('Task list is full');
    currentTasks = JSON.parse(localStorage.getItem("currentTasks"));
  } else {
    //localStorage.setItem('currentTasks', currentTasks)
    console.log("Task list is empty");
  }

  function renderTask() {
    //localStorage.setItem('currentTasks', JSON.stringify(currentTasks));
    let allTask = document.querySelector(".allTask");

    let sum = "";

    currentTasks.forEach(function (elem, idx) {
      sum =
        sum +
        `<div class="task">
                        <h5>${elem.task} <span class = "${elem.imp}">imp</span></h5>
                        <button id=${idx}>Mark as Completed</button>
                    </div>`;
    });

    allTask.innerHTML = sum;
  }

  localStorage.setItem("currentTasks", JSON.stringify(currentTasks));

  document.querySelectorAll(".task button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentTasks.splice(btn.id, 1);

      localStorage.setItem("currentTasks", JSON.stringify(currentTasks));
      renderTask();
      location.reload();
    });
  });

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form #task-input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    currentTasks.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });

    localStorage.setItem("currentTasks", JSON.stringify(currentTasks));
    renderTask();
    //location.reload();

    taskCheckbox.checked = false;
    taskDetailsInput.value = " ";
    taskInput.value = " ";
  });
}

todoList();

function dailyPlanner() {
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var dayPlanner = document.querySelector(".day-planner");

  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  var wholeDaySum = " ";

  hours.forEach((elem, idx) => {
    var savedData = dayPlanData[idx] || "";
    wholeDaySum =
      wholeDaySum +
      `<div class="day-planner-time">
                    <p>${elem}</p>
                    <input id="${idx}" value="${savedData}" type="text" placeholder="...">
                </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach((elem) => {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

dailyPlanner()

function motivationalQuote() {
  let motivationQuoteContent = document.querySelector(".motivation-2 h1");
  let motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch("https://dummyjson.com/quotes/random");
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.quote;
    motivationAuthor.innerHTML = data.author;
  }

  fetchQuote();
}

motivationalQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");

  let timerInterval = null;
  let totalSeconds = 1500;

  let startBtn = document.querySelector(".pomo-timer #start");
  let pauseBtn = document.querySelector(".pomo-timer #pause");
  let resetBtn = document.querySelector(".pomo-timer #reset");
  var session = document.querySelector(".pomodoro-fullpage .session");
  var isWorkSession = true;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")}`;

    console.log(minutes);
  }

  updateTimer();

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      session.innerHTML = "Work Session";
      session.style.backgrounColor = "var(--green)";
      totalSeconds = 25 * 60;
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          session.innerHTML = "Take a Break";
          session.style.backgrounColor = "var(--blue)";
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = `5:00`;
        }
      }, 1000);
    } else {
      totalSeconds = 5 * 60;
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = `25:00`;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    totalSeconds = 1500;
    clearInterval(timerInterval);
    updateTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}

pomodoroTimer()

var header1Time = document.querySelector('.header-1 h1');
var header1Date = document.querySelector('.header-1 h2');
var header2Temp = document.querySelector('.header-2 h2');
var header2Condition = document.querySelector('.header-2 h4');
var precipitation = document.querySelector('.header-2 .Precipitation');
var humidity = document.querySelector('.header-2 .Humidity');
var wind = document.querySelector('.header-2 .Wind');

var data = null

async function weatherAPICall (city) {
  let apiKey = `39f503b6264142acb19181414262207`
  let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

  let data = await response.json()
  // console.log(data.current.temp_c)

  header2Temp.innerHTML = `${data.current.temp_c}°C`
  header2Condition.innerHTML = `${data.current.condition.text}`
  wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
  humidity.innerHTML = `Humidity: ${data.current.humidity}%`
  precipitation.innerHTML = `Heat Index: ${data.current.heatindex_c}`
}

weatherAPICall("Gaya")

function timeDate() {
  const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  var date = new Date()
  var dayOfWeek = totalDaysOfWeek[date.getDay()]
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()
  var tarikh = date.getDate()
  var month = monthNames[date.getMonth()]
  var year = date.getFullYear()

  header1Date.innerHTML = `${tarikh} ${month}, ${year}`;

  if(hours > 12) {
    header1Time.innerHTML = `${dayOfWeek}, ${String(hours-12).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} PM`
  }
  else {
    header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} AM`
  }
  
}
timeDate()

setInterval(() => {
  timeDate()
}, 1000);