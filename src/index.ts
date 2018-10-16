import {travel} from './travel';

import fs from 'fs';

import Crawler from 'crawler';
import DATES from "./date";

const BASE_URL = 'http://www.100ppi.com/sf/day-';

const c = new Crawler({
	maxConnections: 10,
	// This will be called for each crawled page
	callback: function (error, res, done) {
		const date = res.options.uri.substring(BASE_URL.length).split('.html')[0];
		if (error) {
			console.log('Error date', date, error);
		} else {
			if (res.statusCode > 400) {
				console.log('Error', date, res.statusCode);
			} else {
				const result = travel(res.$);
				if (result != null) {
					console.log(date, 'completed');
					fs.writeFile(`/Users/renyufeng/Desktop/cvs/${date}.json`, JSON.stringify(result, null, 2), 'utf8', () => {
					});
				} else {
					console.log(date, 'failed');
				}
			}
		}
		done();
	}
});

const urls = DATES.map(date => `${BASE_URL}${date}.html`);
c.queue(urls);