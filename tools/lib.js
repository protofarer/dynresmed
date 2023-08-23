import fs from 'fs';

const DIR_SUNSET = "sourcedata/dailysunset";
const DIR_PHASE = "sourcedata/lunarphase";

export function createSessions(year, dir_sessions) {

	// * READ, TRANSFORM, LOAD DATA
	const phases = getPhaseData(year);
	const sunsets = getSunsetData(year);

	// * CALCULATE SESSIONS

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

		// NEW MOON
		if (data.phase === 0) {

			cycle.n = data.time;

			// when new moon, can calculate T_2 and sessions 7-10
			// when prev last quarter moon not in curr year, get previous year
			if (!cycle?.lq) {
				const listLastQuarters = phasePrevYearLastMonth.filter(x => x.phase === 3);
				const lq = listLastQuarters[listLastQuarters.length - 1];
				cycle.lq = lq;	// unhappy about object reference, but ok javascript
			}
			cycle.t2 = cycle.n - cycle.lq;

			const s7 = findSession7(p.lq, p.t2, sunsets);	// 7: sunset nearest
			const s8 = findSession8(p.lq, p.t2, sunsets);	// 8: sunset nearest
			const s9 = findSession9(p.lq, p.t2, sunsets);	// 9: sunset nearest

			// 10: sunset nearest new moon
			// TODO session 10's time potentially falls in previous or next year, so instead of
			// pulling last/next year's sunset data, check if the nearest sunset AFTER/BEFORE is
			// within 12 hours, and if it is, include this session
			const s10 = findSession10(p.n);

			sessions.push(s7, s8, s9, s10);

		// TODO whenever encounter last quarter, find next new moon and calculate sessions that can use that data
		} else if (x.phase === 2) {
			cycle.f = data.time;
			const s2 = findSession2(cycle.f, sunsets);				// session 2: 1st sunset after full moon
			sessions.push(s2);

		} else if (x.phase === 3) {
			cycle.lq = data.time;

			// when last quarter moon, can calculate T_1 and sessions 1-6
			// when prev full moon not in curr year, get previous year
			if (!cycle?.f) {
				const listFull = phasePrevYearLastMonth.filter(x => x.phase === 2);
				const f = listFull[listFull.length - 1];
				cycle.f = f;	// unhappy about object reference, but ok javascript
			}
			cycle.t1 = cycle.lq - cycle.f;

			// 1: sunset nearest this
			// session 1's time potentially falls in previous year, so instead of
			// pulling last year's sunset data, check if the nearest sunset AFTER is
			// within 12 hours, if it is, include this session
			const s1 = findSession1(cycle.f, cycle.t1, sunsets);
			const s3 = findSession3(cycle.f, cycle.t1, sunsets);	// 3: sunset nearest
			const s4 = findSession4(cycle.f, cycle.t1, sunsets);	// 4: sunset nearest
			const s5 = findSession5(cycle.f, cycle.t1, sunsets);	// 5: sunset nearest
			const s6 = findSession6(cycle.lq, sunsets);			// 6: sunset nearest last quarter moon

			sessions.push(s1, s2, s3, s4, s5, s6);
		}
	});
}

export function findSunsetDatetimeByDay(date, sunsets) {
	const dateString = date.toJSON().slice(0,10);
	
	const sunsetTime = sunsets?.[dateString];

	if (!sunsetTime) {
		console.error(`No sunset found for date ${dateString}`);
		return null;
	}
	const sunset = new Date(`${dateString}T${sunsetTime}Z`);

	// ? are any of these sunsets more than 12 hours from the date?
	const diff = Math.abs(sunset - date) / (1000 * 60 * 60); // hours
	if (diff >= 12)
		console.log(`bug: distant sunset found, hours from pt:`, diff )

	return sunset;
}

// * Alternatively, the nearest sunset that is found from some offset +/-T
// * from another sunset would have to fall +/- 2 days from that sunset add the
export function findNearestSunset1(date, sunsets) {
}

