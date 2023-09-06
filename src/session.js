import "./style.css";
import { 
  addPopStateListener, 
  fetchSessionsForYear, 
  initDate, 
  initNavbar 
} from "./lib.js";

const body = document.querySelector("body");
initNavbar(body);

const sessionText = await fetch(`data/sessionText.json`).then((response) => response.json());

const containerTitle = document.getElementById("containerTitle");
const prevCycleButton = document.getElementById("prevCycle");
const nextCycleButton = document.getElementById("nextCycle");
const card = document.getElementById("card");




let selectedDate = initDate();
let sessions = await fetchSessionsForYear(selectedDate.getFullYear());
let sessionIndex = getSessionIndexByDate(selectedDate, sessions);

const updateInfo = () => {
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

  card.innerHTML = `<h2><strong>S${n}</strong> @ ${hours}:${minutes}<br/></h2><p>${sessionText[n-1]}</p>`;
}

nextCycleButton.addEventListener("click", async () => {
  if (sessionIndex === -1) {
    sessionIndex = findSessionIndexAfterDate(selectedDate);
  } else {
    sessionIndex += 1;
  }

  if (sessionIndex >= sessions.length) {
    const nextYear = selectedDate.getFullYear() + 1;
    sessions = await fetchSessionsForYear(nextYear);
    sessionIndex = 0;
  }
  const sessionDate = new Date(Object.keys(sessions[sessionIndex])[0]);
  selectedDate.setTime(sessionDate.getTime());
	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`)
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
    sessions = await fetchSessionsForYear(prevYear);
    sessionIndex = sessions.length - 1;
  }
  const sessionDate = new Date(Object.keys(sessions[sessionIndex])[0]);
  selectedDate.setTime(sessionDate.getTime());
  history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`);
  updateInfo();
});

updateInfo();
addPopStateListener(selectedDate, updateInfo);

function getSessionIndexByDate(date, sessions) {
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
