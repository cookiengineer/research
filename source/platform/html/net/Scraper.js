
lychee.define('app.net.Scraper').tags({
	platform: 'html'
}).requires([
	'app.net.scraper.Reddit'
]).supports(function(lychee, global) {

	return true;

}).exports(function(lychee, global, attachments) {

	const _scraper = lychee.import('app.net.scraper');
	const _PLUGINS = {};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		request: function(data, callback, scope) {

			data     = data instanceof Object       ? data     : null;
			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			if (data !== null && callback !== null) {

console.log('REQUESTING URL', data);

callback.call(scope, null);

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

