
lychee.define('app.plugin.Reddit').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			require('fetch');
			require('fast-html-parser');

			return true;

		} catch(err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _fetch = require('fetch');
	const _html  = require('fast-html-parser');



	/*
	 * HELPERS
	 */



	/*
	 * IMPLEMENTATION
	 */

	let Module = {

		can: function(headers) {

			if (/reddit\.com/g.test(headers.host) === true) {
				return true;
			}

			return false;

		},

		process: function(remote, headers) {

			console.log('Reddit plugin', headers);


			remote.sendJSON({
				fuck: 'firefox you shithead'
			});

			if (/imgur\.com\/gallery\//g.test(headers.url)) {

				_process_album(remote, headers);

				return true;

			} else if (/imgur\.com\/a\//g.test(headers.url)) {

				_process_album(remote, headers);

				return true;

			} else if (/i\.imgur\.com\//g.test(headers.url)) {

				_process_image(remote, headers);

				return true;

			}


			return false;

		}

	};


	return Module;

});

