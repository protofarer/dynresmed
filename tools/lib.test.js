import fs from 'fs';
import { expect, test } from 'vitest';;
import { 
	getPhaseData,
	getSunsetData,
	findNearestSunset,
	findSunsetDatetimeByDay,
	findFirstSunsetAfter,
	findSessions, 
} from './lib.js';
import { DIR_TOOLS, QUARTERS } from './dataCommon.js';


test('find sunset by day', () => {
	const sunsets = getSunsetData(2023);

	// * expected happy path
	// finds sunset on same day even if difference is more than 12 hours
	const dt = new Date("2023-01-01");
	const sunset1 = findSunsetDatetimeByDay(dt, sunsets);
	expect(sunset1).toEqual(new Date("2023-01-01T22:42Z"));
	
	// finds sunset on same day despite specifying a time
	const dt2 = new Date("2023-01-01T23:59Z");
	const sunset2 = findSunsetDatetimeByDay(dt2, sunsets);
	expect(sunset2).toEqual(new Date("2023-01-01T22:42Z"));

	// can get last 10 sunsets of previous year
	const dt3 = new Date("2022-12-31");
	const sunset3 = findSunsetDatetimeByDay(dt3, sunsets);
	expect(sunset3).toEqual(new Date("2022-12-31T22:42Z"));

	const dt5 = new Date("2022-12-30");
	const sunset5 = findSunsetDatetimeByDay(dt5, sunsets);
	expect(sunset5).toEqual(new Date("2022-12-30T22:41Z"));

	const dt6 = new Date("2022-12-29");
	const sunset6 = findSunsetDatetimeByDay(dt6, sunsets);
	expect(sunset6).toEqual(new Date("2022-12-29T22:40Z"));

	const dt7 = new Date("2022-12-28");
	const sunset7 = findSunsetDatetimeByDay(dt7, sunsets);
	expect(sunset7).toEqual(new Date("2022-12-28T22:40Z"));

	const dt8 = new Date("2022-12-27");
	const sunset8 = findSunsetDatetimeByDay(dt8, sunsets);
	expect(sunset8).toEqual(new Date("2022-12-27T22:39Z"));

	const dt9 = new Date("2022-12-26");
	const sunset9 = findSunsetDatetimeByDay(dt9, sunsets);
	expect(sunset9).toEqual(new Date("2022-12-26T22:39Z"));

	const dt10 = new Date("2022-12-25");
	const sunset10 = findSunsetDatetimeByDay(dt10, sunsets);
	expect(sunset10).toEqual(new Date("2022-12-25T22:38Z"));

	const dt11 = new Date("2022-12-24");
	const sunset11 = findSunsetDatetimeByDay(dt11, sunsets);
	expect(sunset11).toEqual(new Date("2022-12-24T22:38Z"));

	const dt12 = new Date("2022-12-23");
	const sunset12 = findSunsetDatetimeByDay(dt12, sunsets);
	expect(sunset12).toEqual(new Date("2022-12-23T22:37Z"));

	const dt13 = new Date("2022-12-22");
	const sunset13 = findSunsetDatetimeByDay(dt13, sunsets);
	expect(sunset13).toEqual(new Date("2022-12-22T22:36Z"));

	// can get first 8 sunsets of next year
	const dt4 = new Date("2024-01-01");
	const sunset4 = findSunsetDatetimeByDay(dt4, sunsets);
	expect(sunset4).toEqual(new Date("2024-01-01T22:42Z"));

	const dt14 = new Date("2024-01-02");
	const sunset14 = findSunsetDatetimeByDay(dt14, sunsets);
	expect(sunset14).toEqual(new Date("2024-01-02T22:43Z"));

	const dt15 = new Date("2024-01-03");
	const sunset15 = findSunsetDatetimeByDay(dt15, sunsets);
	expect(sunset15).toEqual(new Date("2024-01-03T22:44Z"));

	const dt16 = new Date("2024-01-04");
	const sunset16 = findSunsetDatetimeByDay(dt16, sunsets);
	expect(sunset16).toEqual(new Date("2024-01-04T22:44Z"));

	const dt17 = new Date("2024-01-05");
	const sunset17 = findSunsetDatetimeByDay(dt17, sunsets);
	expect(sunset17).toEqual(new Date("2024-01-05T22:45Z"));

	const dt18 = new Date("2024-01-06");
	const sunset18 = findSunsetDatetimeByDay(dt18, sunsets);
	expect(sunset18).toEqual(new Date("2024-01-06T22:46Z"));

	const dt19 = new Date("2024-01-07");
	const sunset19 = findSunsetDatetimeByDay(dt19, sunsets);
	expect(sunset19).toEqual(new Date("2024-01-07T22:46Z"));

	const dt20 = new Date("2024-01-08");
	const sunset20 = findSunsetDatetimeByDay(dt20, sunsets);
	expect(sunset20).toEqual(new Date("2024-01-08T22:47Z"));

	// * expected error path
	// no further than 11 sunsets into prevous year
	const dt21 = new Date("2022-12-20");
	const sunset21 = findSunsetDatetimeByDay(dt21, sunsets);
	expect(sunset21).toBeNull();

	// no further than 8 sunsets into next year
	const dt22 = new Date("2024-01-09");
	const sunset22 = findSunsetDatetimeByDay(dt22, sunsets);
	expect(sunset22).toBeNull();

	// cannot get from years more than +/- 1 year
	const dt23 = new Date("2021-12-31");
	const sunset23 = findSunsetDatetimeByDay(dt23, sunsets);
	expect(sunset23).toBeNull();

	const dt24 = new Date("2025-01-01");
	const sunset24 = findSunsetDatetimeByDay(dt24, sunsets);
	expect(sunset24).toBeNull();
})

