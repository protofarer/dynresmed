import { initNavbar, fetchSessionsForYear, parseDayStringFromDate } from "./lib.js";
import "./style.css";

initNavbar(body);

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

// * Times in sessions data are local (to me, EST/EDT)
const calendarTitle = document.getElementById("calendarTitle");
const calendarContainer = document.getElementById("calendarContainer");
const prevYearButton = document.getElementById("prevYear");
const nextYearButton = document.getElementById("nextYear");

const urlParams = new URLSearchParams(window.location.search);
let selectedYear = parseInt(urlParams.get("year"), 10) || new Date().getFullYear();
history.replaceState({}, '', `?year=${selectedYear}`);

let sessions = await fetchSessionsForYear(selectedYear);

const makeMonth = (selectedMonth, sessions) => {
	const currentMonthDate = new Date(selectedYear, selectedMonth, 1);
	const year = selectedYear;
	const month = currentMonthDate.getMonth();

	const monthContainer = document.createElement("div");
	monthContainer.classList.add("month-container");
	calendarContainer.appendChild(monthContainer);

	const monthTitle = document.createElement("div");
	monthTitle.classList.add("month-title");
	// monthTitle.textContent = `${currentMonthDate.toLocaleString("default", { month: "long" })}`;
  const text = currentMonthDate.toLocaleString("default", { month: "long" });
	monthTitle.innerHTML = `<a class="session" href="monthly.html?date=${currentMonthDate.toISOString().slice(0,10)}">${text}</a>`;

	monthContainer.appendChild(monthTitle);

	const monthGrid = document.createElement("div");
	monthGrid.classList.add("month-grid");
	monthGrid.id = `month-${selectedMonth}`;
	monthContainer.appendChild(monthGrid);

	// make day of week row (header)
	for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
		const dayOfWeekBox = document.createElement("div");
		dayOfWeekBox.classList.add("day-box-headers");
		dayOfWeekBox.textContent = DAYS_OF_WEEK[i];
		monthGrid.appendChild(dayOfWeekBox);
	}

  // offset empty boxes until reach correct day of week for first day of month
  const firstDayOfMonthKind = currentMonthDate.getDay(); // 0 - 6
  let dayCounter = 0;
  while (dayCounter < firstDayOfMonthKind) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day-box");

    const emptyNumber = document.createElement("span");
    emptyNumber.classList.add("year-day-number");

    dayBox.appendChild(emptyNumber);
    monthGrid.appendChild(dayBox);

    dayCounter++;
  }

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	for (let day = 1; day <= daysInMonth; day++) {
		const dayBox = document.createElement("div");
		dayBox.classList.add("day-box");

		const date = new Date(year, month, day);
		const dateString = parseDayStringFromDate(date);
		const session = sessions.find(x => Object.keys(x)[0].slice(0, 10) === dateString);

		if (session) {
			const moon = document.createElement("div");
			moon.classList.add("moon-mini");
			moon.style.height = "0.5em";
			moon.style.width = "0.5em";
			moon.style.border = 'none';

			const disc = document.createElement("div");
			disc.classList.add("moon-mini-disc");
			moon.appendChild(disc);

			// dayBox.style.lineHeight = "0";
			// dayBox.style.padding = 0;
			// dayBox.style.fontSize = "1em";
			dayBox.appendChild(moon);

			// const fullDatestring = `${Object.keys(session)[0]}`; // Replace with your content
			// const n = Object.values(session)[0];
			// const sessionLink = document.createElement("a");
			// sessionLink.classList.add("year-session");
			// sessionLink.href = `session.html?date=${fullDatestring.slice(0,10)}`;
			
			// sessionLink.textContent = `S${n}`;
			// dayBox.appendChild(sessionLink);
		} else {
			const dayNumber = document.createElement("span");
			dayNumber.classList.add("year-day-number");
			dayNumber.textContent = day;
			dayBox.appendChild(dayNumber);
		}
		monthGrid.appendChild(dayBox);
	}
}

const updateInfo = () => {
	calendarTitle.textContent = `${selectedYear}`;
	calendarContainer.innerHTML = "";
	new Array(12).fill(0).forEach((_,i) => makeMonth(i, sessions));
}

prevYearButton.addEventListener("click", async () => {
	if (selectedYear - 1 < 1901) {
		console.error(`cannot go earlier than year 1901`, )
		return;
	}
	selectedYear--;
	history.pushState({}, '', `?year=${selectedYear}`)
	sessions = await fetchSessionsForYear(selectedYear);
  updateInfo();
});

nextYearButton.addEventListener("click", async () => {
	if (selectedYear + 1 > 2099) {
		console.error(`cannot go earlier than year 2099`, )
		return;
	}
	selectedYear++;
	history.pushState({}, '', `?year=${selectedYear}`)
	sessions = await fetchSessionsForYear(selectedYear);
  updateInfo();
});

window.addEventListener("popstate", async _ => {
	const urlParams = new URLSearchParams(window.location.search);
	selectedYear = parseInt(urlParams.get("year"), 10) || new Date().getFullYear();
	sessions = await fetchSessionsForYear(selectedYear);
	updateInfo();
})

updateInfo();