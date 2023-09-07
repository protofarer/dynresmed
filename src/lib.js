export function initDate() {
  const urlParams = new URLSearchParams(window.location.search);
  const dayParam = urlParams.get("date");
  let date;
  if (dayParam) {
    date = parseDateFromDayString(dayParam);
  } else {
    date = new Date();
  }
  history.replaceState({}, '', `?date=${date.toISOString().slice(0,10)}`);
  return date;
}

export function initNavbar(parentElement) {
  const header = document.createElement("header");
  const menu = document.createElement("menu");
  const nav = document.createElement("nav");
  nav.classList.add('navbar');
  const anchorIndex = document.createElement("a");
  anchorIndex.href = 'index.html';
  anchorIndex.innerText = 'Home';
  const anchorNextten = document.createElement("a");
  anchorNextten.href = 'nextten.html';
  anchorNextten.innerText = 'Cyclical';
  const anchorMonthly = document.createElement("a");
  anchorMonthly.href = 'monthly.html';
  anchorMonthly.innerText = 'Monthly';
  const anchorYearly = document.createElement("a");
  anchorYearly.href = 'yearly.html';
  anchorYearly.innerText = 'Yearly';

  parentElement.insertBefore(header, parentElement.firstChild);
  header.appendChild(menu);
  menu.appendChild(nav);
  nav.appendChild(anchorIndex);
  nav.appendChild(anchorNextten);
  nav.appendChild(anchorMonthly);
  nav.appendChild(anchorYearly);
}


export function parseDateFromDayString(dayString) {
    const parts = dayString.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Months are zero-based
    const day = parseInt(parts[2], 10);
    return new Date(year, monthIndex, day);
}

export async function fetchSessionsForYearAndAdjacent(year) {
  const sessions1 = await fetch(`data/sessions/${year - 1}.json`).then((response) => response.json());
  const sessions2 = await fetch(`data/sessions/${year}.json`).then((response) => response.json());
  const sessions3 = await fetch(`data/sessions/${year + 1}.json`).then((response) => response.json());
  return [...sessions1, ...sessions2, ...sessions3];
}

export async function fetchSessionsForYear(year) {
  return await fetch(`data/sessions/${year}.json`).then((response) => response.json());
}

export function addLoadListener() {
  window.addEventListener("load", () => {
    const root = document.getElementById('root');
    root.style.display = 'flex';
    console.log(`execute me`, )
    

    // const loading = document.getElementById('loading');
    // loading.style.display = 'none';
  })
}

export function addPopStateListener(selectedDate, updateFunction) {
  window.addEventListener("popstate", _ => {
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get("date");
    if (dayParam) {
			const date = parseDateFromDayString(dayParam);
      selectedDate.setTime(date.getTime());
			updateFunction();
    }
  })
}

export function parseDayStringFromDate(date) {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const padMonth = month < 10 ? `0${month}` : month;
	const padDay = day < 10 ? `0${day}` : day;
	return `${date.getFullYear()}-${padMonth}-${padDay}`
}

export function initFooter(parentElement) {
  const footer = document.createElement("footer");
  // const currentYear = new Date().getFullYear();
  const text = `o`;
  footer.innerHTML = text;
  parentElement.appendChild(footer);
}

// const MOON_COLORS = [
//   'violet',
//   'indigo',
//   'blue',
//   'teal',
//   'green',
//   'yellowgreen',
//   'yellow',
//   'orange',
//   'orangered',
//   'red',
// ];

export function setupMoonText() {
  const moonText = document.querySelector(".moon-text");
	let frame = 0;
	let content = 0;
	return () => {
		if (frame >= 9 && frame < 19) {
			content++;
			moonText.textContent = `${content}`;
      // moonText.style.color = MOON_COLORS[(content % MOON_COLORS.length) - 1];
		}
		if (frame === 19) {
			moonText.textContent = "";
			frame = 0;
			content = 0;
		}
		frame++
	}
}

export function makeMiniMoon(parentElement) {
  const moon = document.createElement("div");
  moon.classList.add("mini-moon");

  const moonDisc = document.createElement("div");
  moonDisc.classList.add("mini-moon-disc");
  moon.appendChild(moonDisc);

  const diffusor = document.createElement("div");
  diffusor.classList.add("mini-moon-diffusor");

  parentElement.appendChild(moon);
  parentElement.appendChild(diffusor);
  return moon;
}

export function findFirstCycleStartIndexFromDate(date, sessions) {
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

export function findPrevCycleStartIndexFromDate(date) {
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