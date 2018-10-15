import moment from 'moment';

const URLS = [];
const start = moment('2018-09-27', 'YYYY-MM-DD');
const end = moment('2018-10-27', 'YYYY-MM-DD');
const days = end.diff(start, 'days');
for (let i = 0; i < days; i++) {
	const d = start.add(1, 'days');
	// d.format('MMMM Do YYYY, h:mm:ss a')
	const url = `http://www.100ppi.com/sf/day-${d.format('YYYY-MM-DD')}.html`;
	URLS.push(url);
}

export default URLS;