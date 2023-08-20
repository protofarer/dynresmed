#!/usr/bin/env node

// increased noetic power intake during waning fortnight, calculated as such: 
// 0. Lunar phase time: down to the minute
// 1. Resonance point: 2 days minus 4 hours after full moon and similarly after third quarter (waning half moon)
// 2. Day: Containing nearest sunset to lunar point
// 3. Time: 15 min before sunset
// 4. Show the next 10 Resonance Points and mark them with respective Session Number

import SunCalc from 'suncalc';

// per suncalc
const NEW_MOON = 0.0;
const FULL_MOON = 1.0;
const Q3_MOON = 0.75;

// the desired date objects corresponding to
let NewMoonTime, FullMoonTime, Q3MoonTime;

let now = new Date();
// let now = new Date(1972, 1, 0);
console.log(`now`, now)

let fromNow = new Date(now);
// fromNow.setDate(now.getDate() + 25);
let currIllum = SunCalc.getMoonIllumination(now);
let currAngle = currIllum.angle;
let prevAngle = currAngle;
let currPhase = currIllum.phase;
let prevPhase = currPhase;

// add 1 day until the illum value crosses 0, e.g. when angle flips signs
for (let i = 0; i < 30; i++) {
	fromNow.setDate(fromNow.getDate() + 1)
	console.log(fromNow.toDateString() + " " + fromNow.toTimeString());

	const illum = SunCalc.getMoonIllumination(fromNow);
	currAngle = illum.angle;
	currPhase = illum.phase;

	// console.log(`frac: ${illum.fraction}`, )
	console.log(`phase: ${illum.phase}`, )
	// console.log(`angle: ${illum.angle}`, )

	// waxing if angle < 0
	// waning if angle > 0
	// console.log(`prevAngle:`, prevAngle);
	// console.log(`currAngle:`, currAngle);
	// console.log(`prevPhase:`, prevPhase );
	// console.log(`currPhase:`, currPhase );
	
	
	// TODO check for full moon and 3Q
	// new moon occurs at phase === 0

	// check new moon occurred between days
	if (currPhase < prevPhase) {
		console.log(`\n=============== FOUND NEW MOON, DAY CROSSED ================`, )
		
		let curr = new Date(fromNow);
		curr.setDate(curr.getDate() - 1);
		console.log(`back 1 day:`, curr.toDateString() + " " + curr.toTimeString());
		

		let currNewPhase = SunCalc.getMoonIllumination(curr).phase;
		let prevNewPhase = currNewPhase;

		// check between what minutes new moon occurred
		for (let j = 0; j < 24 * 60; j++) {
			curr.setMinutes(curr.getMinutes() + 1);
			const illum = SunCalc.getMoonIllumination(curr);
			currNewPhase = illum.phase;
			console.log(`iter phase(${j}): `, currNewPhase)
			

			if (currNewPhase < prevNewPhase) {
				// store new moon time
				curr.setMinutes(curr.getMinutes() - 1);
				NewMoonTime = curr;

				console.log("NEW MOON: " + curr.toDateString() + " " + curr.toTimeString());

				// const year = curr.getUTCFullYear();
				// const month = String(curr.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
				// const day = String(curr.getUTCDate()).padStart(2, '0');
				// const hours = String(curr.getUTCHours()).padStart(2, '0');
				// const minutes = String(curr.getUTCMinutes()).padStart(2, '0');
				// const seconds = String(curr.getUTCSeconds()).padStart(2, '0');
				// const utcString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
				// console.log(utcString);
				console.log(curr.toISOString() )
				

				console.log(``, )
				
				break;
			}
			prevNewPhase = currNewPhase;
		}
	}


	prevAngle = currAngle;
	prevPhase = currPhase;

	console.log(`-----------------`, )
}


// TODO handle edge cases, marked phase nearby in the past
// check now - someDuration first