test('nearest sunset', () => {
	const sunsets = getSunsetData(2023);
	const dt = new Date("2023-01-01");

	// sunset day before: 2022-12-31T22:42Z
	// sunset day of: 2023-01-01T22:42Z
	// sunset day after: 2023-01-02T22:43Z

	const sunset = findNearestSunset(dt, sunsets);
	expect(sunset).toEqual(new Date("2022-12-31T22:42Z"));

	const dt2 = new Date("2023-01-01T12:30Z");
	const sunset2 = findNearestSunset(dt2, sunsets);
	expect(sunset2).toEqual(new Date("2023-01-01T22:42Z"));

	const dt3 = new Date("2023-01-02T23:59Z");
	const sunset3 = findNearestSunset(dt3, sunsets);
	expect(sunset3).toEqual(new Date("2023-01-02T22:43Z"));
})

test('first sunset after', () => {
	const year = 2023;
	const sunsets = getSunsetData(year);
	// sunset day of: 2023-01-01T22:42Z
	// sunset day after: 2023-01-02T22:43Z

	// specify time before sunset, gets sunset same day
	const dt = new Date("2023-01-01");
	const sunset = findFirstSunsetAfter(dt, sunsets, year);
	expect(sunset).toEqual(new Date("2023-01-01T22:42Z"));

	// gets next sunset when time specified interesects a sunset
	const dt2 = new Date("2023-01-01T22:42Z");
	const sunset2 = findFirstSunsetAfter(dt2, sunsets, year);
	expect(sunset2).toEqual(new Date("2023-01-02T22:43Z"));

	// specify time after a sunset, gets next sunset
	const dt5 = new Date("2023-01-01T23:00Z");
	const sunset5 = findFirstSunsetAfter(dt5, sunsets, year);
	expect(sunset5).toEqual(new Date("2023-01-02T22:43Z"));

	// prev year data available
	const dt3 = new Date("2022-12-31");
	const sunset3 = findFirstSunsetAfter(dt3, sunsets, year);
	expect(sunset3).toEqual(new Date("2022-12-31T22:42Z"));

	// next year data available
	const dt4 = new Date("2024-01-01");
	const sunset4 = findFirstSunsetAfter(dt4, sunsets, year);
	expect(sunset4).toEqual(new Date("2024-01-01T22:42Z"));

	// specified date is outside the sunset limit (dates included for calc) but next sunset falls within range

	// date point (out of sunset data range) may be before sunset same day and
	// thus correctly failing to return that sunset but for the wrong reason
	// (couldnt find a sunset for that day), but if the date point is after that
	// excluded sunset we would never know because I simply dont have the time for
	// that excluded sunset. And so, to be able to make that check I must include
	// one more sunset in previous year (from 10 to 11). Does the same apply to
	// next year? :: No.
	// correction: keep that extra sunset, but no sunset should be returned if it
	// falls on same day of a date point outside of included range (see
	// PREV_YEAR_SUNSET_LIMIT)
	const dt6 = new Date("2022-12-21T23:00Z");
	const sunset6 = findFirstSunsetAfter(dt6, sunsets, year);
	expect(sunset6).toEqual(new Date("2022-12-22T22:36Z"));

	// * expected error path
	// if sunset earlier than last 10 sunsets of previous year, returns null
	const dt7 = new Date("2022-12-21");
	const sunset7 = findFirstSunsetAfter(dt7, sunsets, year);
	
	expect(sunset7).toBeNull();

	const dt8 = new Date("2022-12-20");
	const sunset8 = findFirstSunsetAfter(dt8, sunsets, year);
	expect(sunset8).toBeNull();

})

test.only('sessions for: early year full moon with nearest sunset in prev year', () => {
	const file = fs.readFileSync(`${DIR_TOOLS}/testYears.json`);
	const data = JSON.parse(file).dayOnePhaseSunsetPrevFULL;

	// verify expected test data
	const year = data.year;
	expect(year).toEqual(2048);

	const phase = data.phase;
	expect(phase).toEqual(QUARTERS.FULL);

	const phases = getPhaseData(year);
	const sunsets = getSunsetData(year);

	const sessions = findSessions(phases, sunsets, year);
	console.log(`1st phase`, phases[0])
	console.log(`2nd phase`, phases[1])
	sessions.sort((a,b) => new Date(Object.keys(a)[0]).getTime() - new Date(Object.keys(b)[0]).getTime());
	console.log(`sessions`, sessions.slice(0,15))
	
})