// Since doesn't return sunsets that outside of year, return null if no sunset found within 12 hours
export function findNearestSunset2(date, sunsets) {
	let min = Infinity;
	for (let x of sunsets) {

		// construct date object based on element and convert numeric values into properly "0" padded strings for use in Date constructor
		// NB: time is already padded in lunar phase data
		// NB: lunar phase data is ordered chronologically
		const sunset = makeDateFromSunsetObject(x);
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

export function makeDateFromSunsetObject(obj) {
		const month = String(obj.month.padStart(2, '0'));
		const day = String(obj.day.padStart(2, '0'));
		return new Date(`${obj.year}-${month}-${day}T${obj.time}`);
}

export function findFirstSunsetAfterWithinYear(date) {
	// date argument must be within year
	for (let x of dataSunset) {
		const datetime = makeDateFromSunsetObject(x);
		if (datetime > date) {
			return datetime;
		}
	}
	return null;
}

export function findSession1(datetimeFullMoon, t1, sunsets) {
	const fullMinusT1 = new Date(datetimeFullMoon.getTime() - p.t1);
	return findSunsetDatetimeByDay(fullMinusT1, sunsets); // if null, discard session
}

export function findSession2(datetimeFullMoon, sunsets) {
	return findFirstSunsetAfterWithinYear(datetimeFullMoon, sunsets);
}

export function findSession3(datetimeFullMoon, t1, sunsets) {
	const fullPlusT1 = new Date(datetimeFullMoon.getTime() + p.t1);
	return findSunsetDatetimeByDay(fullPlusT1, sunsets);
}

export function findSession4(datetimeFullMoon, t1, sunsets) {
	const fullPlus2T1 = new Date(datetimeFullMoon.getTime() + 2*p.t1);
	return findSunsetDatetimeByDay(fullPlus2T1, sunsets);
}

export function findSession5(datetimeFullMoon, t1, sunsets) {
	const fullPlus3T1 = new Date(datetimeFullMoon.getTime() + 3*p.t1);
	return findSunsetDatetimeByDay(fullPlus3T1, sunsets);
}

export function findSession6(datetimeLastQuarter, sunsets) {
	return findSunsetDatetimeByDay(datetimeLastQuarter, sunsets);
}

export function findSession7(datetimeLastQuarter, t2, sunsets) {
	const lastQuarterPlusT2 = new Date(datetimeLastQuarter.getTime() + p.t2);
	return findSunsetDatetimeByDay(lastQuarterPlusT2, sunsets);
}

export function findSession8(datetimeLastQuarter, t2, sunsets) {
	const lastQuarterPlus2T2 = new Date(datetimeLastQuarter.getTime() + 2*p.t2);
	return findSunsetDatetimeByDay(lastQuarterPlus2T2, sunsets);
}

export function findSession9(datetimeLastQuarter, t2, sunsets) {
	const lastQuarterPlus3T2 = new Date(datetimeLastQuarter.getTime() + 3*p.t2);
	return findSunsetDatetimeByDay(lastQuarterPlus3T2, sunsets);
}

export function findSession10(datetimeNewMoon, sunsets) {
	return findSunsetDatetimeByDay(datetimeNewMoon, sunsets);
}

export function read(filepath) {
	const file = fs.readFileSync(filepath);
	return JSON.parse(file);
}

export function getPhaseData(year) {
	const data = read(`${DIR_PHASE}/${year}.json`);

	// needed for calculations near edges of the year
	const dataPrev = read(`${DIR_PHASE}/${year-1}.json`);
	const dataPrevYearLastMonth = dataPrev[dataPrev.length - 1];
	const dataNext = read(`${DIR_PHASE}/${year+1}.json`);
	const dataNextYearFirstMonth = dataNext[0];

	return [dataPrevYearLastMonth, ...data, dataNextYearFirstMonth];
}

export function getSunsetData(year) {
	const data = read(`${DIR_SUNSET}/${year}.json`);

	// needed for calculations near edges of the year
	const dataPrev = read(`${DIR_SUNSET}/${year-1}.json`);
	const prevYearLast2Sunsets = {
		[`${year-1}-12-30`]: dataPrev[`${year-1}-12-30`],
		[`${year-1}-12-31`]: dataPrev[`${year-1}-12-31`]
	};

	const dataNext = read(`${DIR_SUNSET}/${year+1}.json`);
	const nextYearFirst2Sunsets = {
		[`${year+1}-01-01`]: dataNext[`${year+1}-01-01`],
		[`${year+1}-01-02`]: dataNext[`${year+1}-01-02`]
	};

	return {
		...prevYearLast2Sunsets, 
		...data, 
		...nextYearFirst2Sunsets
	};
}
