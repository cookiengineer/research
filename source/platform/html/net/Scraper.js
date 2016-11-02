
lychee.define('app.net.Scraper').tags({
	platform: 'html'
}).requires([
	'app.net.scraper.Reddit'
]).supports(function(lychee, global) {

	if (typeof global.XMLHttpRequest === 'function') {
		return true;
	}

	return true;
	// return false;

}).exports(function(lychee, global, attachments) {

	const _XHR     = global.XMLHttpRequest;
	const _scraper = lychee.import('app.net.scraper');
	const _PLUGINS = {};



	/*
	 * HELPERS
	 */

	const _request_html = function(url, callback) {

		let xhr = new _XHR();

		xhr.open('GET', url);

		xhr.responseType = 'text';
		xhr.setRequestHeader('Content-Type', 'text/html');

		xhr.onload = function() {

			let data = xhr.response;
			if (data !== null) {
				callback(data);
			} else {
				callback(null);
			}

		};

		xhr.send(null);

	};

	const _request_json = function(url, callback) {

		let xhr = new _XHR();

		xhr.open('GET', url);

		xhr.responseType = 'json';
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onload = function() {

			let data = xhr.response;
			if (data !== null) {
				callback(data);
			} else {
				callback(null);
			}

		};

		xhr.send(null);

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

				if (data.type === 'json') {
					_request_json(data.url, callback.bind(scope));
				} else if (data.type === 'html') {
					_request_html(data.url, callback.bind(scope));
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
							plugin.scrape(url, callback, scope);
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

