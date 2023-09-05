import "./monthly.css";
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let sessions = await fetch(`data/sessions/${currentYear}.json`).then((response) => response.json());

function updateCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  calendarTitle.textContent = `${firstDayOfMonth.toLocaleString("default", { month: "long" })} ${currentYear}`;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < daysOfWeek.length; i++) {
    const dayOfWeekBox = document.createElement("div");
    dayOfWeekBox.classList.add("calendar-box");
    dayOfWeekBox.textContent = daysOfWeek[i];
		dayOfWeekBox.style.background = "lightgrey";
    calendarGrid.appendChild(dayOfWeekBox);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-box");

		const dayNumber = document.createElement("span");
		dayNumber.classList.add("day-number");
		dayNumber.textContent = day;

		dayBox.appendChild(dayNumber);
		dayBox.appendChild(document.createElement("br"));

		const textElement = document.createElement("span");
		textElement.classList.add("box-text");

		const padMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
		const padDay = day < 10 ? `0${day}` : day;
		const session = sessions.find(x => Object.keys(x)[0].slice(0, 10) === `${currentYear}-${padMonth}-${padDay}`);
    if (session) {
      const datestring = `${Object.keys(session)[0]}`; // Replace with your content
      const hours = datestring.slice(11, 13);
      const minutes = datestring.slice(14, 16);
      const n = Object.values(session)[0];
      textElement.innerHTML = `S${n}<br/>${hours}:${minutes}`;
    }

		dayBox.appendChild(textElement);
    calendarGrid.appendChild(dayBox);
  }
}

prevMonthButton.addEventListener("click", async () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
    sessions = await fetch(`data/sessions/${currentYear}.json`).then((response) => response.json());
  }
  updateCalendar();
});

nextMonthButton.addEventListener("click", async () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  sessions = await fetch(`data/sessions/${currentYear}.json`).then((response) => response.json());
  }
  updateCalendar();
});

updateCalendar();
