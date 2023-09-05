import "./nextten.css";

const containerTitle = document.getElementById("containerTitle");
const containerGrid = document.getElementById("containerGrid");
const prevCycleButton = document.getElementById("prevCycle");
const nextCycleButton = document.getElementById("nextCycle");

let currentDate = new Date();
let sessions = await fetchSessions();
let cycleStartIdx = -1;

updateCalendar();

function updateCalendar() {
  containerTitle.textContent = `Next 10 sessions from ${currentDate.toDateString()}`;
  containerGrid.innerHTML = "";

  const limit = 140;
  let nLoops = 0;

  // find first next session's index
  let loopDate = new Date(currentDate);
  while (cycleStartIdx === -1 && nLoops < limit) {
    const day = loopDate.getDate();
    const padDay = day < 10 ? `0${day}` : day;
    const month = loopDate.getMonth() + 1;
    const padMonth = month < 10 ? `0${month}` : month;
    const matchString =  `${currentDate.getFullYear()}-${padMonth}-${padDay}`;
    cycleStartIdx = sessions.findIndex(x => Object.keys(x)[0].slice(0, 10) === matchString) ;

    loopDate.setDate(loopDate.getDate() + 1);
    nLoops++;
  }

  let nSessions = 0;
  let sessionIdx = cycleStartIdx;
  while (nSessions < 10) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-box");

    // get and each of next 10 sessions
		const textElement = document.createElement("span");
		textElement.classList.add("box-text");

    const session = sessions[sessionIdx];
    
    const datestring = `${Object.keys(session)[0]}`; // Replace with your content
    const hours = datestring.slice(11, 13);
    const minutes = datestring.slice(14, 16);
    const n = Object.values(session)[0];
    const altDateText = `${new Date(datestring).toDateString().slice(0,10)}`;
    textElement.innerHTML = `${altDateText}<br/>${hours}:${minutes}<br/>S${n}`;

		dayBox.appendChild(textElement);
    containerGrid.appendChild(dayBox);
    sessionIdx++;
    nSessions++;
  }
}

prevCycleButton.addEventListener("click", async () => {
  // let { localSessionIndex, date } = findPrevDateBySession(currentDate.toISOString(), 1);
  cycleStartIdx -= 10;
  const currYear = currentDate.getFullYear();
  currentDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);

  const year = currentDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessions();
  }
  updateCalendar();
});

nextCycleButton.addEventListener("click", async () => {
  console.log(`sessionIdx before++`, cycleStartIdx )
  cycleStartIdx += 10;
  console.log(`sessionIdx after++`, cycleStartIdx )
  
  const currYear = currentDate.getFullYear();
  currentDate = new Date(Object.keys(sessions[cycleStartIdx])[0]);
  const year = currentDate.getFullYear();
  if (year !== currYear) {
    cycleStartIdx = -1;
    sessions = await fetchSessions();
  }
  updateCalendar();
});

async function fetchSessions() {
  const sessions1 = await fetch(`data/sessions/${currentDate.getFullYear() - 1}.json`).then((response) => response.json());
  const sessions2 = await fetch(`data/sessions/${currentDate.getFullYear()}.json`).then((response) => response.json());
  const sessions3 = await fetch(`data/sessions/${currentDate.getFullYear() + 1}.json`).then((response) => response.json());
  return [...sessions1, ...sessions2, ...sessions3];
}