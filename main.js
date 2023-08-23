#!/usr/bin/env node

// generate the resonant meditation times for each day of each year up to 2100
// only produces sessions within year, sessions falling outside of year are discarded

import createSessions from 'lib';

const DIR_SUNSET = "sourcedata/dailysunset";
const DIR_LUNARPHASE = "sourcedata/lunarphase";
const DIR_SESSIONS = "data/sessions";

// read from sourcedata/lunarphase/2023.json the next full moon date and time
// calculate the amount of time between that full moon and the next last quarter moon
// subtract that time from the full moon time
// find the nearest sunset time to that time and subtract 15 minutes
// that is the start time of the first session

const now = new Date();
const currYear = now.getFullYear();
createSessions(currYear, DIR_SUNSET, DIR_LUNARPHASE, DIR_SESSIONS);