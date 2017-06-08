if (typeof Polyfillr === 'undefined') {
	Polyfillr = {};
}

Component = Polyfillr.Component = (function(global) {

	const _document = global.document;



	/*
	 * HELPERS
	 */

	const _fire_event_listener = (function(supports_custom_event) {

		if (supports_custom_event === true) {

			return function(name, data) {

				let element = this;
				let event   = new CustomEvent(name, {
					detail:  data,
					bubbles: false
				});

				if (typeof element.dispatchEvent === 'function') {
					element.dispatchEvent(event);
				}

			};

		} else {

			return function(name, data) {

				let element = this;
				let event   = _document.createEvent('Event');

				event.initEvent(name, false, false);
				event.detail = data;

				if (typeof element.dispatchEvent === 'function') {
					element.dispatchEvent(event);
				}

			};

		}

	})(typeof CustomEvent !== 'undefined');



	/*
	 * IMPLEMENTATION
	 */

	let Component = function(identifier, template) {

		// This API is called via HTML Imports
		Polyfillr.HTML_IMPORT = true;


		this.elements   = [];
		this.events     = {};
		this.identifier = identifier;
		this.observer   = null;
		this.template   = template;



		/*
		 * INITIALIZATION
		 */

		this.addEventListener('create', function(e) {

			let that   = e.target;
			let code   = (that.innerHTML || '').trim();
			let prefix = (template.innerHTML || '').trim();


			// TODO: Iterate over template.querySelectorAll('*')
			// TODO: Iterate over that.querySelectorAll('*')
			//
			// if tagName is the same, replace template's element
			// with the element's one

			if (code !== '') {

				that.innerHTML = prefix + code;

			} else {

				that.innerHTML = prefix;

			}

		}, true);


		if (typeof MutationObserver !== 'undefined') {

			this.observer = new MutationObserver(function(mutations) {

				let changes = [].slice.call(mutations).map(function(mutation) {

					return {
						element: mutation.target,
						name:    'change',
						data:    {
							attribute: mutation.attributeName,
							oldvalue:  mutation.oldValue,
							newvalue:  mutation.target.getAttribute(mutation.attributeName)
						}
					};

				});

				if (changes.length > 0) {

					changes.forEach(function(change) {

						let element = change.element;
						if (typeof element.fireEventListener === 'function') {
							element.fireEventListener(change.name, change.data);
						}

					});

				}

			});

		}

	};


	Component.prototype = {

		create: function(element) {

			if (element === null || element === undefined) {
				element = _document.createElement(this.identifier);
			} else {
				element.tagName = this.identifier;
			}


			let elements = this.elements;
			let events   = this.events;
			let observer = this.observer;


			if (elements.indexOf(element) === -1) {

				for (let eid in events) {

					if (events.hasOwnProperty(eid)) {

						events[eid].forEach(function(map) {

							element.addEventListener(
								map.name,
								map.callback.bind(element),
								map.bubble
							);

							element.fireEventListener = _fire_event_listener.bind(element);

						});

					}

				}


				element.fireEventListener('create', null);
				elements.push(element);


				if (observer !== null) {

					observer.observe(element, {
						attributes:        true,
						attributeOldValue: true
					});

				}

			}


			return element;

		},

		destroy: function(element) {

			let elements = this.elements;
			let observer = this.observer;

			let e = elements.indexOf(element);
			if (e !== -1) {

				if (observer !== null) {
					// XXX: WTF is this shit? disconnect()
					// stops the MutationObserver. FUCK YOU, WHATWG.
					// observer.disconnect(element);
				}


				if (typeof element.fireEventListener === 'function') {
					element.fireEventListener('destroy', null);
					delete element.fireEventListener;
				}

				elements.splice(e, 1);


				return true;

			}


			return false;

		},

		addEventListener: function(name, callback, bubble) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;
			bubble   = bubble === true;


			if (name !== null && callback !== null) {

				let events = this.events;
				if (events[name] === undefined) {
					events[name] = [];
				}

				events[name].push({
					name:     name,
					callback: callback,
					bubble:   bubble
				});


				return true;

			}


			return false;

		},

		removeEventListener: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				let events = this.events[name] || null;
				if (events !== null) {

					for (let e = 0; e < events.length; e++) {

						if (events[e].callback === callback) {
							events.splice(e, 1);
							e--;
						}

					}

				}


				return true;

			} else if (name !== null) {

				let events = this.events[name] || null;
				if (events !== null) {
					delete this.events[name];
				}


				return true;

			}


			return false;

		}

	};


	return Component;

})(typeof window !== 'undefined' ? window : this);
if (typeof Polyfillr === 'undefined') {
	Polyfillr = {};
}

