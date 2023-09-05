import "./nextten.css";

const containerTitle = document.getElementById("containerTitle");
const containerGrid = document.getElementById("containerGrid");
const prevCycleButton = document.getElementById("prevCycle");
const nextCycleButton = document.getElementById("nextCycle");

let selectedDate = initDate();
let sessions = await fetchSessions();
let cycleStartIdx = -1;

updateCalendar();

function updateCalendar() {
  containerTitle.innerHTML = `${selectedDate.toDateString()}<br/>Next 10 sessions`;
  containerGrid.innerHTML = "";

  cycleStartIdx = findFirstCycleStartIndexFromDate(selectedDate);

  let nSessions = 0;
  let sessionIdx = cycleStartIdx;
  while (nSessions < 10) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-box");

    // get and each of next 10 sessions
		const textElement = document.createElement("span");
		textElement.classList.add("box-text");

    const session = sessions[sessionIdx];
    const n = Object.values(session)[0];
    const datestring = `${Object.keys(session)[0]}`; // Replace with your content

    // Session link element
    const sessionLink = document.createElement("a");
    sessionLink.classList.add("session");
    sessionLink.href = `session.html?day=${datestring.slice(0,10)}`;
    sessionLink.textContent = `S${n}`;
    dayBox.appendChild(sessionLink);
    
    // Session info element
    const hours = datestring.slice(11, 13);
    const minutes = datestring.slice(14, 16);
    const altDateText = `${new Date(datestring).toDateString().slice(0,10)}`;
    textElement.innerHTML = `${altDateText} @ ${hours}:${minutes}`;
		dayBox.appendChild(textElement);

    containerGrid.appendChild(dayBox);
    sessionIdx++;
    nSessions++;
  }
}

nextCycleButton.addEventListener("click", async () => {
  if (cycleStartIdx === -1) {
    // TODO find next cycle start
  } else {
    cycleStartIdx += 10;
  }
  
  const currYear = selectedDate.getFullYear();
  selectedDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);
  const year = selectedDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessions();
  }

	history.pushState({}, '', `?day=${selectedDate.toISOString().slice(0, 10)}`)
  updateCalendar();
});

prevCycleButton.addEventListener("click", async () => {
  if (cycleStartIdx === - 1) {
    // TODO find prev cycle start
  } else {
    cycleStartIdx -= 10;
  }

  if (cycleStartIdx < 0) {}

  const currYear = selectedDate.getFullYear();
  selectedDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);
  const year = selectedDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessions();
  }

	history.pushState({}, '', `?day=${selectedDate.toISOString().slice(0, 10)}`)
  updateCalendar();
});


async function fetchSessions() {
  const sessions1 = await fetch(`data/sessions/${selectedDate.getFullYear() - 1}.json`).then((response) => response.json());
  const sessions2 = await fetch(`data/sessions/${selectedDate.getFullYear()}.json`).then((response) => response.json());
  const sessions3 = await fetch(`data/sessions/${selectedDate.getFullYear() + 1}.json`).then((response) => response.json());
  return [...sessions1, ...sessions2, ...sessions3];
}

function initDate() {
  const urlParams = new URLSearchParams(window.location.search);
  const dayParam = urlParams.get("day");
  let date;
  if (dayParam) {
    date = parseDateFromDayString(dayParam);
  } else {
    date = new Date();
  }
  history.pushState({}, '', `?day=${date.toISOString().slice(0,10)}`);
  return date;
}

function findFirstCycleStartIndexFromDate(date) {
// find first cycle start index on or after given date
  let startIdx = -1;
  const day = date.getDate();
  const padDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const padMonth = month < 10 ? `0${month}` : month;
  const matchString =  `${date.getFullYear()}-${padMonth}-${padDay}`;
  startIdx = sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) >= matchString) ;
  return startIdx;
}

function findPrevCycleStartIndexFromDate(date) {
// find first cycle start index before given date
  let startIdx = -1;
  const day = date.getDate();
  const padDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const padMonth = month < 10 ? `0${month}` : month;
  const matchString =  `${date.getFullYear()}-${padMonth}-${padDay}`;
  startIdx = sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) >= matchString) ;
  return startIdx;
}

function parseDateFromDayString(dayString) {
    const parts = dayString.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Months are zero-based
    const day = parseInt(parts[2], 10);
    return new Date(year, monthIndex, day);
}