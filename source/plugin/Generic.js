
lychee.define('app.plugin.Generic').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			require('fetch');

			return true;

		} catch(err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _fetch = require('fetch');



	/*
	 * IMPLEMENTATION
	 */

	let Module = {

		can: function(headers) {

			return true;

		},

		process: function(remote, headers) {

			remote.sendJSON({ error: 'Unsupported URL ("' + headers.url + '")' });


			return true;

		}

	};


	return Module;

});