(function(global) {

	const _document    = global.document;
	const _COMPONENTS  = {};
	const _STYLESHEETS = {};



	/*
	 * HELPERS
	 */

	const _initialize = function() {

		let identifier = this.identifier;
		let template   = this.template;
		let code       = ((template || {}).innerHTML || '');


		let check = _STYLESHEETS[identifier] || null;
		if (check !== null) {
			return false;
		}


		if (code.length > 0) {

			let c1 = code.indexOf('<content>');
			let c2 = code.indexOf('</content>', c1);
			if (c1 !== -1 && c2 !== -1) {
				template.innerHTML = code.substr(c1 + 9, c2 - c1 - 9).trim();
			} else {
				template.innerHTML = '';
			}


			let s1 = code.indexOf('<style>');
			let s2 = code.indexOf('</style>', s1);
			if (s1 !== -1 && s2 !== -1) {

				let sheet = (code.substr(s1 + 7, s2 - s1 - 7)).trim();
				if (sheet.length > 0) {

					sheet = sheet.split('\n').map(function(line) {

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


					let wrapper = _document.createElement('style');
					if (wrapper !== null) {
						wrapper.innerHTML = sheet;
						_document.head.appendChild(wrapper);
						_STYLESHEETS[identifier] = wrapper;
					}

				}

			}

		}


		let elements = [].slice.call(_document.querySelectorAll(identifier));
		if (elements.length > 0) {

			elements.forEach(function(element) {
				this.create(element);
			}.bind(this));

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	Polyfillr.create = function(identifier) {

		let component = _COMPONENTS[identifier] || null;
		if (component !== null) {
			return component.create();
		}


		return null;

	};

	Polyfillr.define = function(identifier, template) {

		let component = _COMPONENTS[identifier] || null;
		if (component !== null) {

			return null;

		} else {

			component = new Polyfillr.Component(identifier, template);

			_COMPONENTS[identifier] = component;
			setTimeout(_initialize.bind(component), 0);


			return component;

		}

	};

	Polyfillr.destroy = function(element) {

		let identifier = element.tagName.toLowerCase();
		let component  = _COMPONENTS[identifier] || null;
		if (component !== null) {
			return component.destroy(element);
		}


		return true;

	};

	Polyfillr.get = function(identifier) {

		let component = _COMPONENTS[identifier] || null;
		if (component !== null) {
			return component;
		}


		return null;

	};

	Polyfillr.render = function(element, data) {

		data = data instanceof Object ? data : null;


		if (typeof element.fireEventListener === 'function') {

			element.fireEventListener('render', data);

			return true;

		}


		return false;

	};

})(typeof window !== 'undefined' ? window : this);
if (typeof Polyfillr === 'undefined') {
	Polyfillr = {};
}

(function(global) {

	const _document    = global.document;
	const _location    = global.location || null;
	let   _ES6_SUPPORT = false;



	/*
	 * FEATURE DETECTION
	 */

	(function(implementation) {

		if (implementation === null) {
			implementation = _document.implementation = {};
		}

		if (typeof implementation.createHTMLDocument !== 'function') {

			implementation.createHTMLDocument = function() {

				if (typeof ActiveXObject !== 'undefined') {
					return new ActiveXObject('htmlfile');
				}

				return _document;

			};

		}

	})(_document.implementation || null);

	(function() {

		try {

			eval('let foo = \'foo\'');
			eval('let bar = _ => false');

			_ES6_SUPPORT = true;

		} catch (err) {
			_ES6_SUPPORT = false;
		}

	})();



	/*
	 * HELPERS
	 */

	const _import_html = function(url, html) {

		let data = {};
		let doc  = _document.implementation.createHTMLDocument(url);
		let meta = doc.createElement('meta');

		meta.setAttribute('charset', 'utf-8');
		doc.baseURI = url;
		doc.head.appendChild(meta);

		if (typeof doc.open === 'function') {
			doc.open();
		}

		if (doc.body !== null) {
			doc.body.innerHTML = html;
		} else {
			doc.write('<body>' + html + '</body>');
		}


		let scripts = [].slice.call(doc.querySelectorAll('script'));
		if (scripts.length > 0) {

			scripts.filter(function(script) {

				let type = script.getAttribute('type');
				if (type === null || type === 'text/javascript') {
					return true;
				}

				return false;

			}).forEach(function(script) {

				let code  = script.innerHTML;
				let scope = {
					Polyfillr: Object.assign({}, Polyfillr),
					document:  {
						querySelector: function(selectors) {
							return _document.querySelector(selectors);
						},
						querySelectorAll: function(selectors) {
							return _document.querySelectorAll(selectors);
						},
						currentScript: {
							ownerDocument: doc
						}
					}
				};

				scope.Polyfillr.define = function(identifier, template) {
					let value = Polyfillr.define(identifier, template);
					data[identifier] = value;
					return value;
				};


				if (_ES6_SUPPORT === false) {
					code = code.split('let ').join('var ');
					code = code.split('const ').join('var ');
				}


				try {

					with (scope) {
						eval(code);
					}

				} catch (err) {
					console.error(err);
				}

			});

		}


		return data;

	};

	const _polyfill_base_uri = function() {

		if (typeof _document.baseURI === 'undefined') {

			Object.defineProperty(_document, 'baseURI', {
				get: function() {

					let base = this.querySelector('base');
					if (base !== null) {
						return base.href;
					} else if (location !== null) {
						return location.href;
					}


					return null;

				},
				set: function(value) {

					let base = this.querySelector('base');
					if (base === null) {

						base = this.createElement('base');
						this.head.appendChild(base);

						if (location !== null) {
							base.setAttribute('href', location.href);
						}

					}


					base.setAttribute('href', value);

				},
				configurable: true
			});

			Polyfillr.BASE_URI = false;

		} else {

			Polyfillr.BASE_URI = true;

		}

	};

	const _polyfill_html_import = function() {

		let links = [].slice.call(_document.head.querySelectorAll('link[rel="import"]'));
		if (links.length > 0) {

			links.forEach(function(link) {

				let url = link.getAttribute('href');
				if (url !== null) {

					let request = new XMLHttpRequest();

					request.responseType = 'text';
					request.open('GET', url);

					request.onload = function() {

						if (request.status === 200 || request.status === 304) {

							let response = request.response || request.responseText;
							if (response.length > 0) {
								Polyfillr.import(url, response);
							}

						}

					};

					request.onerror = function() {
						// XXX: Do nothing
					};

					request.ontimeout = function() {
						// XXX: Do nothing
					};

					request.send(null);

				}

			});

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	Polyfillr.HTML_IMPORT = false;
	Polyfillr.BASE_URI    = false;

	Polyfillr.import = function(url, html) {

		url  = typeof url === 'string'  ? url  : null;
		html = typeof html === 'string' ? html : null;


		if (url !== null && html !== null) {
			return _import_html(url, html);
		}


		return null;

	};



	/*
	 * DOM EVENTS
	 */

	_document.addEventListener('DOMContentLoaded', function(event) {

		setTimeout(function() {

			if (Polyfillr.BASE_URI === false) {
				_polyfill_base_uri();
			}

			if (Polyfillr.HTML_IMPORT === false) {
				_polyfill_html_import();
			}

		}, 300);

	}, true);

})(typeof window !== 'undefined' ? window : this);
