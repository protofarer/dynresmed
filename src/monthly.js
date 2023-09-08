import "./style.css";
import { addPopStateListener, fetchSessionsForYear, initDate, initNavbar, miniMoonWithLink } from "./lib.js";

initNavbar(document.querySelector("body"));

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const prevYearButton = document.getElementById("prevYear");
const nextYearButton = document.getElementById("nextYear");

let selectedDate = initDate();
let sessions = await fetchSessionsForYear(selectedDate.getFullYear());

const updateInfo = () => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const titleText = firstDayOfMonth.toLocaleString("default", { month: "short" });
  calendarTitle.innerHTML = `${titleText} <a class="session" href="yearly.html?year=${currentYear}">${currentYear}</a>`;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
    const dayOfWeekBox = document.createElement("div");
    dayOfWeekBox.classList.add("calendar-box-headers");
    dayOfWeekBox.textContent = DAYS_OF_WEEK[i];
    calendarGrid.appendChild(dayOfWeekBox);
  }

  // offset empty boxes until reach correct day of week for first day of month
  const firstDayOfMonthKind = firstDayOfMonth.getDay(); // 0 - 6
  let dayCounter = 0;
  while (dayCounter < firstDayOfMonthKind) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-box");

    const emptyNumber = document.createElement("span");
    emptyNumber.classList.add("day-number");
    dayBox.appendChild(emptyNumber);
    calendarGrid.appendChild(dayBox);

    dayCounter++;
  }

  let maxGridCellHeight = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-box");

		const dayNumber = document.createElement("span");
		dayNumber.classList.add("day-number");

    // create empty day boxes until reach correct day of week for first day of month
		dayNumber.textContent = day;

		dayBox.appendChild(dayNumber);
		dayBox.appendChild(document.createElement("br"));

		const textElement = document.createElement("span");
		textElement.classList.add("box-text");

		const padMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
		const padDay = day < 10 ? `0${day}` : day;
		const session = sessions.find(x => Object.keys(x)[0].slice(0, 10) === `${currentYear}-${padMonth}-${padDay}`);
    if (session) {
      miniMoonWithLink(dayBox, session);
			// const fullDatestring = `${Object.keys(session)[0]}`; // Replace with your content
			// const n = Object.values(session)[0];

			// const sessionLink = document.createElement("a");
			// sessionLink.classList.add("year-session");
			// sessionLink.href = `session.html?date=${fullDatestring.slice(0,10)}`;
			
			// sessionLink.textContent = `S${n}`;
			// dayBox.appendChild(sessionLink);

      // const hours = fullDatestring.slice(11, 13);
      // const minutes = fullDatestring.slice(14, 16);
      // textElement.innerHTML = `${hours}:${minutes}`;
    }

		dayBox.appendChild(textElement);
    calendarGrid.appendChild(dayBox);

    const height = dayBox.offsetHeight;
    if (height > maxGridCellHeight)
      maxGridCellHeight = height;
  }

  const cells = document.querySelectorAll(".calendar-box");
  cells.forEach(cell => {
    cell.style.minHeight = `${maxGridCellHeight}px`;
  });

}

prevMonthButton.addEventListener("click", async () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  if (selectedDate.getMonth() === 11) {
    sessions = await fetchSessionsForYear(selectedDate.getFullYear());
  }
	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`)
  updateInfo();
});

nextMonthButton.addEventListener("click", async () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  if (selectedDate.getMonth() === 0) {
    sessions = await fetchSessionsForYear(selectedDate.getFullYear());
  }
	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0, 10)}`)
  updateInfo();
});

nextYearButton.addEventListener("click", async () => {
	if (selectedDate.getFullYear() + 1 > 2099) {
		console.error(`cannot go earlier than year 2099`, )
		return;
	}
	selectedDate.setFullYear(selectedDate.getFullYear() + 1);
	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0,10)}`)
	sessions = await fetchSessionsForYear(selectedDate.getFullYear());
  updateInfo();
});

prevYearButton.addEventListener("click", async () => {
	if (selectedDate.getFullYear() - 1 < 1901) {
		console.error(`cannot go earlier than year 1901`, )
		return;
	}
	selectedDate.setFullYear(selectedDate.getFullYear() - 1);
	history.pushState({}, '', `?date=${selectedDate.toISOString().slice(0,10)}`)
	sessions = await fetchSessionsForYear(selectedDate.getFullYear());
  updateInfo();
});

updateInfo();
addPopStateListener(selectedDate, updateInfo);