export function parseDateFromDayString(dayString) {
    const parts = dayString.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Months are zero-based
    const day = parseInt(parts[2], 10);
    return new Date(year, monthIndex, day);
}

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

export async function fetchSessionsForYearAndAdjacent(year) {
  const sessions1 = await fetch(`data/sessions/${year - 1}.json`).then((response) => response.json());
  const sessions2 = await fetch(`data/sessions/${year}.json`).then((response) => response.json());
  const sessions3 = await fetch(`data/sessions/${year + 1}.json`).then((response) => response.json());
  return [...sessions1, ...sessions2, ...sessions3];
}

export async function fetchSessionsForYear(year) {
  return await fetch(`data/sessions/${year}.json`).then((response) => response.json());
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
