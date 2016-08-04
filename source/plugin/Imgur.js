
lychee.define('app.plugin.Imgur').tags({
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
	 * HELPERS
	 */

	const _process_album = function(remote, headers) {

		let id  = headers.url.split('/').pop().split('?')[0];
		let url = 'http://imgur.com/ajaxalbums/getimages/' + id + '/hit.json';

		_fetch.fetchUrl(url, (err, head, body) => {

			let json = null;
			try {
				json = JSON.parse(body.toString());
			} catch(err) {
			}

			if (json !== null) {

				let images = json.data.images.map(entry => {

					return {
						url:         'http://i.imgur.com/' + entry.hash + entry.ext,
						title:       entry.title,
						description: entry.description
					};

				});


				if (!err) {
					remote.sendJSON({ images: images });
				} else {
					remote.sendJSON({ error: err });
				}

			}

		});

	};

    const _process_image = function(remote, headers) {

		let url = headers.url;

		_fetch.fetchUrl(url, (err, head, body) => {

			let type = head.responseHeaders['content-type']   || null;
			let size = head.responseHeaders['content-length'] || null;

			if (!err) {

				remote.sendImage(body, {
					'content-type':   type,
					'content-length': size
				});

			} else {

				remote.sendJSON({ error: err });

			}

		});

	};



	/*
	 * IMPLEMENTATION
	 */

	let Module = {

		can: function(headers) {

			if (/imgur\.com/g.test(headers.host) === true) {
				return true;
			}

			return false;

		},

		process: function(remote, headers) {

			if (/imgur\.com\/gallery/g.test(headers.url)) {

				_process_album(remote, headers);

				return true;

			} else if (/i\.imgur\.com/g.test(headers.url)) {

				_process_image(remote, headers);

				return true;

			}


			return false;

		}

	};


	return Module;

});

