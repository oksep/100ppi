import moment from 'moment';

const DATES = [];
const start = moment('2018-09-27', 'YYYY-MM-DD');
const end = moment('2018-10-16', 'YYYY-MM-DD');
const days = end.diff(start, 'days');
for (let i = 0; i < days; i++) {
	const d = start.add(1, 'days');
	// d.format('MMMM Do YYYY, h:mm:ss a')
	DATES.push(d.format('YYYY-MM-DD'));
}

export default DATES;