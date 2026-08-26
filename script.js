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
    allTask.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") {
        currentTasks.splice(e.target.dataset.idx, 1);
        localStorage.setItem("currentTasks", JSON.stringify(currentTasks));
        renderTask();
      }
    });

    let sum = "";

    currentTasks.forEach(function (elem, idx) {
      sum =
        sum +
        `<div class="task">
                        <h5>${elem.task} <span class = "${elem.imp}">imp</span></h5>
                        <button data-idx=${idx}>Mark as Completed</button>
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

dailyPlanner();

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
      session.style.backgroundColor = "var(--green)";
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

          logFocusSession(); // <-- ADDED THIS LINE
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

// ADD THIS NEW FUNCTION BELOW, OUTSIDE pomodoroTimer()
function logFocusSession() {
  let today = new Date().toDateString();
  let lastDate = localStorage.getItem("focusLastDate");
  let streak = parseInt(localStorage.getItem("focusStreak")) || 0;
  let completedDates =
    JSON.parse(localStorage.getItem("focusCompletedDates")) || [];

  if (lastDate === today) {
    return;
  }

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toDateString();

  streak = lastDate === yesterday ? streak + 1 : 1;

  completedDates.push(today);

  localStorage.setItem("focusStreak", streak);
  localStorage.setItem("focusLastDate", today);
  localStorage.setItem("focusCompletedDates", JSON.stringify(completedDates));
}

pomodoroTimer();

function focusSpace() {
  let streak = parseInt(localStorage.getItem("focusStreak")) || 0;
  let completedDates = JSON.parse(localStorage.getItem("focusCompletedDates")) || [];

  let streakDisplay = document.querySelector(".streak");
  let heatmap = document.querySelector(".heatmap");

  streakDisplay.innerHTML = `🔥 ${streak} day streak`;

  let sum = "";
  let today = new Date();

  for (let i = 34; i >= 0; i--) {
    let d = new Date();
    d.setDate(today.getDate() - i);
    let dateStr = d.toDateString();
    let isDone = completedDates.includes(dateStr);
    sum += `<div class="heat-cell ${isDone ? "filled" : ""}" title="${dateStr}"></div>`;
  }

  heatmap.innerHTML = sum;
}

focusSpace();

function musicPlayer() {
    const stations = [
        { name: "Groove Salad", desc: "Ambient / Lofi", url: "https://ice1.somafm.com/groovesalad-128-mp3" },
        { name: "Drone Zone", desc: "Deep Ambient", url: "https://ice1.somafm.com/dronezone-128-mp3" },
        { name: "Deep Space One", desc: "Space Music", url: "https://ice1.somafm.com/deepspaceone-128-mp3" },
    ];

    let currentIndex = 0;
    let isPlaying = false;

    const audio = document.getElementById("audio-player");
    const toggleBtn = document.getElementById("music-toggle");
    const nextBtn = document.getElementById("music-next");
    const prevBtn = document.getElementById("music-prev");
    const nameEl = document.querySelector(".station-name");
    const descEl = document.querySelector(".station-desc");

    function loadStation(index) {
        const station = stations[index];
        audio.src = station.url;
        nameEl.innerHTML = station.name;
        descEl.innerHTML = station.desc;
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            toggleBtn.innerHTML = "▶";
        } else {
            if (!audio.src) loadStation(currentIndex);
            audio.play();
            toggleBtn.innerHTML = "⏸";
        }
        isPlaying = !isPlaying;
    }

    function changeStation(direction) {
        currentIndex = (currentIndex + direction + stations.length) % stations.length;
        loadStation(currentIndex);
        if (isPlaying) audio.play();
    }

    toggleBtn.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", () => changeStation(1));
    prevBtn.addEventListener("click", () => changeStation(-1));

    loadStation(currentIndex);
}

musicPlayer();

function togglePlay() {
    const ring = document.querySelector(".ring-progress");
    if (isPlaying) {
        audio.pause();
        toggleBtn.innerHTML = "▶";
        ring.classList.remove("spinning");
    } else {
        if (!audio.src) loadStation(currentIndex);
        audio.play();
        toggleBtn.innerHTML = "⏸";
        ring.classList.add("spinning");
    }
    isPlaying = !isPlaying;
}

var header1Time = document.querySelector(".header-1 h1");
var header1Date = document.querySelector(".header-1 h2");
var header2Temp = document.querySelector(".header-2 h2");
var header2Condition = document.querySelector(".header-2 h4");
var precipitation = document.querySelector(".header-2 .Precipitation");
var humidity = document.querySelector(".header-2 .Humidity");
var wind = document.querySelector(".header-2 .Wind");

var data = null;

async function weatherAPICall(city) {
  let apiKey = `39f503b6264142acb19181414262207`;
  let response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`,
  );

  let data = await response.json();
  // console.log(data.current.temp_c)

  header2Temp.innerHTML = `${data.current.temp_c}°C`;
  header2Condition.innerHTML = `${data.current.condition.text}`;
  wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
  humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
  precipitation.innerHTML = `Heat Index: ${data.current.heatindex_c}`;
}

weatherAPICall("Gaya");

function timeDate() {
  const totalDaysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var date = new Date();
  var dayOfWeek = totalDaysOfWeek[date.getDay()];
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var tarikh = date.getDate();
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();

  header1Date.innerHTML = `${tarikh} ${month}, ${year}`;

  if (hours > 12) {
    header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart("2", "0")}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")} PM`;
  } else {
    header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart("2", "0")}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")} AM`;
  }
}
timeDate();

setInterval(() => {
  timeDate();
}, 1000);

function themeToggle() {
  let toggleBtn = document.getElementById("theme-toggle");
  let root = document.documentElement;

  let savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  toggleBtn.innerHTML = savedTheme === "light" ? "☀️" : "🌙";

  toggleBtn.addEventListener("click", function () {
    let current = root.getAttribute("data-theme");
    let next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggleBtn.innerHTML = next === "light" ? "☀️" : "🌙";
  });
}

themeToggle();

function musicPlayer() {
  const stations = [
    {
      name: "Groove Salad",
      desc: "Ambient / Lofi",
      url: "https://ice1.somafm.com/groovesalad-128-mp3",
    },
    {
      name: "Drone Zone",
      desc: "Deep Ambient",
      url: "https://ice1.somafm.com/dronezone-128-mp3",
    },
    {
      name: "Deep Space One",
      desc: "Space Music",
      url: "https://ice1.somafm.com/deepspaceone-128-mp3",
    },
  ];

  let currentIndex = 0;
  let isPlaying = false;

  const audio = document.getElementById("audio-player");
  const toggleBtn = document.getElementById("music-toggle");
  const nextBtn = document.getElementById("music-next");
  const nameEl = document.querySelector(".station-name");
  const descEl = document.querySelector(".station-desc");

  function loadStation(index) {
    const station = stations[index];
    audio.src = station.url;
    nameEl.innerHTML = station.name;
    descEl.innerHTML = station.desc;
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      toggleBtn.innerHTML = "▶";
    } else {
      if (!audio.src) loadStation(currentIndex);
      audio.play();
      toggleBtn.innerHTML = "⏸";
    }
    isPlaying = !isPlaying;
  }

  function nextStation() {
    currentIndex = (currentIndex + 1) % stations.length;
    loadStation(currentIndex);
    if (isPlaying) audio.play();
  }

  toggleBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextStation);

  loadStation(currentIndex);
}

musicPlayer();
