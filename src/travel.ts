import MOCK_CONTENT from './mock/content';
import cheerio from 'cheerio';
import {Commodity, Contracts, SpotGoods} from './model';

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

export function travel($: CheerioStatic): any {
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

export function travelMock() {
	const $ = cheerio.load(MOCK_CONTENT);
	return travel($)
}