import {travel} from './travel';

import fs from 'fs';

import Crawler from 'crawler';
import DATES from "./date";

const c = new Crawler({
	rateLimit: 1000,
	// maxConnections: 10,
	callback: function (error, res, done) {
		const date = res.options.date;
		if (error) {
			console.log('Error date', date, error);
		} else {
			if (res.statusCode > 400) {
				console.log('Error', date, res.statusCode);
			} else {
				const result = travel(res.$);
				if (result != null) {
					console.log(date, 'completed');
					fs.writeFile(`/Users/renyufeng/Desktop/cvs2/${date}.json`, JSON.stringify(result, null, 2), 'utf8', () => {
					});
				} else {
					console.log(date, 'failed');
				}
			}
		}
		done();
	}
});

const urls = DATES.map(date => {
	return {
		uri: `http://www.100ppi.com/sf/day-${date}.html`,
		date: date
	}
});

c.queue(urls);