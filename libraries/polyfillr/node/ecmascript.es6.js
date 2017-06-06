if (typeof Array.prototype.toSource !== 'function') {

	Array.prototype.toSource = function() {

		let list   = Object(this);
		let length = list.length >>> 0;
		let value  = '';
		let entry;


		for (let i = 0; i < length; i++) {

			if (i in list) {

				entry = list[i];

				if (entry === undefined) {
					value += 'undefined';
				} else if (entry === null) {
					value += 'null';
				} else if (typeof entry === 'number') {
					value += (entry).valueOf();
				} else if (typeof entry === 'string') {
					value += '"' + entry + '"';
				} else if (entry instanceof RegExp) {
					value += (entry).toString();
				} else if (typeof (entry).toSource === 'function') {
					value += (entry).toSource();
				} else {
					value += (entry).toString();
				}

			}

			if (i !== length - 1) {
				value += ', ';
			}

		}


		return '[' + value + ']';

	};

}
if (typeof Array.prototype.unique !== 'function') {

	Array.prototype.unique = function() {

		if (this === null || this === undefined) {
			throw new TypeError('Array.prototype.unique called on null or undefined');
		}


		let clone  = [];
		let list   = Object(this);
		let length = this.length >>> 0;
		let value;

		for (let i = 0; i < length; i++) {

			value = list[i];

			if (clone.indexOf(value) === -1) {
				clone.push(value);
			}
		}

		return clone;

	};

}
if (typeof Array.toSource !== 'function') {

	Array.toSource = function() {
		return 'function Array() {\n\t[native code]\n}';
	};

}
if (typeof Boolean.prototype.toJSON !== 'function') {

	Boolean.prototype.toJSON = function() {
		return this.valueOf();
	};

}
if (typeof Boolean.prototype.toSource !== 'function') {

	Boolean.prototype.toSource = function() {
		return '(new Boolean(' + (this).valueOf() + '))';
	};

}
if (typeof Boolean.toSource !== 'function') {

	Boolean.toSource = function() {
		return 'function Boolean() {\n\t[native code]\n}';
	};

}
if (typeof Date.prototype.toJSON !== 'function') {

	let _format_date = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	Date.prototype.toJSON = function() {

		if (isFinite(this.valueOf()) === true) {

			return this.getUTCFullYear()             + '-' +
				_format_date(this.getUTCMonth() + 1) + '-' +
				_format_date(this.getUTCDate())      + 'T' +
				_format_date(this.getUTCHours())     + ':' +
				_format_date(this.getUTCMinutes())   + ':' +
				_format_date(this.getUTCSeconds())   + 'Z';

		}


		return null;

	};

}
if (typeof JSON.query !== 'function') {

	JSON.query = function(object, query) {

		query = typeof query === 'string' ? query : '';


		let pointer = null;

		if (object instanceof Object) {

			let references = query.split('>');
			let check      = references[0] || '';

			if (check !== '' && references.length > 0) {

				pointer = object;

				for (let r = 0, rl = references.length; r < rl; r++) {

					let ref = references[r].trim();
					if (ref !== '') {

						if (pointer[ref] !== undefined) {

							pointer = pointer[ref];

						} else {

							let num = parseInt(ref, 10);
							if (!isNaN(num) && pointer[num] !== undefined) {

								pointer = pointer[num];

							} else {

								pointer = null;
								break;

							}

						}

					} else {

						pointer = null;
						break;

					}

				}


			} else {

				pointer = object;

			}

		}

		return pointer;

	};

}
if (typeof Number.prototype.toJSON !== 'function') {

	Number.prototype.toJSON = function() {
		return this.valueOf();
	};

}
if (typeof Number.prototype.toSource !== 'function') {

	Number.prototype.toSource = function() {
		return '(new Number(' + (this).valueOf() + '))';
	};

}
if (typeof Number.toSource !== 'function') {

	Number.toSource = function() {
		return 'function Number() {\n\t[native code]\n}';
	};

}
if (typeof Object.filter !== 'function') {

	Object.filter = function(object, predicate/*, thisArg */) {

		if (object !== Object(object)) {
			throw new TypeError('Object.filter called on a non-object');
		}

		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}


		let props   = [];
		let values  = [];
		let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

		for (let prop in object) {

			let value = object[prop];

			if (Object.prototype.hasOwnProperty.call(object, prop)) {

				if (predicate.call(thisArg, value, prop, object)) {
					props.push(prop);
					values.push(value);
				}

			}

		}


		let filtered = {};

		for (let i = 0; i < props.length; i++) {
			filtered[props[i]] = values[i];
		}

		return filtered;

	};

}
if (typeof Object.find !== 'function') {

	Object.find = function(object, predicate/*, thisArg */) {

		if (object !== Object(object)) {
			throw new TypeError('Object.find called on a non-object');
		}

		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}


		let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

		for (let prop in object) {

			let value = object[prop];

			if (Object.prototype.hasOwnProperty.call(object, prop)) {

				if (predicate.call(thisArg, value, prop, object)) {
					return value;
				}

			}

		}

		return undefined;

	};

}
if (typeof Object.map !== 'function') {

	Object.map = function(object, predicate/*, thisArg */) {

		if (object !== Object(object)) {
			throw new TypeError('Object.map called on a non-object');
		}

		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}


		let clone   = {};
		let keys    = Object.keys(object).sort();
		let length  = keys.length >>> 0;
		let thisArg = arguments.length >= 3 ? arguments[2] : void 0;
		let key;
		let value;
		let tmp;


		for (let k = 0; k < length; k++) {

			key   = keys[k];
			value = object[key];
			tmp   = predicate.call(thisArg, value, key, object);

			if (tmp !== undefined) {
				clone[key] = tmp;
			}

		}


		return clone;

	};

}
if (typeof Object.prototype.toSource !== 'function' && typeof Object.defineProperty === 'function') {

	let _array_to_source  = Array.prototype.toSource || null;
	let _string_to_source = String.prototype.toSource || null;


	Object.defineProperty(Object.prototype, 'toSource', {

		enumerable: false,
		value:      function() {

			let prototype   = Object.getPrototypeOf(this);
			let konstruktor = this.constructor;


			if (this === Array || this === String || this === RegExp) {

				let name = this.toString().split(' ')[1];

				return 'function ' + name + ' {\n\t[native code]\n}';

			} else if (this === Object && prototype === Object.__proto__) {

				return 'function Object() {\n\t[native code]\n}';

			} else if (konstruktor === Array) {

				if (_array_to_source !== null) {
					return _array_to_source.call(this);
				} else {
					return "" + this;
				}

			} else if (konstruktor === Boolean) {

				return '(new Boolean(' + (this).valueOf() + '))';

			} else if (konstruktor === Number) {

				return '(new Number(' + (this).valueOf() + '))';

			} else if (konstruktor === String) {

				if (_string_to_source !== null) {
					return _string_to_source.call(this);
				} else {
					return "" + this;
				}

			} else if (konstruktor === RegExp) {

				return "" + this;

			} else if (konstruktor === Object && prototype !== null && Object.getPrototypeOf(prototype) === null) {

				let list  = Object(this);
				let last  = Object.keys(list).pop();
				let value = '';
				let entry;


				for (let i in list) {

					if (Object.prototype.hasOwnProperty.call(list, i)) {

						entry = list[i];

						value += i + ':';

						if (entry === undefined) {

							value += 'undefined';

						} else if (entry === null) {

							value += 'null';

						} else if (typeof entry === 'number') {

							value += (entry).valueOf();

						} else if (typeof entry === 'string') {

							value += '"' + entry + '"';

						} else if (typeof entry === 'function') {

							if (typeof entry.toSource === 'function') {
								value += entry.toSource();
							} else {
								value += entry.toString();
							}

						} else if (entry instanceof Array || entry instanceof RegExp || entry instanceof String) {

							if (typeof entry.toSource === 'function') {
								value += entry.toSource();
							} else {
								value += entry.toString();
							}

						} else if (entry instanceof Object) {

							// XXX: Surrounding expression brackets
							let tmp = entry.toSource();
							value += tmp.substr(1, tmp.length - 2);

						} else {

							value += (entry).toString();

						}


						if (i !== last) {
							value += ', ';
						}

					}

				}


				return '({' + value + '})';

			}

		}

	});

}
if (typeof Object.sort !== 'function') {

	Object.sort = function(object) {

		if (object !== Object(object)) {
			throw new TypeError('Object.sort called on a non-object');
		}


		let clone  = {};
		let keys   = Object.keys(object).sort();
		let length = keys.length >>> 0;
		let key;
		let value;

		for (let k = 0; k < length; k++) {

			key   = keys[k];
			value = object[key];

			if (value instanceof Array) {

				clone[key] = value.map(function(element) {

					if (element instanceof Array) {
						return element;
					} else if (element instanceof Object) {
						return Object.sort(element);
					} else {
						return element;
					}

				});

			} else if (value instanceof Object) {

				clone[key] = Object.sort(value);

			} else {

				clone[key] = value;

			}

		}

		return clone;

	};

}
if (typeof Object.toSource !== 'function') {

	Object.toSource = function() {
		return 'function Object() {\n\t[native code]\n}';
	};

}
if (typeof Object.values !== 'function') {

	Object.values = function(object) {

		if (object !== Object(object)) {
			throw new TypeError('Object.values called on a non-object');
		}


		let values = [];

		for (let prop in object) {

			if (Object.prototype.hasOwnProperty.call(object, prop)) {
				values.push(object[prop]);
			}

		}

		return values;

	};

}
if (typeof RegExp.prototype.toSource !== 'function') {

	RegExp.prototype.toSource = function() {

		if (this.constructor === RegExp) {
			return this.toString();
		} else {
			return "function RegExp() {\n\t[native code]\n}";
		}

	};

}
if (typeof RegExp.toSource !== 'function') {

	RegExp.toSource = function() {
		return 'function RegExp() {\n\t[native code]\n}';
	};

}
if (typeof String.prototype.toJSON !== 'function') {

	String.prototype.toJSON = function() {
		return this.valueOf();
	};

}
if (typeof String.prototype.toSource !== 'function') {

	String.prototype.toSource = function() {

		let value = (this).toString();

		value = value.replace('\n', '\\n');
		value = value.replace('\t', '\\t');

		return '(new String("' + value + '"))';

	};

}
if (typeof String.toSource !== 'function') {

	String.toSource = function() {
		return 'function String() {\n\t[native code]\n}';
	};

}