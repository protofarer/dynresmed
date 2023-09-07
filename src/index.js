import { fetchSessionsForYearAndAdjacent, findFirstCycleStartIndexFromDate, initDate, initNavbar } from "./lib.js";
import './style.css';

initNavbar(document.querySelector("body"));

const data = await fetch('data/intro.json').then(response => response.json());
const introPara = document.getElementById('intro');
introPara.innerHTML = data.intro;
const medPara = document.getElementById('med');
medPara.innerHTML = data.meditate;

const selectedDate = initDate();
const sessions = await fetchSessionsForYearAndAdjacent(selectedDate.getFullYear());

// find next ten sessions
let sessionDates = [];
let cycleStartIdx = findFirstCycleStartIndexFromDate(selectedDate, sessions);
let nSessions = 0;
let sessionIdx = cycleStartIdx;
while (nSessions < 10) {
  sessionDates.push(Object.keys(sessions[sessionIdx])[0].slice(0,10));
  sessionIdx++;
  nSessions++;
}

// links to session pages based on css animation content representing session
// number
let previousContent = "";
const moon = document.querySelector('.moon');

setInterval(() => {
  const moonText = document.querySelector('.moon-text');
  const currentContent = parseInt(window.getComputedStyle(moonText, '::before').content.slice(1));

  // Check if content has changed, if so, update link to a valid session page
  if (currentContent !== previousContent && !isNaN(currentContent)) {
		const n = parseInt(currentContent);	
    const date = sessionDates[n - 1];
		moon.href = `session.html?date=${date}`
    previousContent = currentContent;
  }
  if (isNaN(currentContent)) {
		moon.href = `session.html?date=${selectedDate.toISOString().slice(0,10)}`
  }
}, 100);
