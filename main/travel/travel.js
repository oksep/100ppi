"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crawler = require("crawler");
const cheerio = require("cheerio");
const date_1 = require("./date");
const content_1 = require("./mock/content");
const model_1 = require("./model");
const fs = require("fs");
function travelTr2Exchange(tr) {
    const text = tr.children().first().text();
    if (text.includes('暂无数据')) {
        throw new Error('暂无数据');
    }
    const isExchange = text.includes('交易所');
    if (isExchange) {
        return text.trim();
    }
    else {
        return null;
    }
}
// 遍历 tr 拆分成商品数据
function travelTr2Commodity(tr) {
    const tds = tr.children();
    // 商品名
    const name = tds.first().text();
    // 现货
    const spotGoodsTd = tds.eq(1);
    const spotGoods = new model_1.SpotGoods(parseFloat(spotGoodsTd.text().trim()));
    // 最近合约
    const recentContracts = genRecentContracts(tds);
    // 主力合约
    const mainContracts = genMainContracts(tds);
    return new model_1.Commodity(name, spotGoods, recentContracts, mainContracts);
}
function genRecentContracts(tds) {
    const subTd = tds.find('font');
    return new model_1.Contracts(tds.eq(2).text().trim(), parseFloat(tds.eq(3).text().trim()), subTd.eq(0).text().trim(), subTd.eq(1).text().trim());
}
function genMainContracts(tds) {
    const subTd = tds.find('font');
    return new model_1.Contracts(tds.eq(5).text().trim(), parseFloat(tds.eq(6).text().trim()), subTd.eq(2).text().trim(), subTd.eq(3).text().trim());
}
function travel($) {
    // const trs = $('table#fdata.ftab').children('tbody').first().children('tr');
    const trs = $('#fdata.ftab').children();
    const result = {};
    let lastExchangeName = 'Unknown';
    for (let i = 2; i < trs.length; i++) {
        const tr = trs.eq(i);
        try {
            const exchangeName = travelTr2Exchange(tr);
            if (exchangeName != null) {
                lastExchangeName = exchangeName;
            }
            else {
                const list = result[lastExchangeName] || [];
                result[lastExchangeName] = list;
                list.push(travelTr2Commodity(tr));
            }
        }
        catch (e) {
            // console.error(e.message);
            return null;
        }
    }
    return result;
}
function travelMock() {
    const $ = cheerio.load(content_1.default);
    return travel($);
}
function startTravel(arg, callback) {
    const urls = date_1.getDates(arg.from, arg.to).map(date => {
        return {
            uri: `http://www.100ppi.com/sf/day-${date}.html`,
            date: date
        };
    });
    const total = urls.length;
    const c = new Crawler({
        rateLimit: 850,
        // maxConnections: 10,
        callback: function (error, res, done) {
            const date = res.options.date;
            const uri = res.options.uri;
            if (error) {
                callback(`failed: ${uri}`, c.queueSize, total);
            }
            else {
                if (res.statusCode > 400) {
                    callback(`failed: ${uri}`, c.queueSize, total);
                }
                else {
                    const result = travel(res.$);
                    if (result != null) {
                        fs.writeFile(`${arg.saveDir}/${date}.json`, JSON.stringify(result, null, 2), 'utf8', (err) => {
                            callback(`${err ? 'error' : 'ok'}: ${uri}`, c.queueSize - 1, total);
                        });
                    }
                    else {
                        callback(`failed: ${uri}`, c.queueSize, total);
                    }
                }
            }
            done();
        }
    });
    c.on('drain', function () {
        callback(null, 1, total);
    });
    c.queue(urls);
}
exports.startTravel = startTravel;
//# sourceMappingURL=travel.js.map