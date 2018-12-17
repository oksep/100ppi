import * as Crawler from 'crawler';

import {getDates} from "./date";

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

function travel2($: CheerioStatic): Commodity[] {
	const trs = $('#fdata.ftab').children();
	const list: Commodity[] = [];

	let lastExchangeName = 'Unknown';

	for (let i = 2; i < trs.length; i++) {
		const tr = trs.eq(i);

		try {
			const exchangeName = travelTr2Exchange(tr);
			if (exchangeName != null) {
				lastExchangeName = exchangeName;
			} else {
				list.push(travelTr2Commodity(tr));
			}
		} catch (e) {
			return null;
		}
	}
	return list;
}

export function startTravel(arg: { from, to, slowCheck, saveDir }, callback) {

	const fileStateCache: {
		[key: string]: boolean
	} = {};

	function dump(saveDir: string, date: string, list: Commodity[]) {
		list.forEach((item: Commodity) => {
			const file = `${saveDir}/${item.name}.csv`;
			const firstDump = fileStateCache[item.name];
			if (!firstDump) {
				fileStateCache[item.name] = true;
				if (fs.existsSync(file)) {
					fs.unlinkSync(file);
				}
				const title = [
					'日期',
					'现货',
					'最近合约  代码',
					'最近合约  价格',
					'最近合约  现期差 value',
					'最近合约  现期差 percent',
					'主力合约  代码',
					'主力合约  价格',
					'主力合约  现期差 value',
					'主力合约  现期差 percent'
				].join(',') + '\n';
				fs.appendFileSync(file, title, {encoding: 'utf-8'});
			}
			const text = [
				date,
				// 现货
				item.spotGoods.price,
				// 最近合约
				item.recentContracts.code,
				item.recentContracts.price,
				item.recentContracts.numbricValue,
				item.recentContracts.percentValue,
				// 主力合约
				item.mainContracts.code,
				item.mainContracts.price,
				item.mainContracts.numbricValue,
				item.mainContracts.percentValue,
			].join(',') + '\n';
			fs.appendFileSync(file, text, {encoding: 'utf-8'});
		});
	}

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
					const result = travel2(res.$);
					if (result != null) {
						try {
							dump(arg.saveDir, date, result);
							callback(`ok: ${uri}`, c.queueSize, total);
						} catch (e) {
							console.error('Error', e);
							callback(`Error: ${uri}`, c.queueSize, total);
						}
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
