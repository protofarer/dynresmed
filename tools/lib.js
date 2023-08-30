import fs from 'fs';
import os from 'os';
import path from 'path';

import { DIR_SUNSET, DIR_PHASE } from './dataCommon.js';
import { QUARTERS } from './dataCommon.js';

const NEXT_YEAR_SUNSET_LIMIT = 8;
const PREV_YEAR_SUNSET_LIMIT = 11; // 11th sunset not a valid result, only used in findFirstSunsetAfter calculation

export function generateSessionsByYear(year, dir_sessions) {

	// * READ, TRANSFORM, LOAD DATA
	const phases = getPhaseData(year);
	const sunsets = getSunsetData(year);

	// * CALCULATE SESSIONS

	const sessions = findSessions(phases, sunsets, year);
	return sessions;
}

export function findSessions(phases, sunsets, year) {
	let sessions = []; // end result, a list of session start times and session no.
	let cycle = {}; // store times and data for current cycle

	// phases: 0=new, 2=full, 3=last quarter
	// let cycle = {
	// 	f: '2023-01-01T00:00:00.000Z',
	// 	lq: '2023-01-01T00:00:00.000Z',
	// 	n: '2023-01-01T00:00:00.000Z',
	// 	t1: 'lq - f',
	// 	t2: 'n - lq',
	// }

	phases.forEach((data, idx) => {
		const [hours, minutes] = data.time.split(":").map(x => parseInt(x));
		const phaseDatetime = new Date(Date.UTC(data.year, data.month - 1, data.day, hours, minutes));

		// NEW MOON
		if (data.phase === QUARTERS.NEW) {

			// ! TODO convert time to UTC date object
			cycle.n = phaseDatetime;

			// when new moon, can calculate T_2 and sessions 7-10
			// phase data includes last phase of prev year, so if new moon is first
			// phase in phae data, there won't be a prev last quarter moon to calc T_2
			// nor sessions 7-9
			if (cycle?.lq) {
				cycle.t2 = (cycle.n - cycle.lq) / 4;
				console.log(`t2(hr):`, cycle.t2 / (1000 * 60 * 60));

				const s7 = findSession7(cycle.lq, cycle.t2, sunsets);	// 7: LQ + T_2 sunset nearest
				const s8 = findSession8(cycle.lq, cycle.t2, sunsets);	// 8: LQ + 2*T_2 sunset nearest
				const s9 = findSession9(cycle.lq, cycle.t2, sunsets);	// 9: LQ + 3*T_2 sunset nearest
				sessions.push({[s7?.toISOString()]: 7},{[s8?.toISOString()]: 8},{[s9?.toISOString()]: 9});
			}

			// 10: sunset nearest new moon
			const s10 = findSession10(cycle.n, sunsets);

			// dont push if s10 null (nearest sunset out of range)
			if (s10 !== null) 
				sessions.push({ [s10?.toISOString()]: 10 });

		} else if (data.phase === QUARTERS.FULL) {
			cycle.f = phaseDatetime;
			const s2 = findSession2(cycle.f, sunsets, year);	// 2: sunset after full moon
			sessions.push({[s2?.toISOString()]: 2});

		} else if (data.phase === QUARTERS.LAST) {
			cycle.lq = phaseDatetime;

			// when last quarter moon, can calculate T_1 and sessions 1-6
			// when prev full moon not in curr year, get previous year
			// if no full moon, can't do T_1 calcs
			if (cycle?.f) {
				cycle.t1 = (cycle.lq - cycle.f) / 4;
				console.log(`t1(hr):`, cycle.t1 / (1000 * 60 * 60));

				// session 1's time potentially falls in previous year, so instead of
				// pulling last year's sunset data, check if the nearest sunset AFTER is
				// within 12 hours, if it is, include this session
				const s1 = findSession1(cycle.f, cycle.t1, sunsets);	// 1: FM - T_1 sunset nearest
				const s3 = findSession3(cycle.f, cycle.t1, sunsets);	// 3: FM + T_1 sunset nearest
				const s4 = findSession4(s3, cycle.t1, sunsets);	// 4: FM + 2*T_1 sunset nearest
				const s5 = findSession5(s4, cycle.t1, sunsets);	// 5: FM + 3*T_1 sunset nearest
				sessions.push(
					{[s1?.toISOString()]: 1}, 
					{[s3?.toISOString()]: 3}, 
					{[s4?.toISOString()]: 4}, 
					{[s5?.toISOString()]: 5}
				);
			}

			const s6 = findSession6(cycle.lq, sunsets);			// 6: sunset nearest last quarter moon
			sessions.push({[s6?.toISOString()]: 6});
		}
	});

	return sessions;
}

