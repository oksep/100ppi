"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const DATES = [];
const start = moment('2018-09-27', 'YYYY-MM-DD');
const end = moment('2018-09-28', 'YYYY-MM-DD');
const days = end.diff(start, 'days');
for (let i = 0; i < days; i++) {
    const d = start.add(1, 'days');
    // d.format('MMMM Do YYYY, h:mm:ss a')
    DATES.push(d.format('YYYY-MM-DD'));
}
exports.default = DATES;
//# sourceMappingURL=date.js.map