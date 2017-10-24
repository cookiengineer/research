
lychee.define('app.net.Scraper').requires([
]).exports(function(lychee, global, attachments) {

	const _https  = require('https');
	const _http   = require('http');
	const _url    = require('url');
	const _QS     = require('querystring');
	const _JSON   = lychee.import('JSON');
	const _AGENTS = [

		// Phones and Tablets
		'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
		'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586',
		'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
		'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
		'Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',

		// TV Boxes
		'Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36',
		'Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
		'Mozilla/5.0 (Linux; Android 4.2.2; AFTB Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.173 Mobile Safari/537.22',
		'AppleTV5,3/9.1.1',

		// Consoles and Readers
		'Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US',
		'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586',
		'Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)',
		'Mozilla/5.0 (PlayStation Vita 3.61) AppleWebKit/537.73 (KHTML, like Gecko) Silk/3.2',
		'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+',

		// Desktop Browsers
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
		'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
		'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'

		// Search Bots
		// 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
		// 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
		// 'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)'

	];



	/*
	 * HELPERS
	 */

	const _get_useragent = function() {
		return _AGENTS[(Math.random() * _AGENTS.length) | 0];
	};

	const _get_headers = function(url, method) {

		let headers = {
			'content-type': 'text/html'
		};


		let stealth = this.main.settings.stealth === true;
		if (stealth === true) {
			headers['user-agent'] = _get_useragent();
		} else {
			headers['user-agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Samaritan/13.37';
		}


		let file = url.split('/').pop().split('?')[0];
		if (file.endsWith('.json')) {
			headers['content-type'] = 'application/json';
		} else if (file.endsWith('.txt')) {
			headers['content-type'] = 'text/plain';
		}


		return headers;

	};

	const _request = function(url, method, headers, params, callback) {

		let tmp      = _url.parse(url);
		let type     = headers['content-type'];
		let encoding = /^(application\/json|text\/html|text\/plain)$/g.test(type) ? 'utf8' : 'binary';
		let options  = {
			method:   method,
			hostname: tmp.hostname,
			headers:  headers,
			path:     tmp.path
		};

		let request = null;

		if (method === 'GET') {
			options.query = _QS.stringify(params);
		}


		if (url.startsWith('https:')) {

			request = _https.request(options, response => {

				let chunks = [];

				response.setEncoding(encoding);
				response.on('data', chunk => chunks.push(chunk));
				response.on('end', _ => {

					if (encoding === 'utf8') {
						callback(chunks.join(''));
					} else {
						callback(Buffer.concat(chunks));
					}

				});

			});


		} else if (url.startsWith('http:')) {

			request = _https.request(options, response => {

				let chunks = [];

				response.setEncoding(encoding);
				response.on('data', chunk => chunks.push(chunk));
				response.on('end', _ => {

					console.log('response end', chunks);

					if (encoding === 'utf8') {
						callback(chunks.join(''));
					} else {
						callback(Buffer.concat(chunks));
					}

				});

			});

		}


		if (request !== null) {

			request.on('error', err => {
				callback(null);
			});

			if (method !== 'GET') {
				request.write(JSON.stringify(params));
			}

			request.end();

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.main = main || null;

	};


	Composite.prototype = {



		/*
		 * CUSTOM API
		 */

		query: function(query) {

			query = query instanceof Object ? query : {};


			return new Promise(function(resolve, reject) {

				let url     = query.url     || null;
				let method  = query.method  || 'GET';
				let headers = query.headers || _get_headers.call(this, url, method);
				let params  = query.params  || {};

				if (url !== null) {

					_request(url, method, headers, params, function(result) {

						resolve({
							query:  query,
							result: result
						});

					});

				} else {

					reject(null);

				}

			}.bind(this));

		}

	};


	return Composite;

});

