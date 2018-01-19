
(function(global) {

	const _Emitter  = lychee.import('lychee.event.Emitter');
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

				result.forEach(function(element) {
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

		},

		toString: function() {

			return this.element.innerHTML;

		}

	});



	const $ = {

		render: function(type, html) {

			let element = document.createElement(type);

			element.innerHTML = html || '';

			return new _Wrapper(element);

		}

	};


	global.$ = $;

})(typeof window !== 'undefined' ? window : global);

