import * as Crawler from 'crawler';
import * as cheerio from 'cheerio';

import {getDates} from "./date";
import MOCK_CONTENT from './mock/content';

import {Commodity, Contracts, SpotGoods} from './model';

import * as fs from 'fs';

function travelTr2Exchange(tr: Cheerio): string {
	const text = tr.children().first().text();
	if (text.includes('暂无数据')) {
		throw new Error('暂无数据');
	}
	const isExchange = text.includes('交易所');
	if (isExchange) {
		return text.trim();
	} else {
		return null
	}
}

// 遍历 tr 拆分成商品数据
function travelTr2Commodity(tr: Cheerio): Commodity {
	const tds = tr.children();

	// 商品名
	const name = tds.first().text();

	// 现货
	const spotGoodsTd = tds.eq(1);
	const spotGoods = new SpotGoods(
		parseFloat(spotGoodsTd.text().trim())
	);

	// 最近合约
	const recentContracts = genRecentContracts(tds);

	// 主力合约
	const mainContracts = genMainContracts(tds);

	return new Commodity(name, spotGoods, recentContracts, mainContracts);
}

function genRecentContracts(tds: Cheerio): Contracts {
	const subTd = tds.find('font');
	return new Contracts(
		tds.eq(2).text().trim(),
		parseFloat(tds.eq(3).text().trim()),
		subTd.eq(0).text().trim(),
		subTd.eq(1).text().trim()
	);
}

function genMainContracts(tds: Cheerio): Contracts {
	const subTd = tds.find('font');
	return new Contracts(
		tds.eq(5).text().trim(),
		parseFloat(tds.eq(6).text().trim()),
		subTd.eq(2).text().trim(),
		subTd.eq(3).text().trim()
	);
}

function travel($: CheerioStatic): any {
	// const trs = $('table#fdata.ftab').children('tbody').first().children('tr');
	const trs = $('#fdata.ftab').children();
	const result: { [key: string]: Commodity[] } = {};

	let lastExchangeName = 'Unknown';

	for (let i = 2; i < trs.length; i++) {
		const tr = trs.eq(i);

		try {
			const exchangeName = travelTr2Exchange(tr);

			if (exchangeName != null) {
				lastExchangeName = exchangeName;
			} else {
				const list = result[lastExchangeName] || [];
				result[lastExchangeName] = list;
				list.push(travelTr2Commodity(tr));
			}
		} catch (e) {
			// console.error(e.message);
			return null;
		}
	}
	return result;
}

function travelMock() {
	const $ = cheerio.load(MOCK_CONTENT);
	return travel($)
}

export function startTravel(arg: { from, to, slowCheck, saveDir }, callback) {

	const urls = getDates(arg.from, arg.to).map(date => {
		return {
			uri: `http://www.100ppi.com/sf/day-${date}.html`,
			date: date
		}
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
			} else {
				if (res.statusCode > 400) {
					callback(`failed: ${uri}`, c.queueSize, total);
				} else {
					const result = travel(res.$);
					if (result != null) {
						fs.writeFile(`${arg.saveDir}/${date}.json`, JSON.stringify(result, null, 2), 'utf8', (err) => {
							callback(`${err ? 'error' : 'ok'}: ${uri}`, c.queueSize - 1, total);
						});
					} else {
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
