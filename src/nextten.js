import "./style.css";
import { findFirstCycleStartIndexFromDate, initNavbar, addPopStateListener, fetchSessionsForYearAndAdjacent, parseDateFromDayString, initDate, miniMoonWithLink } from "./lib.js";

initNavbar(document.querySelector("body"));

const containerTitle = document.getElementById("containerTitle");
const containerGrid = document.getElementById("containerGrid");
const prevCycleButton = document.getElementById("prevCycle");
const nextCycleButton = document.getElementById("nextCycle");

let selectedDate = initDate();
let sessions = await fetchSessionsForYearAndAdjacent(selectedDate.getFullYear());
let cycleStartIdx = -1;

const updateInfo = () => {
  const title = selectedDate.toDateString();
  containerTitle.innerHTML = `${title}`;
  containerGrid.innerHTML = "";

  cycleStartIdx = findFirstCycleStartIndexFromDate(selectedDate, sessions);

  let nSessions = 0;
  let sessionIdx = cycleStartIdx;
  while (nSessions < 10) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("sessions-box");

    // get and each of next 10 sessions
		const textElement = document.createElement("span");
		textElement.classList.add("box-text");

    const session = sessions[sessionIdx];
    const n = Object.values(session)[0];
    const datestring = `${Object.keys(session)[0]}`; // Replace with your content

    // Session link element
    // const sessionLink = document.createElement("a");
    // sessionLink.classList.add("session");
    // sessionLink.href = `session.html?date=${datestring.slice(0,10)}`;
    // sessionLink.textContent = `S${n}`;
    // dayBox.appendChild(sessionLink);
    dayBox.appendChild(miniMoonWithLink(dayBox, session));
    
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
  const sessionDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);
  selectedDate.setTime(sessionDate.getTime());
  const year = selectedDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessionsForYearAndAdjacent(selectedDate.getFullYear());
  }

	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`)
  updateInfo();
});

prevCycleButton.addEventListener("click", async () => {
  if (cycleStartIdx === - 1) {
    // TODO find prev cycle start
  } else {
    cycleStartIdx -= 10;
  }

  if (cycleStartIdx < 0) {}

  const currYear = selectedDate.getFullYear();
  const sessionDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);
  selectedDate.setTime(sessionDate.getTime());
  const year = selectedDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessionsForYearAndAdjacent(selectedDate.getFullYear());
  }

	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`)
  updateInfo();
});

updateInfo();
addPopStateListener(selectedDate, updateInfo);