// Since doesn't return sunsets that outside of year, return null if no sunset found within 12 hours
export function findNearestSunset(date, sunsets) {
	// check sunset from day before, day of, and day after
	const sunsetBefore = findSunsetDatetimeByDay(new Date(date.getTime() - (1000 * 60 * 60 * 24)), sunsets);
	const sunsetCurrent = findSunsetDatetimeByDay(date, sunsets);
	const sunsetAfter = findSunsetDatetimeByDay(new Date(date.getTime() + (1000 * 60 * 60 * 24)), sunsets);

	const sunsetsAdjacent = [sunsetBefore, sunsetCurrent, sunsetAfter];
	// console.log(`sunsetsadjacent`, sunsetsAdjacent);

	let min = Infinity;
	let sunsetNearest = null;
	for (let sunset of sunsetsAdjacent) {
		// construct date object based on element and convert numeric values into properly "0" padded strings for use in Date constructor
		// NB: time is already padded in lunar phase data
		// NB: lunar phase data is ordered chronologically
		const diff = date - sunset;
		// console.log(`diff`, diff)
		
		if (Math.abs(diff) < Math.abs(min)) {
			min = diff;
			sunsetNearest = sunset;
		} else {
			break;
		}
	};

	return sunsetNearest;
}

export function findSunsetDatetimeByDay(date, sunsets) {
	// use for sunsets found by some multiple of T_1 or T_2 from another sunset
	const dateString = date.toJSON().slice(0,10);
	
	const sunsetTime = sunsets?.[dateString];

	if (!sunsetTime) {
		// console.error(`No sunset found for date ${dateString}`);
		return null;
	}

	return new Date(`${dateString}T${sunsetTime}Z`);
}

export function convertSunsetDataToDate(obj) {
		const month = String(obj.month.padStart(2, '0'));
		const day = String(obj.day.padStart(2, '0'));
		return new Date(`${obj.year}-${month}-${day}T${obj.time}Z`);
}

export function convertPhaseDataToDate(obj) {
		const month = String(obj.month).padStart(2, '0');
		const day = String(obj.day).padStart(2, '0');
		return new Date(`${obj.year}-${month}-${day}T${obj.time}Z`);
}

function findDateByDaysFrom(date, days) {
	// days can be negative
	date.setDate(date.getDate() + days);
	return date;
}

export function findFirstSunsetAfter(date, sunsets, year) {
	const dateString = date.toJSON().slice(0,10);
	const sunsetTimeCurrent = sunsets?.[dateString];

	// out of range
	if (!sunsetTimeCurrent) {
		return null;
	}

	const sunsetDatetimeCurrent = new Date(`${dateString}T${sunsetTimeCurrent}Z`);
	const prevYearSunsetLimitDay = findDateByDaysFrom(new Date(`${year}-01-01`), -PREV_YEAR_SUNSET_LIMIT + 1);

	// out of range: result date falls on date excluded from calculation data set
	if(sunsetDatetimeCurrent > date) {
		if (sunsetDatetimeCurrent < prevYearSunsetLimitDay) {
			return null;
		}
		return sunsetDatetimeCurrent;
	}

	const dateDayAfter = new Date(date);
	dateDayAfter.setDate(date.getDate() + 1);
	const dateStringDayAfter = dateDayAfter.toJSON().slice(0,10);
	const sunsetTimeDayAfter = sunsets?.[dateStringDayAfter];

	// out of range
	if (!sunsetTimeDayAfter) {
		return null;
	}
	const sunsetDatetimeDayAfter = new Date(`${dateStringDayAfter}T${sunsetTimeDayAfter}Z`);

	return sunsetDatetimeDayAfter;
}

export function findSession1(datetimeFullMoon, t1, sunsets) {
	// TODO use precise nearest sunset
	const fullMinusT1 = new Date(datetimeFullMoon.getTime() - t1);
	return findNearestSunset(fullMinusT1, sunsets); // if null, discard session
}

export function findSession2(datetimeFullMoon, sunsets, year) {
	return findFirstSunsetAfter(datetimeFullMoon, sunsets, year);
}

export function findSession3(datetimeFullMoon, t1, sunsets) {
	const fullPlusT1 = new Date(datetimeFullMoon.getTime() + t1);
	return findNearestSunset(fullPlusT1, sunsets);
}

export function findSession4(s3, t1, sunsets) {
	const fullPlus2T1 = new Date(s3.getTime() + 2*t1);
	return findNearestSunset(fullPlus2T1, sunsets);
}

export function findSession5(s4, t1, sunsets) {
	const fullPlus3T1 = new Date(s4.getTime() + 3*t1);
	return findNearestSunset(fullPlus3T1, sunsets);
}

export function findSession6(datetimeLastQuarter, sunsets) {
	return findNearestSunset(datetimeLastQuarter, sunsets);
}

export function findSession7(datetimeLastQuarter, t2, sunsets) {
	const lastQuarterPlusT2 = new Date(datetimeLastQuarter.getTime() + t2);
	return findNearestSunset(lastQuarterPlusT2, sunsets);
}

