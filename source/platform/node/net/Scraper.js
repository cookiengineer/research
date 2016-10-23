
lychee.define('app.net.Scraper').tags({
	platform: 'node'
}).requires([
	'app.net.scraper.Reddit'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('http');
			global.require('https');

			return true;

		} catch(err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _http    = global.require('http');
	const _https   = global.require('https');
	const _scraper = lychee.import('app.net.scraper');
	const _PLUGINS = {};



	/*
	 * HELPERS
	 */

	const _request = function(url) {

		return new Promise((resolve, reject) => {

			let library = url.startsWith('https') ? _https : _http;
			let request = library.get(url, response => {

				let chunks = [];
				let status = response.statusCode;

				if (status < 200 || status > 399) {

					reject(new Error('Failed to request ' + url + ':' + status));

				} else {

					response.on('data',  tmp => chunks.push(tmp));
					response.on('error', err => reject(err));
					response.on('end',   _   => resolve(Buffer.concat(chunks)));

				}

			});

			request.on('error', err => reject(err));

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		request: function(data, callback, scope) {

			data     = data instanceof Object       ? data     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (data !== null && callback !== null) {

				let url  = typeof data.url === 'string' ? data.url : null;
				let type = data.type || null;

				if (url !== null) {

					_request(url).then(result => {

						if (type === 'json') {

							let tmp = null;

							try {
								tmp = JSON.parse(result);
							} catch(e) {
								tmp = null;
							}

							callback.call(scope, tmp);

						} else {

							callback.call(scope, result);

						}

					});

				} else {

					callback.call(scope, null);

				}

			}

		},

		scrape: function(data, callback, scope) {

			data     = data instanceof Object       ? data     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (data !== null && callback !== null) {

				let url = typeof data.url === 'string' ? data.url : null;
				if (url !== null) {

					let deferred = false;

					for (let id in _PLUGINS) {

						let plugin = _PLUGINS[id] || null;
						if (plugin.can(url)) {

							plugin.scrape(url, function(result) {
								callback.call(scope, result);
							});

							deferred = true;
							break;

						}

					}

					if (deferred === false) {
						callback.call(scope, null);
					}

				}

			}

		}

	};


	for (let id in _scraper) {
		_PLUGINS[id] = new _scraper[id](Module);
	}


	return Module;

});

