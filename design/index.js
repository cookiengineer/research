
(function(global) {

	const _STYLES   = {};
	const _document = global.document;
	const _main     = _document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _Wrapper = function(element) {

		this.element = element;

	};

	_Wrapper.prototype = {

		state: function(state) {
			this.element.className = state;
		},

		set: function(attribute, value) {

			let element = this.element;
			if (element[attribute] !== undefined) {
				element[attribute] = value;
			} else {
				element.setAttribute(attribute, value);
			}

		},

		query: function(query) {

			let result = this.element.querySelector(query);
			if (result !== null) {
				return new _Wrapper(result);
			}

		}

	};



	/*
	 * FUCKED STUFF
	 */

	const _render_stylesheet = function(identifier, buffer) {

		return buffer.split('\n').map(function(line) {

			let tmp = line.trim();
			if (tmp.substr(0, 6) === ':host(') {

				let i1 = tmp.indexOf(')', 6);
				let i2 = tmp.indexOf(' ', 6);
				if (i1 !== -1 && i1 < i2) {
					return identifier + tmp.substr(6, i1 - 6) + tmp.substr(i1 + 1);
				}

			} else if (tmp.substr(0, 5) === ':host') {
				return identifier + tmp.substr(5);
			} else if (tmp.indexOf(':host') !== -1) {
				return tmp.split(':host').join(identifier);
			}

			return tmp;

		}).map(function(line) {

			let tmp = line.trim();
			if (tmp.substr(0, 9) === '::content') {
				return identifier + tmp.substr(9);
			} else if (tmp.indexOf(' ::content') !== -1) {
				return tmp.split(' ::content').join('');
			}

			return tmp;

		}).join('\n');

	};



	let _id = 0;

	const $ = {

		state: function(identifier, html, css) {

			let element = document.createElement('section');

			element.id        = identifier;
			element.className = 'inactive';

			_main.appendChild(element);


			if (html instanceof Stuff) {
				element.innerHTML = html.buffer || '';
			}

			if (css instanceof Stuff) {

				let style = _STYLES[css.url] || null;
				if (style === null) {

					style = _STYLES[css.url] = document.createElement('style');
					style.innerHTML = _render_stylesheet('section#' + identifier, css.buffer || '');
					style.setAttribute('data-url', css.url);

					document.head.appendChild(style);

				}

			}


			return new _Wrapper(element);

		}

	};


	global.$ = $;

})(typeof window !== 'undefined' ? window : global);

