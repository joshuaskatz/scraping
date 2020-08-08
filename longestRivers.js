const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const fetchData = (query) => {
	const title = query.replace(' ', '_');

	const url = `https://en.wikipedia.org/api/rest_v1/page/html/${title}`;

	axios
		.get(url)
		.then((response) => getData(response.data))
		.then((data) =>
			fs.writeFileSync('rivers.json', data, (err) => console.log(err))
		)
		.catch((err) => console.log(err));
};

const getData = (html) => {
	data = [];
	const $ = cheerio.load(html);
	$('table.wikitable.sortable tbody tr')
		.not(':nth-child(1)')
		.each((i, elem) => {
			data.push({
				river: $(elem).find('a').first().text(),
				mouth: $(elem).find('a').eq(1).text(),
				lengthMiles: $(elem).find('span').first().text(),
				sourceCoordinates: `${$(elem)
					.find('span.latitude')
					.first()
					.text()} ${$(elem).find('span.longitude').first().text()}`,
				mouthCoordinates: `${$(elem)
					.find('span.geo-dec')
					.first()
					.text()}`,
				watershedAreaSqMiles: $(elem)
					.find('span[data-sort-value]')
					.eq(1)
					.text(),
				dischargeCubicFtPerSec: $(elem)
					.find('span[data-sort-value]')
					.eq(2)
					.text()
			});
		});

	return JSON.stringify(data, null, 2);
};

fetchData('List of longest rivers of the United States (by main stem)');
