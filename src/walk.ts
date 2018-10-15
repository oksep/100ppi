import Crawler from 'crawler';

const c = new Crawler({
	maxConnections : 10,
	// This will be called for each crawled page
	callback : function (error, res, done) {
		if(error){
			console.log('Error', error);
		}else{
			var $ = res.$;
			console.log($);
			// $ is Cheerio by default
			//a lean implementation of core jQuery designed specifically for the server
			// console.log($(".xqb-tit").text());
			// console.log($('.ftab').html())
			// const table = $('.ftab')[0];
			// console.log('Keys: ', Object.keys(table));
			// console.log('Children: ', table.children[0].html());
		}
		done();
	}
});

// Queue just one URL, with default callback
c.queue('http://www.100ppi.com/sf/day-2018-09-27.html');