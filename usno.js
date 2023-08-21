#!/usr/bin/env node

// fetch dates for major lunar phases for each year up to 2100
// cull each JSON to the following fields for each phase date: phase, year, month, day, time
// concatenate all JSONs into one JSON
// write to text file to be used as a lookup table

let x = {
  apiversion: '4.0.1',
  numphases: 50,
  phasedata: [
    { day: 3, month: 1, phase: 'New Moon', time: '05:16', year: 1984 },
    {
      day: 11,
      month: 1,
      phase: 'First Quarter',
      time: '09:48',
      year: 1984
    },
    {
      day: 18,
      month: 1,
      phase: 'Full Moon',
      time: '14:05',
      year: 1984
    },
    {
      day: 25,
      month: 1,
      phase: 'Last Quarter',
      time: '04:48',
      year: 1984
    },
    { day: 1, month: 2, phase: 'New Moon', time: '23:46', year: 1984 },
    {
      day: 10,
      month: 2,
      phase: 'First Quarter',
      time: '04:00',
      year: 1984
    },
    {
      day: 17,
      month: 2,
      phase: 'Full Moon',
      time: '00:41',
      year: 1984
    },
    {
      day: 23,
      month: 2,
      phase: 'Last Quarter',
      time: '17:12',
      year: 1984
    },
    { day: 2, month: 3, phase: 'New Moon', time: '18:31', year: 1984 },
    {
      day: 10,
      month: 3,
      phase: 'First Quarter',
      time: '18:28',
      year: 1984
    },
    {
      day: 17,
      month: 3,
      phase: 'Full Moon',
      time: '10:10',
      year: 1984
    },
    {
      day: 24,
      month: 3,
      phase: 'Last Quarter',
      time: '07:58',
      year: 1984
    },
    { day: 1, month: 4, phase: 'New Moon', time: '12:10', year: 1984 },
    {
      day: 9,
      month: 4,
      phase: 'First Quarter',
      time: '04:51',
      year: 1984
    },
    {
      day: 15,
      month: 4,
      phase: 'Full Moon',
      time: '19:11',
      year: 1984
    },
    {
      day: 23,
      month: 4,
      phase: 'Last Quarter',
      time: '00:26',
      year: 1984
    },
    { day: 1, month: 5, phase: 'New Moon', time: '03:45', year: 1984 },
    {
      day: 8,
      month: 5,
      phase: 'First Quarter',
      time: '11:50',
      year: 1984
    },
    {
      day: 15,
      month: 5,
      phase: 'Full Moon',
      time: '04:29',
      year: 1984
    },
    {
      day: 22,
      month: 5,
      phase: 'Last Quarter',
      time: '17:45',
      year: 1984
    },
    { day: 30, month: 5, phase: 'New Moon', time: '16:48', year: 1984 },
    {
      day: 6,
      month: 6,
      phase: 'First Quarter',
      time: '16:42',
      year: 1984
    },
    {
      day: 13,
      month: 6,
      phase: 'Full Moon',
      time: '14:42',
      year: 1984
    },
    {
      day: 21,
      month: 6,
      phase: 'Last Quarter',
      time: '11:10',
      year: 1984
    },
    { day: 29, month: 6, phase: 'New Moon', time: '03:18', year: 1984 },
    {
      day: 5,
      month: 7,
      phase: 'First Quarter',
      time: '21:04',
      year: 1984
    },
    {
      day: 13,
      month: 7,
      phase: 'Full Moon',
      time: '02:20',
      year: 1984
    },
    {
      day: 21,
      month: 7,
      phase: 'Last Quarter',
      time: '04:01',
      year: 1984
    },
    { day: 28, month: 7, phase: 'New Moon', time: '11:51', year: 1984 },
    {
      day: 4,
      month: 8,
      phase: 'First Quarter',
      time: '02:33',
      year: 1984
    },
    {
      day: 11,
      month: 8,
      phase: 'Full Moon',
      time: '15:43',
      year: 1984
    },
    {
      day: 19,
      month: 8,
      phase: 'Last Quarter',
      time: '19:41',
      year: 1984
    },
    { day: 26, month: 8, phase: 'New Moon', time: '19:26', year: 1984 },
    {
      day: 2,
      month: 9,
      phase: 'First Quarter',
      time: '10:30',
      year: 1984
    },
    {
      day: 10,
      month: 9,
      phase: 'Full Moon',
      time: '07:01',
      year: 1984
    },
    {
      day: 18,
      month: 9,
      phase: 'Last Quarter',
      time: '09:31',
      year: 1984
    },
    { day: 25, month: 9, phase: 'New Moon', time: '03:11', year: 1984 },
    {
      day: 1,
      month: 10,
      phase: 'First Quarter',
      time: '21:53',
      year: 1984
    },
    {
      day: 9,
      month: 10,
      phase: 'Full Moon',
      time: '23:58',
      year: 1984
    },
    {
      day: 17,
      month: 10,
      phase: 'Last Quarter',
      time: '21:14',
      year: 1984
    },
    {
      day: 24,
      month: 10,
      phase: 'New Moon',
      time: '12:08',
      year: 1984
    },
    {
      day: 31,
      month: 10,
      phase: 'First Quarter',
      time: '13:07',
      year: 1984
    },
    {
      day: 8,
      month: 11,
      phase: 'Full Moon',
      time: '17:43',
      year: 1984
    },
    {
      day: 16,
      month: 11,
      phase: 'Last Quarter',
      time: '06:59',
      year: 1984
    },
    {
      day: 22,
      month: 11,
      phase: 'New Moon',
      time: '22:57',
      year: 1984
    },
    {
      day: 30,
      month: 11,
      phase: 'First Quarter',
      time: '08:01',
      year: 1984
    },
    {
      day: 8,
      month: 12,
      phase: 'Full Moon',
      time: '10:53',
      year: 1984
    },
    {
      day: 15,
      month: 12,
      phase: 'Last Quarter',
      time: '15:25',
      year: 1984
    },
    {
      day: 22,
      month: 12,
      phase: 'New Moon',
      time: '11:47',
      year: 1984
    },
    {
      day: 30,
      month: 12,
      phase: 'First Quarter',
      time: '05:27',
      year: 1984
    }
  ],
  year: 1984
};

let quarters = {
	'New Moon': 0,
	'First Quarter': 1,
	'Full Moon': 2,
	'Last Quarter': 3
}

const table = x.phasedata.map(x => {
	return {
		...x,
		phase: quarters[x.phase]
	}
});

console.log(table)


// import fs from 'fs';
// fs.writeFile(`${year}.json`, JSON.stringify(table), (err) => {
// 	if (err) throw err;
// 	console.log('The file has been saved!');
// });



// for (let i = 2023; i <= 2024; i++) {
// 	let res = await fetch(`https://aa.usno.navy.mil/api/moon/phases/year?year=${i}`);
// 	let o = await res.json();
// 	console.log(o);
// 	console.log(`no. per year`, o.phasedata.length)
	
// }