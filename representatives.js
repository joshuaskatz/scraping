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
			fs.writeFileSync('representatives.json', data, (err) =>
				console.log(err)
			)
		)
		.catch((err) => console.log(err));
};

const getData = (html) => {
	data = [];
	const $ = cheerio.load(html);
	$('table#votingmembers tbody tr').not(':nth-child(1)').each((i, elem) => {
		data.push({
			district: $(elem).find('span[data-sort-value] a').attr('title'),
			repName: $(elem).find('b').text(),
			party: $(elem).find('td').eq(3).text(),
			assumedOffice: $(elem).find('td').eq(6).text(),
			residence: $(elem).find('td').eq(7).text()
		});
	});

	return JSON.stringify(data, null, 2);
};

fetchData(
	'List of current members of the United States House of Representatives'
);
