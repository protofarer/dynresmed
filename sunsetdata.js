#!/usr/bin/env node

// extract the date and sunset time from the daily sun and moon source data

import fs from 'fs';
import path from 'path';

const DIR_ALL = "sourcedata/dailysunmoon";
const DIR_SUNSET = "sourcedata/dailysunset";

const files = fs.readdirSync(DIR_ALL);

files.forEach(file => {
	const filePath = path.join(DIR_ALL, file);

	// check if json
	if (path.extname(filePath) !== ".json")
		return;

	try {
		// read
		const rawFile = fs.readFileSync(filePath, 'utf8');
		const allData = JSON.parse(rawFile);

		// filter
		const sunsetData = {};
		for (let date in allData) {
			sunsetData[date] = allData[date].properties.data.sundata.find(x => x.phen === "Set")?.time || null;
		}

		// write
		const targetFilePath = path.join(DIR_SUNSET, file);
		fs.writeFileSync(targetFilePath, JSON.stringify(sunsetData, null, 2));
		console.log(`Processed sunset data for file ${file} saved!`);
	} catch (err) {
		console.error(`Error processing file ${file}: ${err.message}`);
	}

});