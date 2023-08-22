#!/usr/bin/env node

// generate the resonant meditation times for each day of each year up to 2100
// only produces sessions within year, sessions falling outside of year are discarded

import fs from 'fs';

const DIR_SUNSET = "sourcedata/dailysunset";
const DIR_LUNARPHASE = "sourcedata/lunarphase";
const DIR_SESSIONS = "data/sessions";
const M15 = 15 * 60 * 1000; // 15 minutes in ms

// read from sourcedata/lunarphase/2023.json the next full moon date and time
// calculate the amount of time between that full moon and the next last quarter moon
// subtract that time from the full moon time
// find the nearest sunset time to that time and subtract 15 minutes
// that is the start time of the first session

const now = new Date();
const currYear = now.getFullYear();

function createSessions(year) {
	const filePhase = fs.readFileSync(`${DIR_LUNARPHASE}}/${year}.json`);
	const dataPhase = JSON.parse(filePhase);

	const fileSunset = fs.readFileSync(`${DIR_SUNSET}}/${year}.json`);
	const dataSunset = JSON.parse(fileSunset)

	// grab the lunar phase times for a given cycle of sessions, aka Cycle
	let cycleParameters = new Array(dataPhase.length).fill({});

	// phases: 0=new, 2=full, 3=last quarter
	// let parameters = {
	// 	f: '2023-01-01T00:00:00.000Z',
	// 	lq: '2023-01-01T00:00:00.000Z',
	// 	n: '2023-01-01T00:00:00.000Z',
	// 	t1: 'lq - f',
	// 	t2: 'n - lq',
	// }

	// calculate T_1 and T_2
	let i = 0;
	dataPhase.forEach(x => {
		if (x.phase === 0) {
			let p = cycleParameters[i];
			p.n = x.time;
			p.t1 = p.lq - p.f;
			p.t2 = p.n - p.lq;

			// * SUNSET NEAREST POINTS AND SESSION START TIMES

			// 1: sunset nearest this
			// session 1's time potentially falls in previous year, so instead of
			// pulling last year's sunset data, check if the nearest sunset AFTER is
			// within 12 hours, if it is, include this session
			const fullMinusT1 = new Date(p.f.getTime() - p.t1);
			const x1 = findNearestSunsetWithinYear(fullMinusT1); // if null, discard session
			const s1 = new Date(x1 - M15);

			// session 2: 1st sunset after full moon
			const x2 = findFirstSunsetAfterWithinYear(p.f);
			const s2 = new Date(x2.getTime() - M15);

			// 3: sunset nearest
			const fullPlusT1 = new Date(p.f.getTime() + p.t1);
			const x3 = findNearestSunsetWithinYear(fullPlusT1);
			const s3 = new Date(x3.getTime() - M15);

			// 4: sunset nearest
			const fullPlus2T1 = new Date(p.f.getTime() + 2*p.t1);
			const x4 = findNearestSunsetWithinYear(fullPlus2T1);
			const s4 = new Date(x4.getTime() - M15)

			// 5: sunset nearest
			const fullPlus3T1 = new Date(p.f.getTime() + 3*p.t1);
			const x5 = findNearestSunsetWithinYear(fullPlus3T1);
			const s5 = new Date(x5.getTime() - M15);

			// 6: sunset nearest last quarter moon
			const x6 = findNearestSunsetWithinYear(p.lq);
			const s6 = new Date(x6.getTime() - M15);

			// 7: sunset nearest
			const lastQuarterPlusT2 = new Date(p.lq.getTime() + p.t2);
			const x7 = findNearestSunsetWithinYear(lastQuarterPlusT2);
			const s7 = new Date(x7.getTime() - M15);

			// 8: sunset nearest
			const lastQuarterPlus2T2 = new Date(p.lq.getTime() + 2*p.t2);
			const x8 = findNearestSunsetWithinYear(lastQuarterPlus2T2);
			const s8 = new Date(x8.getTime() - M15);

			// 9: sunset nearest
			const lastQuarterPlus3T2 = new Date(p.lq.getTime() + 3*p.t2);
			const x9 = findNearestSunsetWithinYear(lastQuarterPlus3T2);
			const s9 = new Date(x9.getTime() - M15);

			// 10: sunset nearest new moon
			// session 10's time potentially falls in previous or next year, so instead of
			// pulling last/next year's sunset data, check if the nearest sunset AFTER/BEFORE is
			// within 12 hours, and if it is, include this session
			const x10 = findNearestSunsetWithinYear(p.n);
			const s10 = new Date(x10.getTime() - M15);
			i++;
		} else if (x.phase === 2) {
			cycleParameters[i].f = x.time;
		} else if (x.phase === 3) {
			cycleParameters[i].lq = x.time;
		}
	})
	
}

// Since doesn't return sunsets that outside of year, return null if no sunset found within 12 hours
function findNearestSunsetWithinYear(date) {
	let min = Infinity;

	for (let x of dataSunset) {
		// construct date object based on element and convert numeric values into properly "0" padded strings for use in Date constructor
		// NB: time is already padded in lunar phase data
		// NB: lunar phase data is ordered chronologically
		const month = String(x.month.padStart(2, '0'));
		const day = String(x.day.padStart(2, '0'));
		const sunset = new Date(`${x.year}-${month}-${day}T${x.time}`);

		const diff = date - sunset;
		if (Math.abs(diff) < Math.abs(min)) {
			min = diff;
		} else {
			break;
		}
	};

	// * DEBUG get familiar with the hour quantity returned to see if the
	// edge case is handled well enough
	console.log(`min in hours:`, min / (1000 * 60 * 60));
	
	// TODO is it accurate to return null if min > 12 hours?
	// return min;
	return new Date(date.getTime() + min);
}

function findFirstSunsetAfterWithinYear(date) {
	// date argument must be within year
	for (let x of dataSunset) {
		const month = String(x.month.padStart(2, '0'));
		const day = String(x.day.padStart(2, '0'));
		const datetime = new Date(`${x.year}-${month}-${day}T${x.time}`);
		if (datetime > date) {
			return datetime;
		}
	}
	return null;
}


sessionOne(currYear);