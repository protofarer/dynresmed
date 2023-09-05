import "./yearly.css";
// * Times in sessions data are local (to me, EST/EDT)
const calendarTitle = document.getElementById("calendarTitle");
const calendarContainer = document.getElementById("calendarContainer");
const prevYearButton = document.getElementById("prevYear");
const nextYearButton = document.getElementById("nextYear");

const urlParams = new URLSearchParams(window.location.search);
const initYear = new Date().getFullYear();
let currentDate = new Date(parseInt(urlParams.get("year"), 10) || initYear, 0, 1);
history.pushState({}, '', `?year=${currentDate.getFullYear()}`);

let sessions = await fetchSessionsYearOnly();

async function updateCalendar() {
	calendarTitle.textContent = `${currentDate.getFullYear()}`;
	calendarContainer.innerHTML = "";
	new Array(12).fill(0).forEach((x,i) => makeMonth(i, sessions));
}

function makeMonth(selectedMonth, sessions) {
	const currentMonthDate = new Date(currentDate.getFullYear(), selectedMonth, 1);

	console.log(`----------- MAKE MONTH -----------`, )

	const year = currentMonthDate.getFullYear();
	const month = currentMonthDate.getMonth();

	const monthContainer = document.createElement("div");
	monthContainer.classList.add("month-container");
	calendarContainer.appendChild(monthContainer);

	const monthTitle = document.createElement("div");
	monthTitle.classList.add("month-title");
	monthTitle.textContent = `${currentMonthDate.toLocaleString("default", { month: "long" })}`;
	monthContainer.appendChild(monthTitle);

	const monthGrid = document.createElement("div");
	monthGrid.classList.add("month-grid");
	monthGrid.id = `month-${selectedMonth}`;
	monthContainer.appendChild(monthGrid);

	// make day of week row (header)
	const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
	for (let i = 0; i < daysOfWeek.length; i++) {
		const dayOfWeekBox = document.createElement("div");
		dayOfWeekBox.classList.add("day-box");
		dayOfWeekBox.textContent = daysOfWeek[i];
		// dayOfWeekBox.style.background = "lightgrey";
		monthGrid.appendChild(dayOfWeekBox);
	}

  // offset empty boxes until reach correct day of week for first day of month
  const firstDayOfMonthKind = currentMonthDate.getDay(); // 0 - 6
  let dayCounter = 0;
  while (dayCounter < firstDayOfMonthKind) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day-box");

    const emptyNumber = document.createElement("span");
    emptyNumber.classList.add("day-number");

    dayBox.appendChild(emptyNumber);
    monthGrid.appendChild(dayBox);

    dayCounter++;
  }

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	for (let day = 1; day <= daysInMonth; day++) {
		const dayBox = document.createElement("div");
		dayBox.classList.add("day-box");

		const currentMonth = currentMonthDate.getMonth();
		const padMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
		const padDay = day < 10 ? `0${day}` : day;
		const currentYear = currentDate.getFullYear();

		const session = sessions.find(x => Object.keys(x)[0].slice(0, 10) === `${currentYear}-${padMonth}-${padDay}`);
		if (session) {
			const datestring = `${Object.keys(session)[0]}`; // Replace with your content
			// const hours = datestring.slice(11, 13);
			// const minutes = datestring.slice(14, 16);
			const n = Object.values(session)[0];
			const sessionLink = document.createElement("a");
			sessionLink.classList.add("session");
			sessionLink.href = `session.html?day=${datestring.slice(0,10)}`;
			
			sessionLink.textContent = `S${n}`;
			dayBox.appendChild(sessionLink);

			// dayNumber.innerHTML = `<a class="session" href=day.html?param=${year}-${month}-${day}>S${n}</a>`;
			// dayNumber.style.fontWeight = 'bold';
		} else {
			const dayNumber = document.createElement("span");
			dayNumber.classList.add("day-number");
			dayNumber.textContent = day;
			dayBox.appendChild(dayNumber);
		}

		monthGrid.appendChild(dayBox);
	}
}

prevYearButton.addEventListener("click", async () => {
	if (currentDate.getFullYear() - 1 < 1901) {
		console.error(`cannot go earlier than year 1901`, )
		return;
	}
	currentDate.setFullYear(currentDate.getFullYear() - 1);
	history.pushState({}, '', `?year=${currentDate.getFullYear()}`)
  sessions = await fetch(`data/sessions/${currentDate.getFullYear()}.json`).then((response) => response.json());
  updateCalendar();
});

nextYearButton.addEventListener("click", async () => {
	if (currentDate.getFullYear() + 1 > 2099) {
		console.error(`cannot go earlier than year 2099`, )
		return;
	}
	currentDate.setFullYear(currentDate.getFullYear() + 1);
	history.pushState({}, '', `?year=${currentDate.getFullYear()}`)
	sessions = await fetch(`data/sessions/${currentDate.getFullYear()}.json`).then((response) => response.json());
  updateCalendar();
});

updateCalendar();

async function fetchSessionsYearOnly() {
  return await fetch(`data/sessions/${currentDate.getFullYear()}.json`).then((response) => response.json());
}