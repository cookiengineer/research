
lychee.define('app.Scraper').tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	const _fetch   = global.fetch;
	const _Request = global.Request;



	/*
	 * HELPERS
	 */

	const _fetch_html = function(url, callback) {
	};

	const _fetch_json = function(url, callback) {

		let request = new _Request(url, {
			cache: 'default',
			mode:  'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

console.log(request);

		_fetch(request).then(response => {
console.log(response);

//			response.json().then(json => {
//console.log(json);
//			});

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	let Module = {

		/*
		 * CUSTOM API
		 */

		scrape: function(settings, callback) {

			settings = settings instanceof Object   ? settings : null;
			callback = callback instanceof Function ? callback : null;


			let data = Object.assign({
				url:  null,
				type: 'html'
			}, settings);


			if (data.url !== null && callback !== null) {

				if (data.type === 'html') {
					_fetch_html(data.url, callback);
				} else if (data.type === 'json') {
					_fetch_json(data.url, callback);
				} else {
					callback(null);
				}

			}

		}

	};


	return Module;

});


