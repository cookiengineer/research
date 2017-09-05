
lychee.define('app.parser.HTML').tags({
	platform: 'html-nwjs'
}).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('cheerio');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _cheerio = global.require('cheerio');


	/*
	 * HELPERS
	 */

	const _encode = function(tokens) {

		let source = '';


		return source;

	};

	const _decode = function(source) {

		let tokens = [];
		let token  = null;
		let i0     = source.indexOf('<');

		while (i0 !== -1) {

			let i1 = source.indexOf('>', i0);
			if (i1 !== -1) {

				let tmp = source.substr(i0, i1 - i0);
				if (tmp.startsWith('/')) {
					// TODO: Close token if token.children[...length -1] is same type!
				} else {

					token = {
						type: 'TODO',
						content: '' || [], // this can be string or children
						id:    'whatever',
						class: 'whatever'
					};

					let attributes = tmp.split(' '); // or so?
					// TODO: Parse attributes
					// TODO: Parse <tmp>CONTENT</tmp>

				}

			} else {
				break;
			}

			i0 = source.indexOf('<', i1);

		}


		return tokens;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'app.parser.HTML',
				'blob':      null
			};

		},



		/*
		 * CUSTOM API
		 */

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				let stream = _encode(data);
				if (stream !== null) {
					return stream;
				}

			}


			return null;

		},

		decode: function(data) {

			data = data instanceof Buffer ? data.toString('utf8') : (data).toString();


			if (data.length > 0) {

				let object = _decode(data);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});

