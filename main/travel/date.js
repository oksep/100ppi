"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function getDates(from, to) {
    const DATES = [];
    const start = moment(from, 'YYYY-MM-DD');
    const end = moment(to, 'YYYY-MM-DD');
    const days = end.diff(start, 'days');
    DATES.push(start.format('YYYY-MM-DD'));
    for (let i = 0; i < days; i++) {
        const d = start.add(1, 'days');
        // d.format('MMMM Do YYYY, h:mm:ss a')
        DATES.push(d.format('YYYY-MM-DD'));
    }
    return DATES;
}
exports.getDates = getDates;
//# sourceMappingURL=date.js.map