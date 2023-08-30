#!/usr/bin/env node

// find years that meet test criteria

import fs from 'fs';
// import path from 'path';
import { findNearestSunset, getPhaseData, getSunsetData } from './tools/lib.js';

// years for which full calendar of sessions will be generated
const START_YEAR = 2023;
const END_YEAR = 2099;

let allResults = {};
// dayOnePhaseSunsetAfter
// dayOnePhaseSunsetBefore
// dayMinusOnePhaseSunsetAfter
// dayMinusOnePhaseSunsetBefore

for (let year = START_YEAR; year < END_YEAR; year++) {
	const phases = getPhaseData(year);
	const sunsets = getSunsetData(year);
	processByYear(year, phases, sunsets, allResults);
	if (
		allResults?.["dayOnePhaseSunsetCurr"] &&
		allResults?.["dayOnePhaseSunsetPrev"] &&
		allResults?.["dayMinusOnePhaseSunsetCurr"] &&
		allResults?.["dayMinusOnePhaseSunsetPrev"]
	) {
		console.log(`Found all desired test case data`);
		process.exit(0);
	}
}

console.log(`allResults:`);
console.table(allResults);

fs.writeFile(`testYears.json`, JSON.stringify(allResults), (err) => {
	if (err) {
		console.log(`error writing file for test years`);
		throw err
	};
	console.log(`The test year file has been saved!`);
});

console.log(`Incomplete test data`, );


function processByYear(year, phases, sunsets, allResults) {
	// fills in gaps in test data across years until matching requirements found

	// a phase on 1st day of current year
	const dayOnePhase = phases.find(
		x => x.year === year && x.month === 1 && x.day === 1 && [0, 2, 3].some(n => n === x.phase)
	);
	
	if (dayOnePhase) {
		console.log(`==========================`, )
		console.log(`found day one phase on ${dayOnePhase.month}/${dayOnePhase.day}/${dayOnePhase.year} @ ${dayOnePhase.time} UTC`, )
		
		const startOfCurrYear = new Date(Date.UTC(year, 0, 1, 0, 0));

		const [hours, minutes] = dayOnePhase.time.split(":").map(x => parseInt(x));
		const dayOnePhaseDatetime = new Date(Date.UTC(year, 0, 1, hours, minutes));

		const nearestSunsetDatetime = findNearestSunset(dayOnePhaseDatetime, sunsets);
		const time = nearestSunsetDatetime.toISOString();
		console.log(`nearest sunset: `, time);
		

		// nearest sunset to phase occurs in curr year
		if (!allResults?.["dayOnePhaseSunsetCurr"]) {
			if (nearestSunsetDatetime >= startOfCurrYear) {
				console.log(`found day one phase curr year`, )
				console.table(dayOnePhase);
				allResults["dayOnePhaseSunsetCurr"] = {
					year,
					phase: dayOnePhase.phase,
					nearestSunset: {
						relation: "curr year",
						time
					}
				};
			}
		}

		// nearest sunset to phase occurs in prev year
		if (!allResults?.["dayOnePhaseSunsetPrev"]) {
			if (nearestSunsetDatetime < startOfCurrYear) {
				console.log(`found day one phase prev year`, )
				console.table(dayOnePhase);
				allResults["dayOnePhaseSunsetPrev"] = {
					year,
					phase: dayOnePhase.phase,
					nearestSunset: {
						relation: "prev year",
						time
					}
				};
			}
		}

	}

	// a phase on last day of prev year
	const dayMinusOnePhase = phases.find(
		x => x.year === year - 1 && x.month === 12 && x.day === 31 && [0, 2, 3].some(n => n === x?.phase)
	);

	if (dayMinusOnePhase) {
		console.log(`==========================`, )
		console.log(`found day minus one phase on ${dayMinusOnePhase.month}/${dayMinusOnePhase.day}/${dayMinusOnePhase.year} @ ${dayMinusOnePhase.time} UTC`, )
		
		const startOfCurrYear = new Date(year, 0, 1);

		const [hours, minutes] = dayMinusOnePhase.time.split(":").map(x => parseInt(x));
		const dayMinusOnePhaseDatetime = new Date(Date.UTC(year - 1, 11, 31, 23, hours, minutes));

		const nearestSunsetDatetime = findNearestSunset(dayMinusOnePhaseDatetime, sunsets);
		const time = nearestSunsetDatetime.toISOString();
		console.log(`nearest sunset: `, time);

		// nearest sunset to phase occurs in curr year
		// ! this never occurs
		if (!allResults?.["dayMinusOnePhaseSunsetCurr"]) {
			if (nearestSunsetDatetime >= startOfCurrYear) {
				console.log(`found day minus one phase curr year`, );
				console.table(dayMinusOnePhase);
				allResults["dayMinusOnePhaseSunsetCurr"] = {
					year,
					phase: dayMinusOnePhase.phase,
					nearestSunset: {
						relation: "curr year",
						time
					}
				};
			}
		}

		// nearest sunset to phase occurs in prev year
		if (!allResults?.["dayMinusOnePhaseSunsetPrev"]) {
			if (nearestSunsetDatetime < startOfCurrYear) {
				console.log(`found day minus one phase prev year`, )
				console.table(dayMinusOnePhase);
				allResults["dayMinusOnePhaseSunsetPrev"] = {
					year,
					phase: dayMinusOnePhase.phase,
					nearestSunset: {
						relation: "prev year",
						time
					}
				};
			}
		}
	}
}
