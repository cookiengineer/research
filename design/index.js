
(function(global) {

	const _Emitter  = lychee.import('lychee.event.Emitter');
	const _STYLES   = {};
	const _document = global.document;
	const _main     = _document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _proxy_callback = function(event, data) {
		this.trigger(event, [ this.element.value || this.element.innerHTML ]);
	};

	const _Wrapper = function(element) {

		this.element   = element;
		this.listeners = {};

		_Emitter.call(this);

	};

	_Wrapper.prototype = Object.assign({}, _Emitter.prototype, {

		add: function(wrapper) {

			if (wrapper !== undefined && wrapper.element) {
				this.element.appendChild(wrapper.element);
			}

		},

		remove: function(wrapper) {

			if (wrapper !== undefined && wrapper.element) {

				if (this.element === wrapper.element.parentNode) {
					this.element.removeChild(wrapper.element);
				}

			}

		},

		bind: function(event, callback, scope, once) {

			let listener = this.listeners[event] || null;
			if (listener === null) {

				listener = _proxy_callback.bind(this, event);
				this.element.addEventListener(event, listener, true);
				this.listeners[event] = listener;

			}


			return _Emitter.prototype.bind.call(this, event, callback, scope, once);

		},

		unbind: function(event, callback, scope) {

			let listener = this.listeners[event] || null;
			if (listener !== null) {

				this.element.removeEventListener(event, listener);
				delete this.listeners[event];

			}


			return _Emitter.prototype.unbind.call(this, event, callback, scope);

		},

		value: function(value) {

			if (value !== undefined) {

				let element = this.element;
				if (element.value !== undefined) {
					element.value = value;
				} else {
					element.innerHTML = value;
				}

			} else {

				let element = this.element;
				if (element.value !== undefined) {
					return element.value;
				} else {
					return element.innerHTML;
				}

			}

		},

		state: function(state) {

			if (state !== undefined) {
				this.element.className = state;
			} else {
				return this.element.className;
			}

		},

		attr: function(attribute, value) {

			if (value !== undefined) {

				let element = this.element;
				if (element[attribute] !== undefined) {
					element[attribute] = value;
				} else {
					element.setAttribute(attribute, value);
				}

			} else {

				let element = this.element;
				if (element[attribute] !== undefined) {
					return element[attribute];
				} else {
					return element.getAttribute(attribute);
				}

			}

		},

		query: function(query) {

			let result = this.element.querySelector(query);
			if (result !== null) {
				return new _Wrapper(result);
			}

		}

	});



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

		render: function(type, html) {

			let element = document.createElement(type);

			element.innerHTML = html || '';

			return new _Wrapper(element);

		},

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