export function findSession8(s7, t2, sunsets) {
	const lastQuarterPlus2T2 = new Date(s7.getTime() + 2*t2);
	return findNearestSunset(lastQuarterPlus2T2, sunsets);
}

export function findSession9(s8, t2, sunsets) {
	const lastQuarterPlus3T2 = new Date(s8.getTime() + 3*t2);
	return findNearestSunset(lastQuarterPlus3T2, sunsets);
}

export function findSession10(datetimeNewMoon, sunsets) {
	return findNearestSunset(datetimeNewMoon, sunsets);
}

export function read(filepath) {
	try {
		const file = fs.readFileSync(filepath);
		return JSON.parse(file);
	} catch (err) {
		console.error(`Error reading file ${filepath}: ${err.message}`);
		throw err;
	}
}

export function getPhaseData(year) {
	try {
		const data = read(`${DIR_PHASE}/${year}.json`);
	
		// needed for calculations near edges of the year
		const dataPrev = read(`${DIR_PHASE}/${year-1}.json`);
		// ? Probably only need last phase of the year
		const lastPhasePrevYear = dataPrev[dataPrev.length - 1];
	
		const dataNext = read(`${DIR_PHASE}/${year+1}.json`);
		const firstPhaseNextYear = dataNext[0];
	
		return [lastPhasePrevYear, ...data, firstPhaseNextYear];
	} catch (err) {
		throw err;
	}
}

export function getSunsetData(year) {
	const data = read(`${DIR_SUNSET}/${year}.json`);

	// needed for calculations near edges of the year
	const dataPrev = read(`${DIR_SUNSET}/${year-1}.json`);
	let prevYearDayCounter = new Date(`${year-1}-12-31`);

	// const prevYearLast10Sunsets = {
	// 	[`${year-1}-12-22`]: dataPrev[`${year-1}-12-22`],
	// 	[`${year-1}-12-23`]: dataPrev[`${year-1}-12-23`],
	// 	[`${year-1}-12-24`]: dataPrev[`${year-1}-12-24`],
	// 	[`${year-1}-12-25`]: dataPrev[`${year-1}-12-25`],
	// 	[`${year-1}-12-26`]: dataPrev[`${year-1}-12-26`],
	// 	[`${year-1}-12-27`]: dataPrev[`${year-1}-12-27`],
	// 	[`${year-1}-12-28`]: dataPrev[`${year-1}-12-28`],
	// 	[`${year-1}-12-29`]: dataPrev[`${year-1}-12-29`],
	// 	[`${year-1}-12-30`]: dataPrev[`${year-1}-12-30`],
	// 	[`${year-1}-12-31`]: dataPrev[`${year-1}-12-31`]
	// };
	let prevYearSunsets = {};
	for (let i = 0; i < PREV_YEAR_SUNSET_LIMIT; i++) {
		const prevYearDay = prevYearDayCounter.toJSON().slice(0,10);
		const prevYearSunset = dataPrev[prevYearDay];
		prevYearSunsets[prevYearDay] = prevYearSunset;
		prevYearDayCounter.setDate(prevYearDayCounter.getDate() - 1);
	}

	const dataNext = read(`${DIR_SUNSET}/${year+1}.json`);
	// const nextYearFirst8Sunsets = {
	// 	[`${year+1}-01-01`]: dataNext[`${year+1}-01-01`],
	// 	[`${year+1}-01-02`]: dataNext[`${year+1}-01-02`],
	// 	[`${year+1}-01-03`]: dataNext[`${year+1}-01-03`],
	// 	[`${year+1}-01-04`]: dataNext[`${year+1}-01-04`],
	// 	[`${year+1}-01-05`]: dataNext[`${year+1}-01-05`],
	// 	[`${year+1}-01-06`]: dataNext[`${year+1}-01-06`],
	// 	[`${year+1}-01-07`]: dataNext[`${year+1}-01-07`],
	// 	[`${year+1}-01-08`]: dataNext[`${year+1}-01-08`]
	// };
	let nextYearSunsets = {};
	let nextYearDayCounter = new Date(`${year+1}-01-01`);
	for (let i = 0; i < NEXT_YEAR_SUNSET_LIMIT; i++) {
		const nextYearDay = nextYearDayCounter.toJSON().slice(0,10);
		const nextYearSunset = dataNext[nextYearDay];
		nextYearSunsets[nextYearDay] = nextYearSunset;
		nextYearDayCounter.setDate(nextYearDayCounter.getDate() + 1);
	}

	return {
		...prevYearSunsets, 
		...data, 
		...nextYearSunsets
	};
}

export function isLeapYear(y) {
	return (y % 4 === 0 && y% 100 !== 0) || y% 400 === 0;
}