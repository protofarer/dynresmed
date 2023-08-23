import { expect, test } from 'vitest';;
import { 
	getSunsetData,
	findSunsetDatetimeByDay,
	findFirstSunsetAfterWithinYear 
} from './lib.js';

test('find sunset by day', () => {
	const sunsets = getSunsetData(2023);

	const dt = new Date("2023-01-01");
	const sunset1 = findSunsetDatetimeByDay(dt, sunsets);
	expect(sunset1).toEqual(new Date("2023-01-01T22:42Z"));
	
	const dt2 = new Date("2023-01-01T22:59Z");
	const sunset2 = findSunsetDatetimeByDay(dt2, sunsets);
	console.log(`sunset2`, sunset2)
	
	expect(sunset2).toEqual(new Date("2023-01-01T22:42Z"));
})