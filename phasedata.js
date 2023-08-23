#!/usr/bin/env node

// fetch dates for major lunar phases for each year up to 2100
// cull each JSON to the following fields for each phase date: phase, year, month, day, time
// concatenate all JSONs into one JSON
// write to text file to be used as a lookup table

import fs from 'fs';

// fetch, transform, store lunar phase data from US Naval Observatory API
// https://aa.usno.navy.mil/data/api#phase

const QUARTERS = {
	'New Moon': 0,
	'Full Moon': 2,
	'Last Quarter': 3
};

const START_YEAR = 2022;
const END_YEAR = 2022;
const DIR = "sourcedata/lunarphase";

for (let year = START_YEAR; year <= START_YEAR; year++) {
	let res = await fetch(`https://aa.usno.navy.mil/api/moon/phases/year?year=${year}`);
	let o = await res.json();
	const table = o.phasedata.map(x => {
		return {
			...x,
			phase: QUARTERS[x.phase]
		}
	});

	fs.writeFile(`${DIR}/${year}.json`, JSON.stringify(table), (err) => {
		if (err) {
			console.log(`error writing file for year ${year}`, );
			
			throw err
		};
		console.log(`The file for year ${year} has been saved!`);
	});
}