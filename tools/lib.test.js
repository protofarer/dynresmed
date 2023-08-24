import { expect, test } from 'vitest';;
import { 
	getSunsetData,
	findNearestSunset,
	findSunsetDatetimeByDay,
	findFirstSunsetAfter, 
} from './lib.js';


test('find sunset by day', () => {
	const sunsets = getSunsetData(2023);

	const dt = new Date("2023-01-01");
	const sunset1 = findSunsetDatetimeByDay(dt, sunsets);
	
	const dt2 = new Date("2023-01-01T23:59Z");
	const sunset2 = findSunsetDatetimeByDay(dt2, sunsets);
	expect(sunset2).toEqual(new Date("2023-01-01T22:42Z"));

	// uses prev year sunset
	const dt3 = new Date("2022-12-31");
	const sunset3 = findSunsetDatetimeByDay(dt3, sunsets);
	expect(sunset3).toEqual(new Date("2022-12-31T22:42Z"));

	// uses next year sunset
	const dt4 = new Date("2024-01-01");
	const sunset4 = findSunsetDatetimeByDay(dt4, sunsets);
	
	expect(sunset4).toEqual(new Date("2024-01-01T22:42Z"));
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
	const sunsets = getSunsetData(2023);
	const dt = new Date("2023-01-01");

	// sunset day of: 2023-01-01T22:42Z
	// sunset day after: 2023-01-02T22:43Z

	const sunset = findFirstSunsetAfter(dt, sunsets);
	expect(sunset).toEqual(new Date("2023-01-01T22:42Z"));

	const dt2 = new Date("2023-01-01T22:42Z");
	const sunset2 = findFirstSunsetAfter(dt2, sunsets);
	expect(sunset2).toEqual(new Date("2023-01-02T22:43Z"));

	const dt3 = new Date("2022-12-31");
	const sunset3 = findFirstSunsetAfter(dt3, sunsets);
	expect(sunset3).toEqual(new Date("2022-12-31T22:42Z"));

	const dt4 = new Date("2022-12-31T22:42Z");
	const sunset4 = findFirstSunsetAfter(dt4, sunsets);
	expect(sunset4).toEqual(new Date("2023-01-01T22:42Z"));
})