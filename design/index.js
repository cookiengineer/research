
(function(global) {

	const _Emitter  = lychee.import('lychee.event.Emitter');
	const _STATES   = {};
	const _STYLES   = {};
	const _document = global.document;
	const _main     = _document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _get_value = function(element) {

		let name  = element.tagName.toLowerCase();
		let value = null;

		if (/input/g.test(name)) {

			let type = element.type;
			if (type === 'checkbox') {

				value = element.checked === true;

			} else if (type === 'number') {

				let tmp_val = parseInt(element.value, 10);
				let tmp_min = parseInt(element.getAttribute('min'), 10);
				let tmp_max = parseInt(element.getAttribute('max'), 10);

				if (!isNaN(tmp_val)) {

					if (!isNaN(tmp_max) && tmp_val > tmp_max) {
						tmp_val = tmp_max;
					}

					if (!isNaN(tmp_min) && tmp_val < tmp_min) {
						tmp_val = tmp_min;
					}

					value = tmp_val;

				}

			} else if (/^(file|text|password)$/g.test(type)) {

				value = element.value;

			}

		} else {

			value = element.innerHTML;

		}

		return value;

	};

	const _set_value = function(element, value) {

		let name = element.tagName.toLowerCase();

		if (/input/g.test(name)) {

			let type = element.type;
			if (type === 'checkbox') {

				element.checked = value === true;

			} else if (type === 'number') {

				value = typeof value === 'number' ? value : parseInt(value, 10);


				let tmp_min = parseInt(element.getAttribute('min'), 10);
				let tmp_max = parseInt(element.getAttribute('max'), 10);

				if (!isNaN(value)) {

					let result = true;

					if (!isNaN(tmp_max) && value > tmp_max) {
						result = false;
						value  = tmp_max;
					}

					if (!isNaN(tmp_min) && value < tmp_min) {
						result = false;
						value  = tmp_min;
					}

					element.value = value;

					return result;

				} else {

					return false;

				}


			} else if (/^(file|text|password)$/g.test(type)) {

				element.value = value;

			}

		} else {

			element.innerHTML = value;

		}


		return true;

	};

	const _proxy_callback = function(event, data) {
		return this.trigger(event, [ _get_value(this.element) ]);
	};

	const _Wrapper = function(element) {

		this.element   = element;
		this.listeners = {};

		_Emitter.call(this);

	};

	_Wrapper.prototype = Object.assign({}, _Emitter.prototype, {

		enter: function() {
			this.element.className = 'active';
		},

		leave: function() {
			this.element.className = 'inactive';
		},

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

			if (event === 'click') {

				this.element.onclick = function() {
					return false;
				};

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
				return _set_value(this.element, value);
			} else {
				return _get_value(this.element);
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

		queries: function(query) {

			let filtered = [];

			let result = Array.from(this.element.querySelectorAll(query));
			if (result.length > 0) {

				result.forEach(element => {
					filtered.push(new _Wrapper(element));
				});

			}

			return filtered;

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

			let state = _STATES[identifier] || null;
			if (state === null) {

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

				state = _STATES[identifier] = new _Wrapper(element);

			}


			return state;

		}

	};


	global.$ = $;

})(typeof window !== 'undefined' ? window : global);

