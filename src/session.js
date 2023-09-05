import "./session.css";

const sessionText = await fetch(`data/sessionText.json`).then((response) => response.json());

const containerTitle = document.getElementById("containerTitle");
const card = document.getElementById("card");
const prevCycleButton = document.getElementById("prevCycle");
const nextCycleButton = document.getElementById("nextCycle");

let selectedDate = initDate();
let sessions = await fetchSessions(selectedDate.getFullYear());
let sessionIndex = getSessionIndexByDate(selectedDate);
updateInfo();

function updateInfo() {
  containerTitle.innerHTML = `${selectedDate.toDateString()}`;

  const session = sessions[sessionIndex];
  
  if (!session) {
    card.innerText = "no session on this day"
    return;
  }

  const datestring = `${Object.keys(session)[0]}`; // Replace with your content
  const hours = datestring.slice(11, 13);
  const minutes = datestring.slice(14, 16);
  const n = Object.values(session)[0];
  const altDateText = `${new Date(datestring).toDateString().slice(0,10)}`;

  card.innerHTML = `<strong>S${n}</strong> @ ${hours}:${minutes}<br/><p>${sessionText[n-1]}</p>`;
}

nextCycleButton.addEventListener("click", async () => {
  if (sessionIndex === -1) {
    sessionIndex = findSessionIndexAfterDate(selectedDate);
  } else {
    sessionIndex += 1;
  }

  if (sessionIndex >= sessions.length) {
    const nextYear = selectedDate.getFullYear() + 1;
    sessions = await fetchSessions(nextYear);
    sessionIndex = 0;
  }
  selectedDate = new Date(Object.keys(sessions[sessionIndex])[0]);
	history.pushState({}, '', `?day=${selectedDate.toISOString().slice(0, 10)}`)
  updateInfo();
});

prevCycleButton.addEventListener("click", async () => {
  if (sessionIndex === -1) {
    sessionIndex = findSessionIndexBeforeDate(selectedDate);
  } else {
    sessionIndex -= 1;
  }
  if (sessionIndex < 0) {
    const prevYear = selectedDate.getFullYear() - 1;
    sessions = await fetchSessions(prevYear);
    sessionIndex = sessions.length - 1;
  }
  selectedDate = new Date(Object.keys(sessions[sessionIndex])[0]);
  history.pushState({}, '', `?day=${selectedDate.toISOString().slice(0, 10)}`);
  updateInfo();
});

async function fetchSessions(year) {
  return await fetch(`data/sessions/${year}.json`).then((response) => response.json());
}

function getSessionIndexByDate(date) {
  const day = date.getDate();
  const padDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const padMonth = month < 10 ? `0${month}` : month;
  const matchString =  `${date.getFullYear()}-${padMonth}-${padDay}`;
  return sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) === matchString);
}

function findSessionIndexAfterDate(date) {
  // jump to next session date if selectedDate is not a session day
  const day = date.getDate();
  const padDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const padMonth = month < 10 ? `0${month}` : month;
  const matchString =  `${date.getFullYear()}-${padMonth}-${padDay}`;
  let nextSessionIndex = sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) > matchString);
  if (nextSessionIndex === -1) {
    return null;
  }
  return nextSessionIndex;
}

function findSessionIndexBeforeDate(date) {
  // jump to preceding session date if selectedDate is not a session day
  const day = date.getDate();
  const padDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const padMonth = month < 10 ? `0${month}` : month;
  const matchString =  `${date.getFullYear()}-${padMonth}-${padDay}`;
  let nextSessionIndex = sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) >= matchString);
  nextSessionIndex -= 1;
  if (nextSessionIndex === -1) {
    return null;
  }
  return nextSessionIndex;
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

function parseDateFromDayString(dayString) {
    const parts = dayString.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Months are zero-based
    const day = parseInt(parts[2], 10);
    return new Date(year, monthIndex, day);
}