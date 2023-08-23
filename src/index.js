import './style.css';

window.addEventListener("load", async () => {
	const currYear = new Date().getFullYear();
	const buttons = document.querySelectorAll("button");

	buttons.forEach((button, idx) => {
		const year = currYear + idx;
		button.innerText = year;

		button.addEventListener("click", async (event) => {
			await setData(idx);
		});
	})

	await setData();
});

async function setData(addYears=0) {
	const year = new Date().getFullYear() + addYears;

	// TODO replace with production json
	const rawTable = await fetch(`data/lunarphase/${year}.json`);
	const table = await rawTable.json()
	// const rawData = fs.readFileSync(`data/table/${year}.json`);
	// const table = JSON.parse(rawData);

	const tableBody = document.querySelector(`#phasesTable tbody`);
	tableBody.innerHTML = '';  // Clear previous data

	const tableElement = document.querySelector(`#phasesTable`);
	const caption = tableElement.querySelector("caption");
	if (caption) {
		caption.textContent = year;
	}

	const fullMoon = [];
	const lastQuarter = [];
	const newMoon = [];

	for (const data of table) {
		let hours = data.time.split(':')[0];
		let minutes = data.time.split(':')[1];
		let datetime = new Date(data.year, data.month - 1, data.day, hours, minutes);

		switch (data.phase) {
			case 0:
				const showNewMoonDateTime = `${datetime.toDateString()}<br/>${datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
				newMoon.push(showNewMoonDateTime);
				break;
			case 2:
				const showFullMoonDateTime = `${datetime.toDateString()}<br/>${datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
				fullMoon.push(showFullMoonDateTime);
				break;
			case 3:
				const showLastQuarterDateTime = `${datetime.toDateString()}<br/>${datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
				lastQuarter.push(showLastQuarterDateTime);
				break;
		}
	}
	
	const maxRows = Math.max(fullMoon.length, lastQuarter.length, newMoon.length);
	
	for (let i = 0; i < maxRows; i++) {
			const row = document.createElement('tr');

			row.innerHTML = `
					<td>${fullMoon[i] || ''}</td>
					<td>${lastQuarter[i] || ''}</td>
					<td>${newMoon[i] || ''}</td>
			`;
			
			tableBody.appendChild(row);
	}
}