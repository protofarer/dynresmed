#!/usr/bin/env node

import fs from 'fs';

// fetch source data required for daily sunset times for each day of each year up to 2100

// fetch daily sun and moon data from US Naval Observatory API
// https://aa.usno.navy.mil/data/api#rstt
// query template https://aa.usno.navy.mil/api/rstt/oneday?date=DATE&coords=COORDS&tz=TZ

// ID "id=<name or abbrev>"
// DATE "date=YYYY-MM-DD"
// COORDS "coords=<lat,long>" eg "coords=33.71,-10.445"
// TZ (optional) "tz=-5"

const START_YEAR = 2024;
const MY_COORDS = "25.710583,-80.441457";
const DIR_ALL = "sourcedata/dailysunmoon";

let date = new Date(START_YEAR,0,1);
let currYear = START_YEAR;
let d = 0;
let dataYear = {};

while (date.getFullYear() <= 2100) {
	let datestring = date.toISOString().slice(0,10);

	try {

		let res = await fetch(`https://aa.usno.navy.mil/api/rstt/oneday?id=kennybar&date=${datestring}&coords=${MY_COORDS}`);
		let o = await res.json();
		dataYear[datestring] = o;

	} catch (err) {

		console.log(`error fetching data for ${datestring}`, );
		fs.writeFile(`${DIR_ALL}/${currYear}-error.json`, JSON.stringify(dataYear), (err) => {
			if (err) {
				console.log(`error writing errored daily sun and moon file for year ${currYear}`, );
				throw err
			};
			console.log(`The daily sun moon error file for year ${currYear} has been saved!`);
		});

	}

	date.setDate(date.getDate() + 1);

	d++;
	if (d % 10 == 0)
		status(d, currYear);

	// when encounter new year, save to file, start new dict
	if (date.getFullYear() > currYear) {
		fs.writeFile(`${DIR_ALL}/${currYear}.json`, JSON.stringify(dataYear), (err) => {
			if (err) {
				console.log(`error writing daily sun and moon file for year ${currYear}`, );
				throw err
			};
			console.log(`The daily sun moon file for year ${currYear} has been saved!`);
		});

		currYear = date.getFullYear();
		dataYear = {};
		d = 0;
	}

}

function status(d, currYear) {
	let daysInYear = isLeapYear(currYear) ? 366 : 365;
	let percentageComplete = ((d / daysInYear) * 100).toFixed(2);
	// clear line
	process.stdout.write(`\r${' '.repeat(process.stdout.columns)}\r`);
	// write line
	process.stdout.write(`\rYear ${currYear}: ${percentageComplete}% complete (${d}/${daysInYear} days fetched).`);
	// console.log(`Year ${currYear}: ${percentageComplete}% complete (${d}/${daysInYear} days fetched).`);
}

function isLeapYear(y) {
	return (y % 4 === 0 && y% 100 !== 0) || y% 400 === 0;
}