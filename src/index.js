import { fetchSessionsForYearAndAdjacent, findFirstCycleStartIndexFromDate, initDate, initNavbar } from "./lib.js";
import './style.css';
import introText from './data/introText.json';
import sessionTexts from './data/sessionText.json'


const body = document.querySelector('body');
initNavbar(body);

const root = document.querySelector('#root');

const data = introText;
const introPara = document.getElementById('intro');
introPara.innerHTML = data.intro;
const medPara = document.getElementById('med');
medPara.innerHTML = data.meditate;


sessionTexts.forEach((text, idx) => {
  const sessionSection = document.createElement('section');
  const sessionHeading = document.createElement('h3');
  sessionHeading.innerText = `Session ${idx + 1}`;

  const para = document.createElement('p');
  para.innerHTML = `${text}`;

  sessionSection.appendChild(sessionHeading);
  sessionSection.appendChild(para);
  root.appendChild(sessionSection);
})

const aboutSection = document.createElement('section');
const aboutHeading = document.createElement('h2');
aboutHeading.innerText = 'About';
const aboutPara = document.createElement('p');
aboutPara.innerHTML = data.about;
aboutSection.appendChild(aboutHeading);
aboutSection.appendChild(aboutPara);
root.appendChild(aboutSection);


const selectedDate = initDate();
let sessions;
try {
  sessions = await fetchSessionsForYearAndAdjacent(selectedDate.getFullYear());
} catch (err) {
  console.error(`sessions fetch failed`)
  throw err
}

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
