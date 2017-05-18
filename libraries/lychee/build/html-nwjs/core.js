
lychee = typeof lychee !== 'undefined' ? lychee : (function(global) {

	const _INTERFACEOF_CACHE = {};



	/*
	 * NAMESPACE
	 */

	if (typeof lychee === 'undefined') {
		lychee = global.lychee = {};
	}



	/*
	 * POLYFILLS
	 */

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

	if (typeof Boolean.prototype.toJSON !== 'function') {

		Boolean.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Date.prototype.toJSON !== 'function') {

		let _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				let str = '';

				str += this.getUTCFullYear()                + '-';
				str += _format_date(this.getUTCMonth() + 1) + '-';
				str += _format_date(this.getUTCDate())      + 'T';
				str += _format_date(this.getUTCHours())     + ':';
				str += _format_date(this.getUTCMinutes())   + ':';
				str += _format_date(this.getUTCSeconds())   + 'Z';

				return str;

			}


			return null;

		};

	}

	if (typeof Number.prototype.toJSON !== 'function') {

		Number.prototype.toJSON = function() {
			return this.valueOf();
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
				tmp   = predicate.call(thisArg, value, key);

				if (tmp !== undefined) {
					clone[key] = tmp;
				}

			}


			return clone;

		};

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

	if (typeof String.prototype.replaceObject !== 'function') {

		String.prototype.replaceObject = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('String.prototype.replaceObject called on a non-object');
			}


			let clone  = '' + this;
			let keys   = Object.keys(object);
			let values = Object.values(object);


			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key   = keys[k];
				let value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value);
				} else if (value instanceof Object) {
					value = JSON.stringify(value);
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				let pointers = [];
				let pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				let offset = 0;

				for (let p = 0, pl = pointers.length; p < pl; p++) {

					let index = pointers[p];

					clone   = clone.substr(0, index + offset) + value + clone.substr(index + offset + key.length + 3);
					offset += (value.length - (key.length + 3));

				}

			}


			return clone;

		};

	}

	if (typeof String.prototype.toJSON !== 'function') {

		String.prototype.toJSON = function() {
			return this.valueOf();
		};

	}



	/*
	 * HELPERS
	 */

	let _environment = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		debug:        true,
		environment:  _environment,

		ENVIRONMENTS: {},
		ROOT:         {
			lychee:  '/opt/lycheejs',
			project: null
		},
		VERSION:      "2017-Q1",



		/*
		 * LIBRARY API
		 */

		diff: function(aobject, bobject) {

			let akeys = Object.keys(aobject);
			let bkeys = Object.keys(bobject);

			if (akeys.length !== bkeys.length) {
				return true;
			}


			for (let a = 0, al = akeys.length; a < al; a++) {

				let key = akeys[a];

				if (bobject[key] !== undefined) {

					if (aobject[key] !== null && bobject[key] !== null) {

						if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

							if (lychee.diff(aobject[key], bobject[key]) === true) {

								// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
								if (Object.keys(aobject[key]).length > 0) {
									return true;
								}

							}

						} else if (typeof aobject[key] !== typeof bobject[key]) {
							return true;
						}

					}

				} else {
					return true;
				}

			}


			return false;

		},

		enumof: function(template, value) {

			if (template instanceof Object && typeof value === 'number') {

				let valid = false;

				for (let val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}


				return valid;

			}


			return false;

		},

		assignsafe: function(target) {

			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								lychee.assignsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								lychee.assignsafe(target[prop], object[prop]);

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		assignunlink: function(target) {

			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {
								target[prop] = [];
								lychee.assignunlink(target[prop], object[prop]);
							} else if (tvalue instanceof Object && ovalue instanceof Object) {
								target[prop] = {};
								lychee.assignunlink(target[prop], object[prop]);
							} else {
								target[prop] = object[prop];
							}

						}

					}

				}

			}


			return target;

		},

		interfaceof: function(template, instance) {

			if (instance === null || instance === undefined) {
				return false;
			}


			let tname    = template.displayName;
			let iname    = instance.displayName;
			let hashable = typeof tname === 'string' && typeof iname === 'string';
			let hashmap  = _INTERFACEOF_CACHE;
			let valid    = false;


			// 0. Quick validation for identical constructors
			if (hashable === true) {

				if (hashmap[tname] !== undefined && hashmap[tname][iname] !== undefined) {

					return hashmap[tname][iname];

				} else if (tname === iname) {

					if (hashmap[tname] === undefined) {
						hashmap[tname] = {};
					}

					hashmap[tname][iname] = true;

					return true;

				}

			}


			// 1. Interface validation on Template
			if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

				valid = true;

				for (let method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
						valid = false;
						break;
					}

				}


			// 2. Interface validation on Instance
			} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

				valid = true;

				for (let method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance[method]) {
						valid = false;
						break;
					}

				}


			// 3. Interface validation on Struct
			} else if (template instanceof Object && instance instanceof Object) {

				valid = true;

				for (let property in template) {

					if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

						if (typeof template[property] !== typeof instance[property]) {
							valid = false;
							break;
						}

					}

				}

			}


			if (hashable === true) {

				if (hashmap[tname] === undefined) {
					hashmap[tname] = {};
				}

				hashmap[tname][iname] = valid;

			}


			return valid;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			try {
				data = JSON.parse(JSON.stringify(data));
			} catch (err) {
				data = null;
			}


			if (data !== null) {

				let instance = null;
				let scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					let resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					let resolved_class = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_class === 'function') {

						let bindargs = [].splice.call(data.arguments, 0).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								let resolved = _resolve_reference.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_class);
						bindargs.reverse();


						instance = new (
							resolved_class.bind.apply(
								resolved_class,
								bindargs
							)
						)();

					}

				} else if (data instanceof Object) {

					instance = data;

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						let blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					console.info('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			let data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else if (typeof definition.displayName !== 'undefined') {

						if (definition.prototype instanceof Object) {
							console.info('lychee.deserialize: Define ' + (definition.displayName) + '.prototype.serialize() to serialize it.');
						} else {
							console.info('lychee.deserialize: Define ' + (definition.displayName) + '.serialize() to serialize it.');
						}

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch (err) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		assimilate: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				_bootstrap_environment.call(this);


				let that = this;


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let asset = new lychee.Asset(target, null, false);
				if (asset !== null) {
					asset.load();
				}


				return asset;

			} else {

				console.warn('lychee.assimilate: Invalid target');
				console.info('lychee.assimilate: Use lychee.assimilate(target) where target is a path to an Asset');

			}


			return null;

		},

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				let definition = new lychee.Definition(identifier);
				let that       = this;


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				definition.exports = function(callback) {

					lychee.Definition.prototype.exports.call(this, callback);
					that.environment.define(this);

				};


				return definition;

			} else {

				console.warn('lychee.define: Invalid identifier');
				console.info('lychee.define: Use lychee.define(id).exports(closure)');

			}


			return null;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				let instance = null;
				let that     = this;

				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let resolved_module = _resolve_reference.call(that.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {
					console.info('lychee.deserialize: Require ' + (reference) + ' to import it.');
				}


				return instance;

			}


			return null;

		},

		envinit: function(environment, profile) {

			let message = environment !== null;

			environment = environment instanceof lychee.Environment ? environment : null;
			profile     = profile instanceof Object                 ? profile     : {};


			_bootstrap_environment.call(this);


			if (environment !== null) {

				let code        = '\n';
				let id          = (lychee.ROOT.project || '').substr((lychee.ROOT.lychee || '').length) + '/custom';
				let env_profile = Object.assign({}, environment.profile, profile);


				if (environment.id.substr(0, 19) === 'lychee-Environment-') {
					environment.setId(id);
				}


				if (_environment !== null) {

					Object.values(_environment.definitions).forEach(function(definition) {
						environment.define(definition);
					});

				}


				code += '\n\n';
				code += 'if (sandbox === null) {\n';
				code += '\tconsole.error("lychee: envinit() failed.");\n';
				code += '\treturn;\n';
				code += '}\n';
				code += '\n\n';


				code += [ 'lychee' ].concat(environment.packages.map(function(pkg) {
					return pkg.id;
				})).map(function(lib) {
					return 'let ' + lib + ' = sandbox.' + lib + ';';
				}).join('\n');

				code += '\n\n';
				code += 'sandbox.MAIN = new ' + environment.build + '(' + JSON.stringify(env_profile) + ');\n';
				code += '\n\n';
				code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
				code += '\tsandbox.MAIN.init();\n';
				code += '}\n';


				lychee.setEnvironment(environment);
				environment.init(new Function('sandbox', code));

			} else if (message === true) {

				console.warn('lychee.envinit: Invalid environment');
				console.info('lychee.envinit: Use lychee.envinit(env, profile) where env is a lychee.Environment instance');

			}

		},

		pkginit: function(identifier, settings, profile) {

			identifier = typeof identifier === 'string' ? identifier : null;
			settings   = settings instanceof Object     ? settings   : {};
			profile    = profile instanceof Object      ? profile    : {};


			_bootstrap_environment.call(this);


			if (identifier !== null) {

				let config = new Config('./lychee.pkg');

				config.onload = function() {

					let buffer = this.buffer || null;
					if (buffer instanceof Object) {

						if (buffer.build instanceof Object && buffer.build.environments instanceof Object) {

							let data = buffer.build.environments[identifier] || null;
							if (data instanceof Object) {

								let code         = '\n';
								let env_settings = Object.assign({
									id: lychee.ROOT.project + '/' + identifier.split('/').pop()
								}, data, settings);
								let env_profile  = Object.assign({}, data.profile, profile);
								let environment  = new lychee.Environment(env_settings);


								if (_environment !== null) {

									Object.values(_environment.definitions).forEach(function(definition) {
										environment.define(definition);
									});

								}


								code += '\n\n';
								code += 'if (sandbox === null) {\n';
								code += '\tconsole.error("lychee: pkginit() failed.");\n';
								code += '\treturn;\n';
								code += '}\n';
								code += '\n\n';

								code += [ 'lychee' ].concat(env_settings.packages.map(function(pkg) {
									return pkg.id;
								})).map(function(lib) {
									return 'let ' + lib + ' = sandbox.' + lib + ';';
								}).join('\n');

								code += '\n\n';
								code += 'sandbox.MAIN = new ' + env_settings.build + '(' + JSON.stringify(env_profile) + ');\n';
								code += '\n\n';
								code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
								code += '\tsandbox.MAIN.init();\n';
								code += '}\n';


								lychee.setEnvironment(environment);
								environment.init(new Function('sandbox', code));

							} else {

								console.warn('lychee.pkginit: Invalid settings for "' + identifier + '" in lychee.pkg.');
								console.info('lychee.pkginit: Insert settings at "/build/environments/\"' + identifier + '\"" in lychee.pkg.');

							}

						} else {

							console.warn('lychee.pkginit: Invalid package at "' + this.url + '".');
							console.info('lychee.pkginit: Replace lychee.pkg with the one from "/projects/boilerplate".');

						}

					} else {

						console.warn('lychee.pkginit: Invalid package at "' + this.url + '".');
						console.info('lychee.pkginit: Replace lychee.pkg with the one from "/projects/boilerplate".');

					}

				};

				config.load();

			}

		},

		inject: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment.call(this);


			if (environment !== null) {

				if (this.environment !== null) {

					let that = this;

					Object.values(environment.definitions).forEach(function(definition) {
						that.environment.define(definition);
					});

					let build_old = this.environment.definitions[this.environment.build] || null;
					let build_new = environment.definitions[environment.build]           || null;

					if (build_old === null && build_new !== null) {
						this.environment.build = environment.build;
						this.environment.type  = environment.type;
					}


					return true;

				} else {

					console.warn('lychee.inject: Invalid default environment for injection.');
					console.info('lychee.inject: Use lychee.setEnvironment(env) before using lychee.inject(other).');

				}

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug       = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug       = this.environment.debug;

			}


			return false;

		}

	};


	return Object.assign(lychee, Module);

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	/*
	 * HELPERS
	 */

	const _resolve_constructor = function(type) {

		let construct = null;


		if (type === 'json')  construct = global.Config;
		if (type === 'fnt')   construct = global.Font;
		if (type === 'msc')   construct = global.Music;
		if (type === 'pkg')   construct = global.Config;
		if (type === 'png')   construct = global.Texture;
		if (type === 'snd')   construct = global.Sound;
		if (type === 'store') construct = global.Config;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		let asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.substr(0, 5) === 'data:') {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			let construct = _resolve_constructor(type);
			if (construct !== null) {

				if (url.substr(0, 5) === 'data:') {

					asset = new construct('/tmp/Asset.' + type, ignore);
					asset.deserialize({
						buffer: url
					});

				} else {

					asset = new construct(url, ignore);

				}

			}

		}


		return asset;

	};


	Callback.displayName = 'lychee.Asset';


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	let _client      = null;
	let _environment = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			let currentenv = lychee.environment;
			lychee.setEnvironment(null);

			let defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	const _diff_environment = function(environment) {

		let cache1 = {};
		let cache2 = {};

		let global1 = _environment.global;
		let global2 = environment.global;

		for (let prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (let prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		let diff = Object.assign({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	const _report_error = function(environment, data) {

		let info = 'Report from ' + data.file + '#L' + data.line + ' in ' + data.method;
		let main = environment.global.MAIN || null;

		if (main !== null) {

			let client = main.client || null;
			if (client !== null) {

				let service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger: ' + info, data);
				}

			}

		}


		console.error('lychee.Debugger: ' + info);
		console.error('lychee.Debugger: ' + data.message.trim());

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : lychee.environment;


			_bootstrap_environment();


			if (environment !== null && environment !== _environment) {

				let project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						let diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, referer) {


			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			referer     = referer instanceof Object                 ? referer     : null;


			if (environment !== null && error !== null) {

				let definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				let data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        error.toString().split(':')[0],
					message:     error.message
				};


				if (typeof error.stack === 'string') {

					let callsite = error.stack.split('\n')[0].trim();
					if (callsite.charAt(0) === '/') {

						data.file = callsite.split(':')[0];
						data.line = callsite.split(':')[1] || '';

					} else {

						callsite = error.stack.split('\n').find(function(val) {
							return val.trim().substr(0, 2) === 'at';
						});

						if (typeof callsite === 'string') {

							let tmp1 = callsite.trim().split(' ');
							let tmp2 = tmp1[2] || '';

							if (tmp2.charAt(0) === '(')               tmp2 = tmp2.substr(1);
							if (tmp2.charAt(tmp2.length - 1) === ')') tmp2 = tmp2.substr(0, tmp2.length - 1);

							// XXX: Thanks, Blink. Thanks -_-
							if (tmp2.substr(0, 4) === 'http') {
								tmp2 = '/' + tmp2.split('/').slice(3).join('/');
							}

							let tmp3 = tmp2.split(':');

							data.file   = tmp3[0];
							data.line   = tmp3[1];
							data.code   = '';
							data.method = tmp1[1];

						}

					}

				} else if (typeof Error.captureStackTrace === 'function') {

					let orig = Error.prepareStackTrace;

					Error.prepareStackTrace = function(err, stack) {
						return stack;
					};
					Error.captureStackTrace(new Error());


					let stack    = [].slice.call(error.stack);
					let callsite = stack.shift();
					let FILTER   = [ 'module.js', 'vm.js', 'internal/module.js' ];

					while (callsite !== undefined && FILTER.indexOf(callsite.getFileName()) !== -1) {
						callsite = stack.shift();
					}

					if (callsite !== undefined) {

						data.file   = callsite.getFileName();
						data.line   = callsite.getLineNumber();
						data.code   = '' + (callsite.getFunction() || '').toString();
						data.method = callsite.getFunctionName() || callsite.getMethodName();

					}

					Error.prepareStackTrace = orig;

				}


				_report_error(environment, data);


				return true;

			} else {

				console.error(error);

			}


			return false;

		}

	};


	Module.displayName = 'lychee.Debugger';


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _fuzz_asset = function(type) {

		let asset = {
			url: '/tmp/Dummy.' + type,
			serialize: function() {
				return null;
			}
		};


		let file = this.__file;
		if (file !== null) {
			asset.url = file.split('.').slice(0, -1).join('.') + '.' + type;
		}


		Object.defineProperty(asset, 'buffer', {
			get: function() {
				console.warn('lychee.Definition: Injecting Attachment "' + this.url + '" (' + file + ')');
				return null;
			},
			set: function() {
				return false;
			},
			enumerable:   true,
			configurable: false
		});


		return asset;

	};

	const _fuzz_id = function() {

		let file = this.__file;
		if (file !== null) {

			let packages = lychee.environment.packages.filter(function(pkg) {
				return pkg.type === 'source';
			}).map(function(pkg) {

				return {
					id:  pkg.id,
					url: pkg.url.split('/').slice(0, -1).join('/')
				};

			});


			let ns  = file.split('/');
			let pkg = packages.find(function(pkg) {
				return file.substr(0, pkg.url.length) === pkg.url;
			}) || null;


			if (pkg !== null) {

				let tmp_i = ns.indexOf('source');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				let classId = '';
				if (tmp_i !== -1) {
					classId = ns.slice(tmp_i + 1).join('.');
				}


				this.id        = pkg.id + '.' + classId;
				this.classId   = classId;
				this.packageId = pkg.id;

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(id) {

		id = typeof id === 'string' ? id : '';


		this.id        = '';
		this.classId   = '';
		this.packageId = '';

		this.__file    = lychee.Environment.__FILENAME || null;


		if (/\./.test(id)) {

			let tmp = id.split('.');

			this.id        = id;
			this.classId   = tmp.slice(1).join('.');
			this.packageId = tmp[0];

		} else if (/^([A-Za-z0-9\.]+)/g.test(id) === true) {

			this.id        = 'lychee.' + id;
			this.classId   = id;
			this.packageId = 'lychee';

		} else {

			let fuzz_id = _fuzz_id.call(this);
			if (fuzz_id === true) {
				console.warn('lychee.Definition: Injecting Identifier "' + this.id + '" (' + this.__file + ')');
			} else {
				console.error('lychee.Definition: Invalid Identifier "' + id + '" (' + this.__file + ')');
			}

		}


		this._attaches = {
			'json':  _fuzz_asset.call(this, 'json'),
			'fnt':   _fuzz_asset.call(this, 'fnt'),
			'msc':   _fuzz_asset.call(this, 'msc'),
			'pkg':   _fuzz_asset.call(this, 'pkg'),
			'png':   _fuzz_asset.call(this, 'png'),
			'snd':   _fuzz_asset.call(this, 'snd'),
			'store': _fuzz_asset.call(this, 'store')
		};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		return this;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				let attachesmap = {};

				for (let aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			let index1   = 0;
			let index2   = 0;
			let tmp      = null;
			let bindargs = null;

			if (typeof blob.supports === 'string') {

				// Function head
				tmp      = blob.supports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.supports.indexOf('{') + 1;
				index2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(index1, index2 - index1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				tmp      = blob.exports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.exports.indexOf('{') + 1;
				index2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(index1, index2 - index1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let blob = {};


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (let aid in this._attaches) {

					let asset = lychee.serialize(this._attaches[aid]);
					if (asset !== null) {
						blob.attaches[aid] = asset;
					}

				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (let tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ this.id ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let id in map) {

					let value = map[id];
					if (value instanceof Font || value instanceof Music || value instanceof Sound || value instanceof Texture || value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._exports = callback;
			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._includes.indexOf(definition) === -1) {
							this._includes.push(definition);
						}

					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._requires.indexOf(definition) === -1) {
							this._requires.push(definition);
						}

					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._supports = callback;
			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let id in map) {

					let value = map[id];
					if (typeof value === 'string') {
						this._tags[id] = value;
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Definition';
	Composite.prototype.displayName = 'lychee.Definition';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	let   _id     = 0;
	const lychee  = global.lychee;
	const console = global.console;



	/*
	 * EVENTS
	 */

	const _export_loop = function(cache) {

		let that  = this;
		let load  = cache.load;
		let ready = cache.ready;
		let track = cache.track;

		let identifier, definition;


		for (let l = 0, ll = load.length; l < ll; l++) {

			identifier = load[l];
			definition = this.definitions[identifier] || null;


			if (definition !== null) {

				if (ready.indexOf(identifier) === -1) {
					ready.push(identifier);
				}

				load.splice(l, 1);
				track.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (let r = 0, rl = ready.length; r < rl; r++) {

			identifier = ready[r];
			definition = this.definitions[identifier] || null;

			if (definition !== null) {

				let dependencies = _resolve_definition.call(this, definition);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && ready.indexOf(dependency) === -1) {

							that.load(dependency);
							load.push(dependency);
							track.push(identifier);

						}

					}

				} else {

					_export_definition.call(this, definition);

					ready.splice(r, 1);
					rl--;
					r--;

				}

			}

		}


		if (load.length === 0 && ready.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};



	/*
	 * HELPERS
	 */

	const _detect_features = function(source) {

		if (typeof Proxy === 'undefined') {
			return source;
		}


		let clone = {};
		let proxy = new Proxy(clone, {

			get: function(target, name) {

				// XXX: Remove this and console will crash your program
				if (name === 'splice') return undefined;


				if (target[name] === undefined) {

					let type = typeof source[name];
					if (/boolean|number|string|function/g.test(type)) {
						target[name] = source[name];
					} else if (/object/g.test(type)) {
						target[name] = _detect_features(source[name]);
					} else if (/undefined/g.test(type)) {
						target[name] = undefined;
					}


					if (target[name] === undefined) {
						console.error('lychee.Environment: Unknown feature (data type) "' + name + '" in bootstrap.js');
					}

				}


				return target[name];

			}

		});


		proxy.toJSON = function() {

			let data = {};

			Object.keys(clone).forEach(function(key) {

				if (/toJSON/g.test(key) === false) {

					let type = typeof clone[key];
					if (/boolean|number|string|function/g.test(type)) {
						data[key] = type;
					} else if (/object/g.test(type)) {
						data[key] = clone[key];
					}

				}

			});

			return data;

		};


		return proxy;

	};

	const _inject_features = function(source, features) {

		let target = this;

		Object.keys(features).forEach(function(key) {

			let type = features[key];
			if (/boolean|number|string|function/g.test(type)) {

				target[key] = source[key];

			} else if (typeof type === 'object') {

				if (typeof source[key] === 'object') {

					target[key] = source[key];
					_inject_features.call(target[key], source[key], type);

				}

			}

		});

	};

	const _validate_definition = function(definition) {

		if (!(definition instanceof lychee.Definition)) {
			return false;
		}


		let features  = null;
		let sandbox   = this.sandbox;
		let supported = false;


		if (definition._supports !== null) {

			let detector = _detect_features(Composite.__FEATURES || global);
			if (detector !== null) {

				supported = definition._supports.call(detector, lychee, detector);
				features  = JSON.parse(JSON.stringify(detector));
				detector  = null;

			} else {

				supported = definition._supports.call(global, lychee, global);

			}

		} else {

			supported = true;

		}


		let tagged = true;

		if (Object.keys(definition._tags).length > 0) {

			for (let tag in definition._tags) {

				let value = definition._tags[tag];
				let tags  = this.tags[tag] || null;
				if (tags instanceof Array) {

					if (tags.indexOf(value) === -1) {

						tagged = false;
						break;

					}

				}

			}

		}


		let type = this.type;
		if (type === 'build') {

			if (features !== null && sandbox === true) {
				_inject_features.call(this.global, global, features);
			}

			return tagged;

		} else if (type === 'export') {

			if (features !== null) {

				this.__features = lychee.assignunlink(this.__features, features);

				if (sandbox === true) {
					_inject_features.call(this.global, global, features);
				}

			}

			return tagged;

		} else if (type === 'source') {

			if (features !== null) {

				this.__features = lychee.assignunlink(this.__features, features);

				if (sandbox === true) {
					_inject_features.call(this.global, global, features);
				}

			}

			return supported && tagged;

		}


		return false;

	};

	const _resolve_definition = function(definition) {

		let dependencies = [];


		if (definition instanceof lychee.Definition) {

			for (let i = 0, il = definition._includes.length; i < il; i++) {

				let inc      = definition._includes[i];
				let incclass = _get_class.call(this.global, inc);
				if (incclass === null) {
					dependencies.push(inc);
				}

			}

			for (let r = 0, rl = definition._requires.length; r < rl; r++) {

				let req      = definition._requires[r];
				let reqclass = _get_class.call(this.global, req);
				if (reqclass === null) {
					dependencies.push(req);
				}

			}

		}


		return dependencies;

	};

	const _export_definition = function(definition) {

		if (_get_class.call(this.global, definition.id) !== null) {
			return false;
		}


		let namespace  = _get_namespace.call(this.global, definition.id);
		let identifier = definition.classId.split('.').pop();


		if (this.debug === true) {
			let info = Object.keys(definition._attaches).length > 0 ? ('(' + Object.keys(definition._attaches).length + ' Attachment(s))') : '';
			this.global.console.log('lychee-Environment (' + this.id + '): Exporting "' + definition.id + '" ' + info);
		}



		/*
		 * 1. Export Composite, Module or Callback
		 */

		let template = null;
		if (definition._exports !== null) {

			try {

				template = definition._exports.call(
					definition._exports,
					this.global.lychee,
					this.global,
					definition._attaches
				) || null;

			} catch (err) {
				lychee.Debugger.report(this, err, definition);
			}

		}



		/*
		 * 2. Assign Composite, Module or Callback
		 */

		if (template !== null) {

			/*
			 * 2.1 Assign and export Composite or Module
			 */

			let includes = definition._includes;
			if (includes.length > 0) {

				let ownenums   = null;
				let ownmethods = null;
				let ownkeys    = Object.keys(template);
				let ownproto   = template.prototype;


				if (ownkeys.length > 0) {

					ownenums = {};

					for (let ok = 0, okl = ownkeys.length; ok < okl; ok++) {

						let ownkey = ownkeys[ok];
						if (ownkey === ownkey.toUpperCase()) {
							ownenums[ownkey] = template[ownkey];
						}

					}

					if (Object.keys(ownenums).length === 0) {
						ownenums = null;
					}

				}

				if (ownproto instanceof Object) {

					ownmethods = {};

					for (let ownmethod in ownproto) {
						ownmethods[ownmethod] = ownproto[ownmethod];
					}

					if (Object.keys(ownmethods).length === 0) {
						ownmethods = null;
					}

				}


				Object.defineProperty(namespace, identifier, {
					value:        template,
					writable:     false,
					enumerable:   true,
					configurable: false
				});


				namespace[identifier].displayName = definition.id;
				namespace[identifier].prototype = {};


				let tplenums   = {};
				let tplmethods = [ namespace[identifier].prototype ];


				for (let i = 0, il = includes.length; i < il; i++) {

					let include = _get_template.call(this.global, includes[i]);
					if (include !== null) {

						let inckeys = Object.keys(include);
						if (inckeys.length > 0) {

							for (let ik = 0, ikl = inckeys.length; ik < ikl; ik++) {

								let inckey = inckeys[ik];
								if (inckey === inckey.toUpperCase()) {
									tplenums[inckey] = include[inckey];
								}

							}

						}

						tplmethods.push(include.prototype);

					} else {

						if (this.debug === true) {
							console.error('lychee-Environment (' + this.id + '): Invalid Inclusion of "' + includes[i] + '"');
						}

					}

				}


				if (ownenums !== null) {

					for (let e in ownenums) {
						tplenums[e] = ownenums[e];
					}

				}

				if (ownmethods !== null) {
					tplmethods.push(ownmethods);
				}


				for (let e in tplenums) {
					namespace[identifier][e] = tplenums[e];
				}

				Object.assign.apply(lychee, tplmethods);
				namespace[identifier].prototype.displayName = definition.id;

				Object.freeze(namespace[identifier].prototype);


			/*
			 * 2.2 Nothing to include, plain Definition
			 */

			} else {

				namespace[identifier] = template;
				namespace[identifier].displayName = definition.id;


				if (template instanceof Object) {
					Object.freeze(namespace[identifier]);
				}

				if (namespace[identifier].prototype instanceof Object) {
					namespace[identifier].prototype.displayName = definition.id;
					Object.freeze(namespace[identifier].prototype);
				}

			}

		} else {

			namespace[identifier] = function() {};
			namespace[identifier].displayName = definition.id;
			namespace[identifier].prototype = {};
			namespace[identifier].prototype.displayName = definition.id;

			Object.freeze(namespace[identifier].prototype);


			this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '", it is replaced with a Dummy Composite');

		}


		return true;

	};

	const _get_class = function(identifier) {

		let id = identifier.split('.').pop();

		let pointer = _get_namespace.call(this, identifier);
		if (pointer[id] !== undefined) {
			return pointer;
		}


		return null;

	};

	const _get_namespace = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.'); ns.pop();
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		return pointer;

	};

	const _get_template = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * STRUCTS
	 */

	const _Sandbox = function(settings) {

		let that     = this;
		let _std_err = '';
		let _std_out = '';


		this.console = {};
		this.console.log = function() {

			let str = '\n';

			for (let a = 0, al = arguments.length; a < al; a++) {

				let arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.substr(0, 5) === '\n(E)\t') {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			let args = [ '(I)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			let args = [ '(W)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			let args = [ '(E)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			let blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.environment  = null;
		this.lychee.ENVIRONMENTS = global.lychee.ENVIRONMENTS;
		this.lychee.VERSION      = global.lychee.VERSION;
		this.lychee.ROOT         = {};
		this.lychee.ROOT.lychee  = global.lychee.ROOT.lychee;
		this.lychee.ROOT.project = global.lychee.ROOT.project;

		[
			'assignsafe',
			'assignunlink',
			'debug',
			'diff',
			'enumof',
			'interfaceof',
			'deserialize',
			'serialize',
			'define',
			'import',
			'envinit',
			'pkginit',
			'setEnvironment',
			'Asset',
			'Debugger',
			'Definition',
			'Environment',
			'Package'
		].forEach(function(identifier) {

			that.lychee[identifier] = global.lychee[identifier];

		});


		this.require = function(path) {
			return global.require(path);
		};

		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * INITIALIZATION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(function(key) {

				let instance = lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			}.bind(this));

		}

	};

	_Sandbox.prototype = {

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			let settings = {};
			let blob     = {};


			Object.keys(this).filter(function(key) {
				return key.charAt(0) !== '_' && key === key.toUpperCase();
			}).forEach(function(key) {
				settings[key] = lychee.serialize(this[key]);
			}.bind(this));


			blob.lychee         = {};
			blob.lychee.debug   = this.lychee.debug;
			blob.lychee.VERSION = this.lychee.VERSION;
			blob.lychee.ROOT    = this.lychee.ROOT;


			let data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.build       = 'app.Main';
		this.debug       = true;
		this.definitions = {};
		this.global      = global;
		this.packages    = [];
		this.sandbox     = false;
		this.tags        = {};
		this.timeout     = 10000;
		this.type        = 'source';


		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			ready:         [],
			track:         []
		};
		this.__features = {};


		// Alternative API for lychee.pkg

		if (settings.packages instanceof Array) {

			for (let p = 0, pl = settings.packages.length; p < pl; p++) {

				let pkg = settings.packages[p];
				if (pkg instanceof Array) {
					settings.packages[p] = new lychee.Package(pkg[0], pkg[1]);
				}

			}

		}


		this.setSandbox(settings.sandbox);
		this.setDebug(settings.debug);

		this.setDefinitions(settings.definitions);
		this.setId(settings.id);
		this.setPackages(settings.packages);
		this.setTags(settings.tags);
		this.setTimeout(settings.timeout);

		// Needs this.packages to be ready
		this.setType(settings.type);
		this.setBuild(settings.build);


		settings = null;

	};


	Composite.__FEATURES  = null;
	Composite.__FILENAME  = null;


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (let id in blob.definitions) {
					this.definitions[id] = lychee.deserialize(blob.definitions[id]);
				}

			}

			let features = lychee.deserialize(blob.features);
			if (features !== null) {
				this.__features = features;
			}

			if (blob.packages instanceof Array) {

				let packages = [];

				for (let p = 0, pl = blob.packages.length; p < pl; p++) {
					packages.push(lychee.deserialize(blob.packages[p]));
				}

				this.setPackages(packages);

				// This is a dirty hack which is allowed here
				this.setType(blob.type);
				this.setBuild(blob.build);

			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0]);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			let settings = {};
			let blob     = {};


			if (this.id !== '0')           settings.id      = this.id;
			if (this.build !== 'app.Main') settings.build   = this.build;
			if (this.debug !== true)       settings.debug   = this.debug;
			if (this.sandbox !== true)     settings.sandbox = this.sandbox;
			if (this.timeout !== 10000)    settings.timeout = this.timeout;
			if (this.type !== 'source')    settings.type    = this.type;


			if (Object.keys(this.tags).length > 0) {

				settings.tags = {};

				for (let tagid in this.tags) {
					settings.tags[tagid] = this.tags[tagid];
				}

			}

			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (let defid in this.definitions) {
					blob.definitions[defid] = lychee.serialize(this.definitions[defid]);
				}

			}


			if (Object.keys(this.__features).length > 0) blob.features = lychee.serialize(this.__features);

			if (this.packages.length > 0) {

				blob.packages = [];

				for (let p = 0, pl = this.packages.length; p < pl; p++) {
					blob.packages.push(lychee.serialize(this.packages[p]));
				}

				// This is a dirty hack which is allowed here
				blob.type  = this.type;
				blob.build = this.build;

			}

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let packageId = identifier.split('.')[0];
				let classId   = identifier.split('.').slice(1).join('.');


				let definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else {

					let pkg = this.packages.find(function(pkg) {
						return pkg.id === packageId;
					}) || null;

					if (pkg !== null && pkg.isReady() === true) {

						let result = pkg.load(classId, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee-Environment (' + this.id + '): Loading "' + identifier + '" from Package "' + pkg.id + '"');
							}

						}


						return result;

					}

				}

			}


			return false;

		},

		define: function(definition) {

			let filename = Composite.__FILENAME || null;
			if (filename !== null) {

				if (definition instanceof lychee.Definition) {

					let oldPackageId = definition.packageId;
					let newPackageId = null;

					for (let p = 0, pl = this.packages.length; p < pl; p++) {

						let root = this.packages[p].root;
						if (filename.substr(0, root.length) === root) {
							newPackageId = this.packages[p].id;
							break;
						}

					}


					let assimilation = true;

					for (let p = 0, pl = this.packages.length; p < pl; p++) {

						let id = this.packages[p].id;
						if (id === oldPackageId || id === newPackageId) {
							assimilation = false;
							break;
						}

					}


					if (assimilation === true) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Assimilating Definition "' + definition.id + '"');
						}


						this.__cache.assimilations.push(definition.id);

					} else if (newPackageId !== null && newPackageId !== oldPackageId) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Injecting Definition "' + definition.id + '" as "' + newPackageId + '.' + definition.classId + '"');
						}


						definition.packageId = newPackageId;
						definition.id        = definition.packageId + '.' + definition.classId;

						for (let i = 0, il = definition._includes.length; i < il; i++) {

							let inc = definition._includes[i];
							if (inc.substr(0, oldPackageId.length) === oldPackageId) {
								definition._includes[i] = newPackageId + inc.substr(oldPackageId.length);
							}

						}

						for (let r = 0, rl = definition._requires.length; r < rl; r++) {

							let req = definition._requires[r];
							if (req.substr(0, oldPackageId.length) === oldPackageId) {
								definition._requires[r] = newPackageId + req.substr(oldPackageId.length);
							}

						}

					}

				}

			}


			if (_validate_definition.call(this, definition) === true) {

				if (this.debug === true) {
					let info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
					this.global.console.log('lychee-Environment (' + this.id + '): Mapping "' + definition.id + '" ' + info);
				}

				this.definitions[definition.id] = definition;


				return true;

			} else {

				let info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
				this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '" ' + info);


				return false;

			}

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			let build = this.build;
			let cache = this.__cache;
			let type  = this.type;
			let that  = this;


			if (type === 'source' || type === 'export') {

				let lypkg = this.packages.find(function(pkg) {
					return pkg.id === 'lychee';
				}) || null;

				if (lypkg === null) {

					lypkg = new lychee.Package('lychee', '/libraries/lychee/lychee.pkg');

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): Injecting Package "lychee"');
					}

					lypkg.setEnvironment(this);
					this.packages.push(lypkg);

				}

			}


			if (build !== null && cache.active === false) {

				let result = this.load(build);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): BUILD START ("' + this.build + '")');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ build ];
					cache.ready   = [];
					cache.active  = true;


					let onbuildtimeout = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms)');
						}


						// XXX: Always show Dependency Errors
						if (cache.load.length > 0) {

							this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies\n' + cache.load.map(function(value, index) {
								return '\t - ' + value + ' (required by ' + cache.track[index] + ')';
							}).join('\n'));

						}


						try {
							callback.call(this.global, null);
						} catch (err) {
							lychee.Debugger.report(this, err, null);
						}

					};

					let onbuildsuccess = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD END (' + (cache.end - cache.start) + 'ms)');
						}


						try {
							callback.call(this.global, this.global);
						} catch (err) {
							lychee.Debugger.report(this, err, null);
						}

					};


					let intervalId = setInterval(function() {

						let cache = that.__cache;
						if (cache.active === true) {

							_export_loop.call(that, cache);

						} else if (cache.active === false) {

							if (intervalId !== null) {
								clearInterval(intervalId);
								intervalId = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier = assimilations[a];
									let definition = that.definitions[identifier] || null;
									if (definition !== null) {
										_export_definition.call(that, definition);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								onbuildtimeout.call(that);
							} else {
								onbuildsuccess.call(that);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 3) {

						if (this.debug === true) {
							this.global.console.warn('lychee-Environment (' + this.id + '): Package not ready, retrying in 100ms ...');
						}

						setTimeout(function() {
							that.init(callback);
						}, 100);

					} else {

						this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies\n\t - ' + build + ' (build target)');

					}

				}

			}

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			let proto = path.split(':')[0] || '';
			if (/^http|https/g.test(proto) === false) {
				path = (path.charAt(0) === '/' ? (lychee.ROOT.lychee + path) : (lychee.ROOT.project + '/' + path));
			}


			let tmp = path.split('/');

			for (let t = 0, tl = tmp.length; t < tl; t++) {

				if (tmp[t] === '.') {
					tmp.splice(t, 1);
					tl--;
					t--;
				} else if (tmp[t] === '..') {
					tmp.splice(t - 1, 2);
					tl -= 2;
					t  -= 2;
				}

			}

			return tmp.join('/');

		},

		setBuild: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let type = this.type;
				if (type === 'build') {

					this.build = identifier;

					return true;

				} else {

					let pkg = this.packages.find(function(pkg) {
						return pkg.id === identifier.split('.')[0];
					});

					if (pkg !== null) {

						this.build = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setDebug: function(debug) {

			if (debug === true || debug === false) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (let identifier in definitions) {

					let definition = definitions[identifier];
					if (definition instanceof lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;


				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Array ? packages : null;


			if (packages !== null) {

				this.packages.forEach(function(pkg) {
					pkg.setEnvironment(null);
				});

				this.packages = packages.filter(function(pkg) {

					if (pkg instanceof lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Adding Package "' + pkg.id + '"');
						}

						pkg.setEnvironment(this);

						return true;

					}


					return false;

				}.bind(this));


				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			if (sandbox === true || sandbox === false) {


				if (sandbox !== this.sandbox) {

					this.sandbox = sandbox;


					if (sandbox === true) {

						this.global = new _Sandbox();
						this.global.lychee.setEnvironment(this);

					} else {

						this.global = global;

					}

				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};


				for (let type in tags) {

					let values = tags[type];
					if (values instanceof Array) {

						this.tags[type] = values.filter(function(value) {
							return typeof value === 'string';
						});

					}

				}


				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? timeout : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (type === 'source' || type === 'export' || type === 'build') {

				this.type = type;


				for (let p = 0, pl = this.packages.length; p < pl; p++) {
					this.packages[p].setType(this.type);
				}


				return true;

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Environment';
	Composite.prototype.displayName = 'lychee.Environment';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	const lychee = global.lychee;


	/*
	 * HELPERS
	 */

	const _resolve_root = function() {

		let root = this.root;
		let type = this.type;
		if (type === 'source') {
			root += '/source';
		} else if (type === 'export') {
			root += '/source';
		} else if (type === 'build') {
			root += '/build';
		}


		return root;

	};

	const _resolve_path = function(candidate) {

		let path = typeof candidate === 'string' ? candidate.split('/') : null;


		if (path !== null) {

			let type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			let pointer = this.__config.buffer[type].files || null;
			if (pointer !== null) {

				for (let p = 0, pl = path.length; p < pl; p++) {

					let name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}


			return pointer !== null ? true : false;

		}


		return false;

	};

	const _resolve_attachments = function(candidate) {

		let attachments = {};
		let path        = candidate.split('/');
		if (path.length > 0) {

			let pointer = this.__config.buffer.source.files || null;
			if (pointer !== null) {

				for (let pa = 0, pal = path.length; pa < pal; pa++) {

					let name = path[pa];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}


				if (pointer !== null && pointer instanceof Array) {

					let classpath = _resolve_root.call(this) + '/' + path.join('/');

					for (let po = 0, pol = pointer.length; po < pol; po++) {

						let type = pointer[po];
						if (type !== 'js') {
							attachments[type] = classpath + '.' + type;
						}

					}

				}

			}

		}


		return attachments;

	};

	const _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		let that          = this;
		let candidatepath = id.split('.').join('/');
		let candidates    = [];
		let filter_values = function(tags, tag) {

			return tags[tag].map(function(value) {
				return _resolve_tag.call(that, tag, value) + '/' + candidatepath;
			}).filter(function(path) {
				return _resolve_path.call(that, path);
			});

		};


		if (tags !== null) {

			for (let tag in tags) {

				let values = filter_values(tags, tag);
				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		if (_resolve_path.call(this, candidatepath) === true) {
			candidates.push(candidatepath);
		}


		return candidates;

	};

	const _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		if (tag !== null && value !== null) {

			let type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			let pointer = this.__config.buffer[type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					let path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	const _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			let map = {
				id:           id,
				candidate:    null,
				candidates:   [].concat(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1
			};


			this.__requests[id] = map;


			let candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				let url            = _resolve_root.call(this) + '/' + candidate + '.js';
				let implementation = new lychee.Asset(url, null, false);
				let attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	const _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		let that       = this;
		let identifier = this.id + '.' + map.id;


		implementation.onload = function(result) {

			map.loading--;


			if (result === true) {

				let environment = that.environment;
				let definition  = environment.definitions[identifier] || null;
				if (definition !== null) {

					map.candidate = this;


					let attachmentIds = Object.keys(attachments);


					// Temporary delete definition from environment and re-define it after attachments are all loaded
					if (attachmentIds.length > 0) {

						delete environment.definitions[identifier];

						map.loading += attachmentIds.length;


						attachmentIds.forEach(function(assetId) {

							let url   = attachments[assetId];
							let asset = new lychee.Asset(url);
							if (asset !== null) {

								asset.onload = function(result) {

									map.loading--;

									let tmp = {};
									if (result === true) {
										tmp[assetId] = this;
									} else {
										tmp[assetId] = null;
									}

									definition.attaches(tmp);


									if (map.loading === 0) {
										environment.definitions[identifier] = definition;
									}

								};

								asset.load();

							} else {

								map.loading--;

							}

						});

					}


					for (let i = 0, il = definition._includes.length; i < il; i++) {
						environment.load(definition._includes[i]);
					}

					for (let r = 0, rl = definition._requires.length; r < rl; r++) {
						environment.load(definition._requires[r]);
					}


					return true;

				}

			}



			// If code runs through here, candidate was invalid
			delete that.environment.definitions[identifier];
			that.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(that, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(id, url) {

		id  = typeof id === 'string'  ? id  : 'app';
		url = typeof url === 'string' ? url : null;


		// This is public to allow loading packages
		// as external renamespaced libraries

		this.id   = id;
		this.url  = null;
		this.root = null;

		this.environment = null;
		this.type        = 'source';

		this.__blacklist = {};
		this.__config    = null;
		this.__requests  = {};


		if (url !== null) {

			let that = this;
			let tmp  = url.split('/');

			let file = tmp.pop();
			if (file === 'lychee.pkg') {

				this.root = tmp.join('/');
				this.url  = url;

				this.__config = new Config(this.url);
				this.__config.onload = function(result) {

					if (that.isReady() === false) {
						result = false;
					}


					if (result === true) {
						console.info('lychee.Package-' + that.id + ': Package at "' + this.url + '" ready.');
					} else {
						console.error('lychee.Package-' + that.id + ': Package at "' + this.url + '" corrupt.');
					}

				};
				this.__config.load();

			}

		}

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'constructor': 'lychee.Package',
				'arguments':   [ this.id, this.url ]
			};

		},



		/*
		 * CUSTOM API
		 */

		isReady: function() {

			let ready  = false;
			let config = this.__config;

			if (config !== null && config.buffer !== null) {

				if (config.buffer.source instanceof Object && config.buffer.build instanceof Object) {
					ready = true;
				}

			}


			return ready;

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			if (id !== null && this.isReady() === true) {

				let request = this.__requests[id] || null;
				if (request === null) {

					let candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						let info = Object.keys(tags).length > 0 ? ('(' + JSON.stringify(tags) + ')') : '';
						console.error('lychee.Package-' + this.id + ': Invalid Definition "' + id + '" ' + info);

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (type === 'source' || type === 'export' || type === 'build') {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Package';
	Composite.prototype.displayName = 'lychee.Package';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


(function(lychee, global) {

	let _filename = null;
	let _protocol = null;



	/*
	 * FEATURE DETECTION
	 */

	(function(location, selfpath) {

		let origin = location.origin || '';
		let cwd    = (location.pathname || '');
		let proto  = origin.split(':')[0];


		// Hint: CDNs might have no proper redirect to index.html
		if (/\.(htm|html)$/g.test(cwd.split('/').pop()) === true) {
			cwd = cwd.split('/').slice(0, -1).join('/');
		}


		if (/^(http|https)$/g.test(proto)) {

			// Hint: The harvester (HTTP server) understands
			// /projects/* and /libraries/* requests.

			lychee.ROOT.lychee = '';
			_protocol = proto;


			if (cwd !== '') {
				lychee.ROOT.project = cwd === '/' ? '' : cwd;
			}

		} else if (/^(app|file|chrome-extension)$/g.test(proto)) {

			let tmp1 = selfpath.indexOf('/libraries/lychee');
			let tmp2 = selfpath.indexOf('://');

			if (tmp1 !== -1 && tmp2 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1).substr(tmp2 + 3);
			} else if (tmp1 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1);
			}


			let tmp3 = selfpath.split('/').slice(0, 3).join('/');
			if (tmp3.substr(0, 13) === '/opt/lycheejs') {
				lychee.ROOT.lychee = tmp3;
			}

			if (/^(file|chrome-extension)$/g.test(proto)) {
				_protocol = 'file';
			}


			if (cwd !== '') {
				lychee.ROOT.project = cwd;
			}

		}

	})(global.location || {}, (document.currentScript || {}).src || '');



	/*
	 * HELPERS
	 */

	const _load_asset = function(settings, callback, scope) {

		let path = lychee.environment.resolve(settings.url);
		let xhr  = new XMLHttpRequest();


		if (path.substr(0, 13) === '/opt/lycheejs' && _protocol !== null) {
			xhr.open('GET', _protocol + '://' + path, true);
		} else {
			xhr.open('GET', path, true);
		}


		if (settings.headers instanceof Object) {

			for (let header in settings.headers) {
				xhr.setRequestHeader(header, settings.headers[header]);
			}

		}


		xhr.onload = function() {

			try {
				callback.call(scope, xhr.responseText || xhr.responseXML);
			} catch (err) {
				lychee.Debugger.report(lychee.environment, err, null);
			} finally {
				xhr = null;
			}

		};

		xhr.onerror = xhr.ontimeout = function() {

			try {
				callback.call(scope, null);
			} catch (err) {
				lychee.Debugger.report(lychee.environment, err, null);
			} finally {
				xhr = null;
			}

		};


		xhr.send(null);

	};



	/*
	 * POLYFILLS
	 */

	let consol = 'console' in global && typeof console !== 'undefined';
	if (consol === false) {
		console = {};
	}

	const  _clear   = console.clear || function() {};
	const  _log     = console.log   || function() {};
	const  _info    = console.info  || console.log;
	const  _warn    = console.warn  || console.log;
	const  _error   = console.error || console.log;
	let    _std_out = '';
	let    _std_err = '';


	console.clear = function() {
		_clear.call(console);
	};

	console.log = function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += args.join('\t') + '\n';
		_log.apply(console, args);

	};

	console.info = function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += args.join('\t') + '\n';
		_info.apply(console, args);

	};

	console.warn = function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += args.join('\t') + '\n';
		_warn.apply(console, args);

	};

	console.error = function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_err += args.join('\t') + '\n';
		_error.apply(console, args);

	};

	console.deserialize = function(blob) {

		if (typeof blob.stdout === 'string') {
			_std_out = blob.stdout;
		}

		if (typeof blob.stderr === 'string') {
			_std_err = blob.stderr;
		}

	};

	console.serialize = function() {

		let blob = {};


		if (_std_out.length > 0) blob.stdout = _std_out;
		if (_std_err.length > 0) blob.stderr = _std_err;


		return {
			'reference': 'console',
			'blob':      Object.keys(blob).length > 0 ? blob : null
		};

	};



	/*
	 * EASTER EGG
	 */

	(function(log, console) {

		let css = [
			'font-family:monospace;font-size:16px;color:#ffffff;background:#405050',
			'font-family:monospace;font-size:16px;color:#d0494b;background:#405050'
		];

		let is_chrome  = /Chrome/g.test(navigator.userAgent.split(' ').slice(-2, -1)[0] || '');
		let is_opera   = /OPR/g.test(navigator.userAgent.split(' ').slice(-1) || '');
		let is_safari  = /AppleWebKit/g.test(navigator.userAgent);
		let is_firefox = !!(console.firebug || console.exception);


		if (is_chrome || is_opera) {

			log.call(console, '%c                                        ',                                         css[0]);
			log.call(console, '%c      %c\u2597\u2584\u2596%c        lychee.%cjs%c ' + lychee.VERSION + '      ',   css[0], css[1], css[0], css[1], css[0]);
			log.call(console, '%c    \u259c\u2584%c\u259d\u2580\u2598%c\u2584\u259b      Isomorphic Engine      ',  css[0], css[1], css[0]);
			log.call(console, '%c    \u259f\u2580\u2580\u2580\u2580\u2580\u2599    https://lychee.js.org    ',      css[0]);
			log.call(console, '%c                                        ',                                         css[0]);

		} else if (is_firefox) {

			log.call(console, '%c                                        ',                                         css[0]);
			log.call(console, '%c      %c\u2597\u2584\u2596%c        lychee.%cjs%c ' + lychee.VERSION + '      ',   css[0], css[1], css[0], css[1], css[0]);
			log.call(console, '%c    \u259c\u2584%c\u259d\u2580\u2598%c\u2584\u259b      Isomorphic Engine      ',  css[0], css[1], css[0]);
			log.call(console, '%c   \u259f\u2580\u2580\u2580\u2580\u2580\u2599    https://lychee.js.org   ',        css[0]);
			log.call(console, '%c                                        ',                                         css[0]);
			log.call(console, '%c    Please use Chrome/Chromium/Opera    ',                                         css[0]);
			log.call(console, '%c    We recommend the Blink Dev Tools    ',                                         css[0]);
			log.call(console, '%c                                        ',                                         css[0]);

		} else if (is_safari) {

			log.call(console, '%c                                        ',                                         css[0]);
			log.call(console, '%c      %c\u2597\u2584\u2596%c        lychee.%cjs%c ' + lychee.VERSION + '      ',   css[0], css[1], css[0], css[1], css[0]);
			log.call(console, '%c    \u259c\u2584%c\u259d\u2580\u2598%c\u2584\u259b      Isomorphic Engine      ',  css[0], css[1], css[0]);
			log.call(console, '%c    \u259f\u2580\u2580\u2580\u2580\u2580\u2599    https://lychee.js.org    ',      css[0]);
			log.call(console, '%c                                        ',                                         css[0]);
			log.call(console, '%c    Please use Chrome/Chromium/Opera    ',                                         css[0]);
			log.call(console, '%c    We recommend the Blink Dev Tools    ',                                         css[0]);
			log.call(console, '%c                                        ',                                         css[0]);

		} else {

			log.call(console, '    lychee.js ' + lychee.VERSION + '                   ');
			log.call(console, '    Isomorphic Engine                   ');
			log.call(console, '                                        ');
			log.call(console, '    Please use Chrome/Chromium/Opera    ');
			log.call(console, '    We recommend the Blink Dev Tools    ');
			log.call(console, '                                        ');

		}

	})(_log, console);



	/*
	 * FEATURE DETECTION
	 */

	let _audio_supports_ogg = false;
	let _audio_supports_mp3 = false;

	(function() {

		const _buffer_cache = {};
		const _load_buffer  = function(url) {

			let cache = _buffer_cache[url] || null;
			if (cache === null) {

				let xhr = new XMLHttpRequest();

				xhr.open('GET', url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function() {

					let bytes  = new Uint8Array(xhr.response);
					let buffer = new Buffer(bytes.length);

					for (let b = 0, bl = bytes.length; b < bl; b++) {
						buffer[b] = bytes[b];
					}

					cache = _buffer_cache[url] = buffer;

				};
				xhr.onerror = xhr.ontimeout = function() {
					cache = _buffer_cache[url] = new Buffer(0);
				};
				xhr.send(null);

			}

			return cache;

		};


		let audio  = 'Audio' in global && typeof Audio !== 'undefined';
		let buffer = true;
		let image  = 'Image' in global && typeof Image !== 'undefined';


		if (audio) {

			let audiotest = new Audio();

			[ 'application/ogg', 'audio/ogg', 'audio/ogg; codecs=theora, vorbis' ].forEach(function(variant) {

				if (audiotest.canPlayType(variant)) {
					_audio_supports_ogg = true;
				}

			});

			[ 'audio/mpeg' ].forEach(function(variant) {

				if (audiotest.canPlayType(variant)) {
					_audio_supports_mp3 = true;
				}

			});

		} else {

			Audio = function() {

				this.src         = '';
				this.currentTime = 0;
				this.volume      = 0;
				this.autobuffer  = false;
				this.preload     = false;

				this.onload  = null;
				this.onerror = null;

			};


			Audio.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				},

				play: function() {

				},

				pause: function() {

				},

				addEventListener: function() {

				}

			};

		}


		Audio.prototype.toString = function(encoding) {

			if (encoding === 'base64' || encoding === 'binary') {

				let url = this.src;
				if (url !== '' && url.substr(0, 5) !== 'data:') {

					let buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString(encoding);
					}

				}


				let index = url.indexOf('base64,') + 7;
				if (index > 7) {

					let tmp = new Buffer(url.substr(index, url.length - index), 'base64');
					if (tmp.length > 0) {
						return tmp.toString(encoding);
					}

				}


				return '';

			}


			return Object.prototype.toString.call(this);

		};


		if (!image) {

			Image = function() {

				this.src    = '';
				this.width  = 0;
				this.height = 0;

				this.onload  = null;
				this.onerror = null;

			};


			Image.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				}

			};

		}


		Image.prototype.toString = function(encoding) {

			if (encoding === 'base64' || encoding === 'binary') {

				let url = this.src;
				if (url !== '' && url.substr(0, 5) !== 'data:') {

					let buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString(encoding);
					}

				}


				let index = url.indexOf('base64,') + 7;
				if (index > 7) {

					let tmp = new Buffer(url.substr(index, url.length - index), 'base64');
					if (tmp.length > 0) {
						return tmp.toString(encoding);
					}

				}


				return '';

			}


			return Object.prototype.toString.call(this);

		};


		if (lychee.debug === true) {

			let methods = [];

			if (consol) methods.push('console');
			if (audio)  methods.push('Audio');
			if (buffer) methods.push('Buffer');
			if (image)  methods.push('Image');

			if (methods.length === 0) {
				console.error('bootstrap.js: Supported methods are NONE');
			} else {
				console.info('bootstrap.js: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * BUFFER IMPLEMENTATION
	 */

	const _coerce = function(num) {
		num = ~~Math.ceil(+num);
		return num < 0 ? 0 : num;
	};

	const _clean_base64 = function(str) {

		str = str.trim().replace(/[^+\/0-9A-z]/g, '');

		while (str.length % 4 !== 0) {
			str = str + '=';
		}

		return str;

	};

	const _utf8_to_bytes = function(str) {

		let bytes = [];

		for (let s = 0; s < str.length; s++) {

			let byt = str.charCodeAt(s);
			if (byt <= 0x7F) {
				bytes.push(byt);
			} else {

				let start = s;
				if (byt >= 0xD800 && byt <= 0xDFF) s++;

				let tmp = encodeURIComponent(str.slice(start, s + 1)).substr(1).split('%');
				for (let t = 0; t < tmp.length; t++) {
					bytes.push(parseInt(tmp[t], 16));
				}

			}

		}

		return bytes;

	};

	const _decode_utf8_char = function(str) {

		try {
			return decodeURIComponent(str);
		} catch (err) {
			return String.fromCharCode(0xFFFD);
		}

	};

	const _utf8_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';
		let tmp = '';

		for (let b = start; b < end; b++) {

			if (buffer[b] <= 0x7F) {
				str += _decode_utf8_char(tmp) + String.fromCharCode(buffer[b]);
				tmp = '';
			} else {
				tmp += '%' + buffer[b].toString(16);
			}

		}

		return str + _decode_utf8_char(tmp);

	};

	const _decode_base64 = (function() {

		const _PLUS   = '+'.charCodeAt(0);
		const _SLASH  = '/'.charCodeAt(0);
		const _NUMBER = '0'.charCodeAt(0);
		const _LOWER  = 'a'.charCodeAt(0);
		const _UPPER  = 'A'.charCodeAt(0);

		return function(elt) {

			let code = elt.charCodeAt(0);

			if (code === _PLUS)        return 62;
			if (code === _SLASH)       return 63;
			if (code  <  _NUMBER)      return -1;
			if (code  <  _NUMBER + 10) return code - _NUMBER + 26 + 26;
			if (code  <  _UPPER  + 26) return code - _UPPER;
			if (code  <  _LOWER  + 26) return code - _LOWER  + 26;

		};

	})();

	const _base64_to_bytes = function(str) {

		if (str.length % 4 === 0) {

			let length       = str.length;
			let placeholders = '=' === str.charAt(length - 2) ? 2 : '=' === str.charAt(length - 1) ? 1 : 0;

			let bytes = new Array(length * 3 / 4 - placeholders);
			let l     = placeholders > 0 ? str.length - 4 : str.length;

			let tmp;
			let b = 0;
			let i = 0;

			while (i < l) {

				tmp = (_decode_base64(str.charAt(i)) << 18) | (_decode_base64(str.charAt(i + 1)) << 12) | (_decode_base64(str.charAt(i + 2)) << 6) | (_decode_base64(str.charAt(i + 3)));

				bytes[b++] = (tmp & 0xFF0000) >> 16;
				bytes[b++] = (tmp & 0xFF00)   >>  8;
				bytes[b++] =  tmp & 0xFF;

				i += 4;

			}


			if (placeholders === 2) {

				tmp = (_decode_base64(str.charAt(i)) << 2)  | (_decode_base64(str.charAt(i + 1)) >> 4);

				bytes[b++] = tmp        & 0xFF;

			} else if (placeholders === 1) {

				tmp = (_decode_base64(str.charAt(i)) << 10) | (_decode_base64(str.charAt(i + 1)) << 4) | (_decode_base64(str.charAt(i + 2)) >> 2);

				bytes[b++] = (tmp >> 8) & 0xFF;
				bytes[b++] =  tmp       & 0xFF;

			}


			return bytes;

		}


		return [];

	};

	const _encode_base64 = (function() {

		const _TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		return function(num) {
			return _TABLE.charAt(num);
		};

	})();

	const _base64_to_string = function(buffer, start, end) {

		let bytes      = buffer.slice(start, end);
		let extrabytes = bytes.length % 3;
		let l          = bytes.length - extrabytes;
		let str        = '';


		let tmp;

		for (let i = 0; i < l; i += 3) {

			tmp = (bytes[i] << 16) + (bytes[i + 1] << 8) + (bytes[i + 2]);

			str += (_encode_base64(tmp >> 18 & 0x3F) + _encode_base64(tmp >> 12 & 0x3F) + _encode_base64(tmp >> 6 & 0x3F) + _encode_base64(tmp & 0x3F));

		}


		if (extrabytes === 2) {

			tmp = (bytes[bytes.length - 2] << 8) + (bytes[bytes.length - 1]);

			str += _encode_base64(tmp >> 10);
			str += _encode_base64((tmp >> 4) & 0x3F);
			str += _encode_base64((tmp << 2) & 0x3F);
			str += '=';

		} else if (extrabytes === 1) {

			tmp = bytes[bytes.length - 1];

			str += _encode_base64(tmp >> 2);
			str += _encode_base64((tmp << 4) & 0x3F);
			str += '==';

		}


		return str;

	};

	const _binary_to_bytes = function(str) {

		let bytes = [];

		for (let s = 0; s < str.length; s++) {
			bytes.push(str.charCodeAt(s) & 0xFF);
		}

		return bytes;

	};

	const _binary_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';

		for (let b = start; b < end; b++) {
			str += String.fromCharCode(buffer[b]);
		}

		return str;

	};

	const _hex_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';

		for (let b = start; b < end; b++) {
			str += String.fromCharCode(buffer[b]);
		}

		return str;

	};

	const _copy_buffer = function(source, target, offset, length) {

		let i = 0;

		for (i = 0; i < length; i++) {

			if (i + offset >= target.length) break;
			if (i >= source.length)          break;

			target[i + offset] = source[i];

		}

		return i;

	};

	const _copy_hexadecimal = function(source, target, offset, length) {

		let strlen = source.length;
		if (strlen % 2 !== 0) {
			throw new Error('Invalid hex string');
		}

		if (length > strlen / 2) {
			length = strlen / 2;
		}


		let i = 0;

		for (i = 0; i < length; i++) {

			let num = parseInt(source.substr(i * 2, 2), 16);
			if (isNaN(num)) {
				return i;
			}

			target[i + offset] = num;

		}


		return i;

	};



	const Buffer = function(subject, encoding) {

		let type = typeof subject;
		if (type === 'string' && encoding === 'base64') {
			subject = _clean_base64(subject);
		}


		this.length = 0;


		if (type === 'string') {

			this.length = Buffer.byteLength(subject, encoding);

			this.write(subject, 0, encoding);

		} else if (type === 'number') {

			this.length = _coerce(subject);

			for (let n = 0; n < this.length; n++) {
				this[n] = 0;
			}

		} else if (Buffer.isBuffer(subject)) {

			this.length = subject.length;

			for (let b = 0; b < this.length; b++) {
				this[b] = subject[b];
			}

		}


		return this;

	};

	Buffer.byteLength = function(str, encoding) {

		str      = typeof str === 'string'      ? str      : '';
		encoding = typeof encoding === 'string' ? encoding : 'utf8';


		let length = 0;

		if (encoding === 'utf8') {
			length = _utf8_to_bytes(str).length;
		} else if (encoding === 'base64') {
			length = _base64_to_bytes(str).length;
		} else if (encoding === 'binary') {
			length = str.length;
		} else if (encoding === 'hex') {
			length = str.length >>> 1;
		}


		return length;

	};

	Buffer.isBuffer = function(buffer) {

		if (buffer instanceof Buffer) {
			return true;
		}

		return false;

	};

	Buffer.prototype = {

		serialize: function() {

			return {
				'constructor': 'Buffer',
				'arguments':   [ this.toString('base64'), 'base64' ]
			};

		},

		copy: function(target, target_start, start, end) {

			target_start = typeof target_start === 'number' ? (target_start | 0) : 0;
			start        = typeof start === 'number'        ? (start | 0)        : 0;
			end          = typeof end === 'number'          ? (end   | 0)        : this.length;


			if (start === end)       return;
			if (target.length === 0) return;
			if (this.length === 0)   return;


			end = Math.min(end, this.length);

			let diff        = end - start;
			let target_diff = target.length - target_start;
			if (target_diff < diff) {
				end = target_diff + start;
			}


			for (let b = 0; b < diff; b++) {
				target[b + target_start] = this[b + start];
			}

		},

		map: function(callback) {

			callback = callback instanceof Function ? callback : null;


			let clone = new Buffer(this.length);

			if (callback !== null) {

				for (let b = 0; b < this.length; b++) {
					clone[b] = callback(this[b], b);
				}

			} else {

				for (let b = 0; b < this.length; b++) {
					clone[b] = this[b];
				}

			}

			return clone;

		},

		slice: function(start, end) {

			let length = this.length;

			start = typeof start === 'number' ? (start | 0) : 0;
			end   = typeof end === 'number'   ? (end   | 0) : length;

			start = Math.min(start, length);
			end   = Math.min(end,   length);


			let diff  = end - start;
			let clone = new Buffer(diff);

			for (let b = 0; b < diff; b++) {
				clone[b] = this[b + start];
			}

			return clone;

		},

		write: function(str, offset, length, encoding) {

			offset   = typeof offset === 'number'   ? offset   : 0;
			encoding = typeof encoding === 'string' ? encoding : 'utf8';


			let remaining = this.length - offset;
			if (typeof length === 'string') {
				encoding = length;
				length   = remaining;
			}

			if (length > remaining) {
				length = remaining;
			}


			let diff = 0;

			if (encoding === 'utf8') {
				diff = _copy_buffer(_utf8_to_bytes(str),   this, offset, length);
			} else if (encoding === 'base64') {
				diff = _copy_buffer(_base64_to_bytes(str), this, offset, length);
			} else if (encoding === 'binary') {
				diff = _copy_buffer(_binary_to_bytes(str), this, offset, length);
			} else if (encoding === 'hex') {
				diff = _copy_hexadecimal(str, this, offset, length);
			}


			return diff;

		},

		toString: function(encoding, start, end) {

			encoding = typeof encoding === 'string' ? encoding : 'utf8';
			start    = typeof start === 'number'    ? start    : 0;
			end      = typeof end === 'number'      ? end      : this.length;


			if (start === end) {
				return '';
			}


			let str = '';

			if (encoding === 'utf8') {
				str = _utf8_to_string(this,   start, end);
			} else if (encoding === 'base64') {
				str = _base64_to_string(this, start, end);
			} else if (encoding === 'binary') {
				str = _binary_to_string(this, start, end);
			} else if (encoding === 'hex') {
				str = _hex_to_string(this, start, end);
			}


			return str;

		}

	};



	/*
	 * CONFIG IMPLEMENTATION
	 */

	const _CONFIG_CACHE = {};

	const _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};


	const Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_CONFIG_CACHE[url] !== undefined) {
				_clone_config(_CONFIG_CACHE[url], this);
			} else {
				_CONFIG_CACHE[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
				this.__load = false;
			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.buffer, null, '\t'), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:     this.url,
				headers: {
					'Content-Type': 'application/json; charset=utf8'
				}
			}, function(raw) {

				let data = null;
				try {
					data = JSON.parse(raw);
				} catch (err) {
				}


				this.buffer = data;
				this.__load = false;


				if (data === null) {
					console.warn('bootstrap.js: Invalid Config at "' + this.url + '" (No JSON file).');
				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * FONT IMPLEMENTATION
	 */

	const _parse_font = function() {

		let data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			let texture = new Texture(data.texture);
			let that    = this;

			texture.onload = function() {
				that.texture = this;
			};

			texture.load();

		} else {

			console.warn('bootstrap.js: Invalid Font at "' + this.url + '" (No FNT file).');

		}


		this.baseline   = typeof data.baseline === 'number'   ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'    ? data.charset    : this.charset;
		this.lineheight = typeof data.lineheight === 'number' ? data.lineheight : this.lineheight;
		this.kerning    = typeof data.kerning === 'number'    ? data.kerning    : this.kerning;
		this.spacing    = typeof data.spacing === 'number'    ? data.spacing    : this.spacing;


		if (data.font instanceof Object) {

			this.__font.color   = data.font.color   || '#ffffff';
			this.__font.family  = data.font.family  || 'Ubuntu Mono';
			this.__font.outline = data.font.outline || 0;
			this.__font.size    = data.font.size    || 16;
			this.__font.style   = data.font.style   || 'normal';

		}


		_parse_font_characters.call(this);

	};

	const _parse_font_characters = function() {

		let data = this.__buffer;
		let url  = this.url;

		if (_CHAR_CACHE[url] === undefined) {
			_CHAR_CACHE[url] = {};
		}

		if (data.map instanceof Array) {

			let offset = this.spacing;

			for (let c = 0, cl = this.charset.length; c < cl; c++) {

				let id  = this.charset[c];
				let chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;

				_CHAR_CACHE[url][id] = chr;

			}

		}

	};


	const _CHAR_CACHE = {};
	const _FONT_CACHE = {};

	const _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};


	const Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.kerning    = 0;
		this.spacing    = 0;
		this.lineheight = 0;

		this.__buffer   = null;
		this.__font     = {
			color:   '#ffffff',
			family:  'Ubuntu Mono',
			outline: 0,
			size:    16,
			style:   'normal'
		};
		this.__load     = true;


		if (url !== null) {

			if (_CHAR_CACHE[url] === undefined) {

				_CHAR_CACHE[url]     = {};
				_CHAR_CACHE[url][''] = {
					width:      0,
					height:     this.lineheight,
					realwidth:  0,
					realheight: this.lineheight,
					x:          0,
					y:          0
				};

			}


			if (_FONT_CACHE[url] !== undefined) {
				_clone_font(_FONT_CACHE[url], this);
			} else {
				_FONT_CACHE[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.__buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
				this.__load   = false;
				_parse_font.call(this);
			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.__buffer), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : '';


			let cache = _CHAR_CACHE[this.url] || null;
			if (cache !== null) {

				let tl = text.length;
				if (tl === 1) {

					if (cache[text] !== undefined) {
						return cache[text];
					}

				} else if (tl > 1) {

					let data = cache[text] || null;
					if (data === null) {

						let check = cache[this.charset[0]] || null;
						if (check === null) {
							_parse_font_characters.call(this);
						}


						let width = 0;

						for (let t = 0; t < tl; t++) {
							let chr = this.measure(text[t]);
							if (chr !== null) {
								width += chr.realwidth + this.kerning;
							}
						}


						if (width > 0) {

							// TODO: Embedded Font ligatures will set x and y values based on settings.map

							data = cache[text] = {
								width:      width,
								height:     this.lineheight,
								realwidth:  width,
								realheight: this.lineheight,
								x:          0,
								y:          0
							};

						}

					}


					return data;

				}


				return cache[''];

			}


			return null;

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:     this.url,
				headers: {
					'Content-Type': 'application/json; charset=utf8'
				}
			}, function(raw) {

				let data = null;
				try {
					data = JSON.parse(raw);
				} catch (err) {
				}


				if (data !== null) {

					this.__buffer = data;
					this.__load   = false;

					_parse_font.call(this);

				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * MUSIC IMPLEMENTATION
	 */

	const _MUSIC_CACHE = {};

	const _clone_music = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.play();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	const Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_MUSIC_CACHE[url] !== undefined) {
				_clone_music(_MUSIC_CACHE[url], this);
			} else {
				_MUSIC_CACHE[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				let url  = null;
				let type = null;

				if (_audio_supports_ogg === true) {

					if (typeof blob.buffer.ogg === 'string') {
						url  = url  || blob.buffer.ogg;
						type = type || 'ogg';
					}

				} else if (_audio_supports_mp3 === true) {

					if (typeof blob.buffer.mp3 === 'string') {
						url  = url  || blob.buffer.mp3;
						type = type || 'mp3';
					}

				}


				if (url !== null && type !== null) {

					let that   = this;
					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						that.play();
					}, true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = url;
					buffer.load();

					this.buffer         = buffer;
					this.__buffer[type] = buffer;
					this.__load         = false;

				}

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url  = this.url;
			let type = null;

			if (_audio_supports_ogg === true) {
				type = type || 'ogg';
			} else if (_audio_supports_mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				let that   = this;
				let buffer = new Audio();

				buffer.onload = function() {

					that.buffer         = this;
					that.__buffer[type] = this;

					this.toString('base64');
					this.__load = false;

					if (that.onload instanceof Function) {
						that.onload(true);
						that.onload = null;
					}

				};

				buffer.onerror = function() {

					if (that.onload instanceof Function) {
						that.onload(false);
						that.onload = null;
					}

				};

				buffer.addEventListener('ended', function() {
					that.play();
				}, true);

				buffer.autobuffer = true;
				buffer.preload    = true;


				let path = lychee.environment.resolve(url + '.' + type);
				if (path.substr(0, 13) === '/opt/lycheejs' && _protocol !== null) {
					buffer.src = _protocol + '://' + path;
				} else {
					buffer.src = path;
				}


				buffer.load();
				buffer.onload();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

				if (this.buffer.currentTime === 0) {

					let p = this.buffer.play();
					if (typeof p === 'object' && typeof p.catch === 'function') {
						p.catch(function(err) {});
					}

					this.isIdle = false;
				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {

				let p = this.buffer.play();
				if (typeof p === 'object' && typeof p.catch === 'function') {
					p.catch(function(err) {});
				}

				this.isIdle = false;

			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};



	/*
	 * SOUND IMPLEMENTATION
	 */

	const _SOUND_CACHE = {};

	const _clone_sound = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.isIdle = true;
				clone.stop();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	const Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_SOUND_CACHE[url] !== undefined) {
				_clone_sound(_SOUND_CACHE[url], this);
			} else {
				_SOUND_CACHE[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				let url  = null;
				let type = null;

				if (_audio_supports_ogg === true) {

					if (typeof blob.buffer.ogg === 'string') {
						url  = url  || blob.buffer.ogg;
						type = type || 'ogg';
					}

				} else if (_audio_supports_mp3 === true) {

					if (typeof blob.buffer.mp3 === 'string') {
						url  = url  || blob.buffer.mp3;
						type = type || 'mp3';
					}

				}


				if (url !== null && type !== null) {

					let that   = this;
					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						that.stop();
					}, true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = url;
					buffer.load();

					this.buffer         = buffer;
					this.__buffer[type] = buffer;
					this.__load         = false;

				}

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url  = this.url;
			let type = null;

			if (_audio_supports_ogg === true) {
				type = type || 'ogg';
			} else if (_audio_supports_mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				let that   = this;
				let buffer = new Audio();

				buffer.onload = function() {

					that.buffer         = this;
					that.__buffer[type] = this;

					this.toString('base64');
					this.__load = false;

					if (that.onload instanceof Function) {
						that.onload(true);
						that.onload = null;
					}

				};

				buffer.onerror = function() {

					if (that.onload instanceof Function) {
						that.onload(false);
						that.onload = null;
					}

				};

				buffer.addEventListener('ended', function() {
					that.isIdle = true;
					that.stop();
				}, true);

				buffer.autobuffer = true;
				buffer.preload    = true;


				let path = lychee.environment.resolve(url + '.' + type);
				if (path.substr(0, 13) === '/opt/lycheejs' && _protocol !== null) {
					buffer.src = _protocol + '://' + path;
				} else {
					buffer.src = path;
				}


				buffer.load();
				buffer.onload();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

				if (this.buffer.currentTime === 0) {

					let p = this.buffer.play();
					if (typeof p === 'object' && typeof p.catch === 'function') {
						p.catch(function(err) {});
					}

					this.isIdle = false;

				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {

				let p = this.buffer.play();
				if (typeof p === 'object' && typeof p.catch === 'function') {
					p.catch(function(err) {});
				}

				this.isIdle = false;

			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};



	/*
	 * TEXTURE IMPLEMENTATION
	 */

	let   _TEXTURE_ID    = 0;
	const _TEXTURE_CACHE = {};

	const _clone_texture = function(origin, clone) {

		// Keep reference of Texture ID for OpenGL alike platforms
		clone.id = origin.id;


		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};


	const Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _TEXTURE_ID++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.substr(0, 10) !== 'data:image') {

			if (_TEXTURE_CACHE[url] !== undefined) {
				_clone_texture(_TEXTURE_CACHE[url], this);
			} else {
				_TEXTURE_CACHE[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let that  = this;
				let image = new Image();

				image.onload = function() {
					that.buffer = this;
					that.width  = this.width;
					that.height = this.height;
				};

				image.src   = blob.buffer;
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let buffer;
			let that = this;

			let url = this.url;
			if (url.substr(0, 5) === 'data:') {

				if (url.substr(0, 15) === 'data:image/png;') {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at data:image/png; is NOT power-of-two');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};

					buffer.src = url;

				} else {

					console.warn('bootstrap.js: Invalid Texture at "' + url.substr(0, 15) + '" (No PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			} else {

				if (url.split('.').pop() === 'png') {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at "' + this.url + '" is NOT power-of-two');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};


					let path = lychee.environment.resolve(url);
					if (path.substr(0, 13) === '/opt/lycheejs' && _protocol !== null) {
						buffer.src = _protocol + '://' + path;
					} else {
						buffer.src = path;
					}

				} else {

					console.warn('bootstrap.js: Invalid Texture at "' + this.url + '" (no PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};



	/*
	 * STUFF IMPLEMENTATION
	 */

	const _STUFF_CACHE = {};

	const _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	const _execute_stuff = function(callback, stuff) {

		let type = stuff.url.split('/').pop().split('.').pop();
		if (type === 'js' && stuff.__ignore === false) {

			_filename = stuff.url;


			let tmp = document.createElement('script');

			tmp._filename = stuff.url;
			tmp.async     = true;

			tmp.onload = function() {

				callback.call(stuff, true);

				// XXX: Don't move, it's causing serious bugs in Blink
				document.body.removeChild(this);

			};
			tmp.onerror = function() {

				callback.call(stuff, false);

				// XXX: Don't move, it's causing serious bugs in Blink
				document.body.removeChild(this);

			};


			let path = lychee.environment.resolve(stuff.url);
			if (path.substr(0, 13) === '/opt/lycheejs' && _protocol !== null) {
				tmp.src = _protocol + '://' + path;
			} else {
				tmp.src = path;
			}

			document.body.appendChild(tmp);

		} else {

			callback.call(stuff, true);

		}


		return false;

	};


	const Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_STUFF_CACHE[url] !== undefined) {
				_clone_stuff(_STUFF_CACHE[url], this);
			} else {
				_STUFF_CACHE[url] = this;
			}

		}

	};


	Stuff.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = new Buffer(blob.buffer.substr(blob.buffer.indexOf(',') + 1), 'base64').toString('utf8');
				this.__load = false;
			}

		},

		serialize: function() {

			let blob = {};
			let type = this.url.split('/').pop().split('.').pop();
			let mime = 'application/octet-stream';


			if (type === 'js') {
				mime = 'application/javascript';
			}


			if (this.buffer !== null) {
				blob.buffer = 'data:' + mime + ';base64,' + new Buffer(this.buffer, 'utf8').toString('base64');
			}


			return {
				'constructor': 'Stuff',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				_execute_stuff(function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				}, this);


				return;

			}


			_load_asset({
				url: this.url
			}, function(raw) {

				if (raw !== null) {
					this.buffer = raw;
				} else {
					this.buffer = '';
				}


				_execute_stuff(function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				}, this);

			}, this);

		}

	};



	/*
	 * FEATURES
	 */

	const _ELEMENT = {
		id:    '',
		style: {
			transform: ''
		}
	};

	const _FEATURES = {

		innerWidth:  1337,
		innerHeight: 1337,

		CanvasRenderingContext2D: function() {},
		FileReader:               function() {},
		Storage:                  function() {},
		WebSocket:                function() {},
		XMLHttpRequest:           function() {},

		addEventListener:      function() {},
		clearInterval:         function() {},
		clearTimeout:          function() {},
		requestAnimationFrame: function() {},
		setInterval:           function() {},
		setTimeout:            function() {},

		document: {
			createElement: function() {
				return _ELEMENT;
			},
			querySelectorAll: function() {
				return _ELEMENT;
			},
			body: {
				appendChild: function() {}
			}
		},

		location: {
			href: 'file:///tmp/index.html'
		},

		localStorage: {
		},

		sessionStorage: {
		}

	};

	_FEATURES.FileReader.prototype.readAsDataURL = function() {};


	Object.defineProperty(lychee.Environment, '__FEATURES', {

		get: function() {
			return _FEATURES;
		},

		set: function(value) {
			return false;
		}

	});



	/*
	 * EXPORTS
	 */

	global.Buffer  = Buffer;
	global.Config  = Config;
	global.Font    = Font;
	global.Music   = Music;
	global.Sound   = Sound;
	global.Texture = Texture;
	global.Stuff   = Stuff;


	Object.defineProperty(lychee.Environment, '__FILENAME', {

		get: function() {

			if (document.currentScript) {
				return document.currentScript._filename;
			} else if (_filename !== null) {
				return _filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});

})(this.lychee, this);


(function(lychee, global) {

	let   _filename = null;
	const _Buffer   = require('buffer').Buffer;



	/*
	 * FEATURE DETECTION
	 */

	(function(location, selfpath) {

		let origin = location.origin || '';
		let cwd    = (location.pathname || '');
		let proto  = origin.split(':')[0];


		// Hint: CDNs might have no proper redirect to index.html
		if (/\.(htm|html)$/g.test(cwd.split('/').pop()) === true) {
			cwd = cwd.split('/').slice(0, -1).join('/');
		}


		if (/^(http|https)$/g.test(proto)) {

			// Hint: The harvester (HTTP server) understands
			// /projects/* and /libraries/* requests.

			lychee.ROOT.lychee = '';


			if (cwd !== '') {
				lychee.ROOT.project = cwd === '/' ? '' : cwd;
			}

		} else if (/^(app|file|chrome-extension)$/g.test(proto)) {

			let tmp1 = selfpath.indexOf('/libraries/lychee');
			let tmp2 = selfpath.indexOf('://');

			if (tmp1 !== -1 && tmp2 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1).substr(tmp2 + 3);
			} else if (tmp1 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1);
			}


			if (typeof process !== 'undefined') {
				cwd      = process.cwd() || '';
				selfpath = cwd.split('/').slice(0, -1).join('/');
			}


			let tmp3 = selfpath.split('/').slice(0, 3).join('/');
			if (tmp3.substr(0, 13) === '/opt/lycheejs') {
				lychee.ROOT.lychee = tmp3;
			}


			if (cwd !== '') {
				lychee.ROOT.project = cwd;
			}

		}

	})(global.location || {}, (document.currentScript || {}).src || '');


	Buffer.isBuffer = function(buffer) {

		if (buffer instanceof Buffer) {
			return true;
		} else if (buffer instanceof _Buffer) {
			return true;
		}

		return false;

	};



	/*
	 * FEATURES
	 */

	// XXX: This is an incremental platform of 'html'

	const _FEATURES = {

		require: function(id) {

			if (id === 'child_process') return {};
			if (id === 'fs')            return {};
			if (id === 'http')          return {};
			if (id === 'https')         return {};
			if (id === 'net')           return {};
			if (id === 'path')          return {};


			throw new Error('Cannot find module \'' + id + '\'');

		}

	};

	Object.assign(lychee.Environment.__FEATURES, _FEATURES);

})(this.lychee, this);


lychee.define('Input').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.addEventListener === 'function') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _Emitter   = lychee.import('lychee.event.Emitter');
	const _INSTANCES = [];



	/*
	 * EVENTS
	 */

	let _mouseactive = false;
	let _wheelactive = Date.now();

	const _listeners = {

		keydown: function(event) {

			let handled = false;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				handled = _process_key.call(_INSTANCES[i], event.keyCode, event.ctrlKey, event.altKey, event.shiftKey) || handled;
			}


			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		touchstart: function(event) {

			let handled = false;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (let t = 0, tl = event.touches.length; t < tl; t++) {
						handled = _process_touch.call(_INSTANCES[i], t, event.touches[t].pageX, event.touches[t].pageY) || handled;
					}

				} else {
					handled = _process_touch.call(_INSTANCES[i], 0, event.pageX, event.pageY) || handled;
				}

			}


			// Prevent scrolling and swiping behaviour
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		touchmove: function(event) {

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (let t = 0, tl = event.touches.length; t < tl; t++) {
						_process_swipe.call(_INSTANCES[i], t, 'move', event.touches[t].pageX, event.touches[t].pageY);
					}

				} else {
					_process_swipe.call(_INSTANCES[i], 0, 'move', event.pageX, event.pageY);
				}

			}

		},

		touchend: function(event) {

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {

				if (event.touches && event.touches.length) {

					for (let t = 0, tl = event.touches.length; t < tl; t++) {
						_process_swipe.call(_INSTANCES[i], t, 'end', event.touches[t].pageX, event.touches[t].pageY);
					}

				} else {
					_process_swipe.call(_INSTANCES[i], 0, 'end', event.pageX, event.pageY);
				}

			}

		},

		mousestart: function(event) {

			_mouseactive = true;


			let handled = false;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				handled = _process_touch.call(_INSTANCES[i], 0, event.pageX, event.pageY) || handled;
			}


			// Prevent drag of canvas as image
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		mousemove: function(event) {

			if (_mouseactive === false) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}


			let handled = false;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				handled = _process_swipe.call(_INSTANCES[i], 0, 'move', event.pageX, event.pageY) || handled;
			}


			// Prevent selection of canvas as content
			if (handled === true) {
				event.preventDefault();
				event.stopPropagation();
			}

		},

		mouseend: function(event) {

			if (_mouseactive === false) return;

			_mouseactive = false;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_swipe.call(_INSTANCES[i], 0, 'end', event.pageX, event.pageY);
			}

		},

		mousewheel: function(event) {

			let time = Date.now();
			if (time < _wheelactive + 100) {
				_wheelactive = time;
				return;
			}

			_wheelactive = time;

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_scroll.call(_INSTANCES[i], 0, event.pageX, event.pageY, event.wheelDeltaX, event.wheelDeltaY);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		let keyboard = 'onkeydown' in global;
		let touch    = 'ontouchstart' in global;
		let mouse    = 'onmousedown' in global;


		if (typeof global.addEventListener === 'function') {

			if (keyboard) {
				global.addEventListener('keydown',    _listeners.keydown,    true);
			}

			if (touch) {

				global.addEventListener('touchstart', _listeners.touchstart, true);
				global.addEventListener('touchmove',  _listeners.touchmove,  true);
				global.addEventListener('touchend',   _listeners.touchend,   true);

			} else if (mouse) {

				global.addEventListener('mousedown',  _listeners.mousestart, true);
				global.addEventListener('mousemove',  _listeners.mousemove,  true);
				global.addEventListener('mouseup',    _listeners.mouseend,   true);
				global.addEventListener('mouseout',   _listeners.mouseend,   true);
				global.addEventListener('mousewheel', _listeners.mousewheel, true);

			}

		}


		if (lychee.debug === true) {

			let methods = [];

			if (keyboard) methods.push('Keyboard');
			if (touch)    methods.push('Touch');
			if (mouse)    methods.push('Mouse');

			if (methods.length === 0) {
				console.error('lychee.Input: Supported methods are NONE');
			} else {
				console.info('lychee.Input: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	const _KEYMAP = {

		 8:  'backspace',
		 9:  'tab',
		13:  'enter',
		16:  'shift',
		17:  'ctrl',
		18:  'alt',
		19:  'pause',
//		20:  'capslock',

		27:  'escape',
		32:  'space',
		33:  'page-up',
		34:  'page-down',
		35:  'end',
		36:  'home',

		37:  'arrow-left',
		38:  'arrow-up',
		39:  'arrow-right',
		40:  'arrow-down',

		45:  'insert',
		46:  'delete',

		65:  'a',
		66:  'b',
		67:  'c',
		68:  'd',
		69:  'e',
		70:  'f',
		71:  'g',
		72:  'h',
		73:  'i',
		74:  'j',
		75:  'k',
		76:  'l',
		77:  'm',
		78:  'n',
		79:  'o',
		80:  'p',
		81:  'q',
		82:  'r',
		83:  's',
		84:  't',
		85:  'u',
		86:  'v',
		87:  'w',
		88:  'x',
		89:  'y',
		90:  'z',

		96:  '0',
		97:  '1',
		98:  '2',
		99:  '3',
		100: '4',
		101: '5',
		102: '6',
		103: '7',
		104: '8',
		105: '9',
		106: '*',
		107: '+',
		109: '-',
		110: '.',
		111: '/',

		112: 'f1',
		113: 'f2',
		114: 'f3',
		115: 'f4',
		116: 'f5',
		117: 'f6',
		118: 'f7',
		119: 'f8',
		120: 'f9',
		121: 'f10',
		122: 'f11',
		123: 'f12'

	};

	const _SPECIALMAP = {

		48:  [ '0', ')' ],
		49:  [ '1', '!' ],
		50:  [ '2', '@' ],
		51:  [ '3', '#' ],
		52:  [ '4', '$' ],
		53:  [ '5', '%' ],
		54:  [ '6', '^' ],
		55:  [ '7', '&' ],
		56:  [ '8', '*' ],
		57:  [ '9', '(' ],

		186: [ ';', ':' ],
		187: [ '=', '+' ],
		188: [ ',', '<' ],
		189: [ '-', '_' ],
		190: [ '.', '>' ],
		191: [ '/', '?' ],
		192: [ '`', '~' ],

		219: [ '[',  '{' ],
		220: [ '\\', '|' ],
		221: [ ']',  '}' ],
		222: [ '\'', '"' ]

	};

	const _process_key = function(code, ctrl, alt, shift) {

		if (this.key === false) {
			return false;
		}


		ctrl  =  ctrl === true;
		alt   =   alt === true;
		shift = shift === true;


		if (_KEYMAP[code] === undefined && _SPECIALMAP[code] === undefined) {

			return false;

		} else if (this.keymodifier === false) {

			if (code === 16 && shift === true) {
				return true;
			}

			if (code === 17 && ctrl === true) {
				return true;
			}

			if (code === 18 && alt === true) {
				return true;
			}

		}


		let key     = null;
		let name    = null;
		let tmp     = null;
		let handled = false;
		let delta   = Date.now() - this.__clock.key;

		if (delta < this.delay) {
			return true;
		} else {
			this.__clock.key = Date.now();
		}


		// 0. Computation of Special Characters
		if (_SPECIALMAP[code] !== undefined) {

			tmp  = _SPECIALMAP[code];
			key  = shift === true ? tmp[1] : tmp[0];
			name = '';

			if (ctrl  === true) name += 'ctrl-';
			if (alt   === true) name += 'alt-';
			if (shift === true) name += 'shift-';

			name += tmp[0];

		// 0. Computation of Normal Characters
		} else if (_KEYMAP[code] !== undefined) {

			key  = _KEYMAP[code];
			name = '';

			if (ctrl  === true && key !== 'ctrl')  name += 'ctrl-';
			if (alt   === true && key !== 'alt')   name += 'alt-';
			if (shift === true && key !== 'shift') name += 'shift-';


			if (shift === true && key !== 'ctrl' && key !== 'alt' && key !== 'shift') {

				tmp = String.fromCharCode(code);
				key = tmp.trim() !== '' ? tmp : key;

			}


			name += key.toLowerCase();

		}


		// 1. Event API
		if (key !== null) {

			// bind('key') and bind('ctrl-a');
			// bind('!')   and bind('shift-1');

			handled = this.trigger('key', [ key, name, delta ]) || handled;
			handled = this.trigger(name,  [ delta ])            || handled;

		}


		return handled;

	};

	const _process_scroll = function(id, x, y, dx, dy) {

		if (this.scroll === false) {
			return false;
		}


		let direction = null;
		let position  = { x: x, y: y };
		let handled   = false;
		let delta     = Date.now() - this.__clock.scroll;

		if (delta < this.delay) {
			return true;
		} else {
			this.__clock.scroll = Date.now();
		}


		// 0. Computation
		if (Math.abs(dx) > Math.abs(dy)) {
			direction = dx < 0 ? 'right' : 'left';
		} else {
			direction = dy < 0 ? 'down'  : 'up';
		}


		// 1. Event API
		if (direction !== null) {

			handled = this.trigger('scroll', [ id, direction, position, delta ]) || handled;

		}


		return handled;

	};

	let _process_swipe = function(id, state, x, y) {

		if (this.swipe === false) {
			return false;
		}


		let position = { x: x, y: y };
		let swipe    = { x: 0, y: 0 };
		let handled  = false;
		let delta    = Date.now() - this.__clock.swipe;

		if (delta < this.delay) {
			return true;
		} else {
			this.__clock.swipe = Date.now();
		}


		// 0. Computation of Swipe
		if (this.__swipes[id] !== null) {

			// FIX for touchend events
			if (state === 'end' && x === 0 && y === 0) {
				position.x = this.__swipes[id].x;
				position.y = this.__swipes[id].y;
			}

			swipe.x = x - this.__swipes[id].x;
			swipe.y = y - this.__swipes[id].y;

		}


		// 1. Event API
		if (state === 'start') {

			handled = this.trigger(
				'swipe',
				[ id, 'start', position, delta, swipe ]
			) || handled;

			this.__swipes[id] = {
				x: x, y: y
			};

		} else if (state === 'move') {

			handled = this.trigger(
				'swipe',
				[ id, 'move', position, delta, swipe ]
			) || handled;

		} else if (state === 'end') {

			handled = this.trigger(
				'swipe',
				[ id, 'end', position, delta, swipe ]
			) || handled;

			this.__swipes[id] = null;

		}


		return handled;

	};

	const _process_touch = function(id, x, y) {

		if (this.touch === false && this.swipe === true) {

			if (this.__swipes[id] === null) {
				_process_swipe.call(this, id, 'start', x, y);
			}

			return true;

		} else if (this.touch === false) {

			return false;

		}


		let position = { x: x, y: y };
		let handled  = false;
		let delta    = Date.now() - this.__clock.touch;

		if (delta < this.delay) {
			return true;
		} else {
			this.__clock.touch = Date.now();
		}


		// 1. Event API
		handled = this.trigger('touch', [ id, position, delta ]) || handled;


		// 1. Event API: Swipe only for tracked Touches
		if (this.__swipes[id] === null) {
			handled = _process_swipe.call(this, id, 'start', x, y) || handled;
		}


		return handled;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.delay       = 0;
		this.key         = false;
		this.keymodifier = false;
		this.touch       = false;
		this.scroll      = false;
		this.swipe       = false;

		this.__clock   = {
			key:    Date.now(),
			scroll: Date.now(),
			swipe:  Date.now(),
			touch:  Date.now()
		};
		this.__swipes  = {
			0: null, 1: null,
			2: null, 3: null,
			4: null, 5: null,
			6: null, 7: null,
			8: null, 9: null
		};


		this.setDelay(settings.delay);
		this.setKey(settings.key);
		this.setKeyModifier(settings.keymodifier);
		this.setScroll(settings.scroll);
		this.setSwipe(settings.swipe);
		this.setTouch(settings.touch);


		_Emitter.call(this);

		_INSTANCES.push(this);

		settings = null;

	};


	Composite.prototype = {

		destroy: function() {

			let found = false;

			for (let i = 0, il = _INSTANCES.length; i < il; i++) {

				if (_INSTANCES[i] === this) {
					_INSTANCES.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Input';

			let settings = {};


			if (this.delay !== 0)           settings.delay       = this.delay;
			if (this.key !== false)         settings.key         = this.key;
			if (this.keymodifier !== false) settings.keymodifier = this.keymodifier;
			if (this.touch !== false)       settings.touch       = this.touch;
			if (this.swipe !== false)       settings.swipe       = this.swipe;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setDelay: function(delay) {

			delay = typeof delay === 'number' ? delay : null;


			if (delay !== null) {

				this.delay = delay;

				return true;

			}


			return false;

		},

		setKey: function(key) {

			if (key === true || key === false) {

				this.key = key;

				return true;

			}


			return false;

		},

		setKeyModifier: function(keymodifier) {

			if (keymodifier === true || keymodifier === false) {

				this.keymodifier = keymodifier;

				return true;

			}


			return false;

		},

		setTouch: function(touch) {

			if (touch === true || touch === false) {

				this.touch = touch;

				return true;

			}


			return false;

		},

		setScroll: function(scroll) {

			if (scroll === true || scroll === false) {

				this.scroll = scroll;

				return true;

			}


			return false;

		},

		setSwipe: function(swipe) {

			if (swipe === true || swipe === false) {

				this.swipe = swipe;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Renderer').tags({
	platform: 'html'
}).supports(function(lychee, global) {

	/*
	 * XXX: typeof CanvasRenderingContext2D is:
	 * > function in Chrome, Firefox, IE10
	 * > object in Safari, Safari Mobile
	 */


	if (
		typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.CanvasRenderingContext2D !== 'undefined'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _PI2  = Math.PI * 2;
	let   _id   = 0;
	let   _body = null;



	/*
	 * FEATURE DETECTION
	 */

	(function(global) {

		if (typeof global.document !== 'undefined') {

			if (typeof global.document.body !== 'undefined') {
				_body = global.document.body;
			}

		}

	})(global);



	/*
	 * HELPERS
	 */

	const _Buffer = function(width, height) {

		this.width  = typeof width === 'number'  ? width  : 1;
		this.height = typeof height === 'number' ? height : 1;

		this.__buffer = global.document.createElement('canvas');
		this.__ctx    = this.__buffer.getContext('2d');


		this.resize(this.width, this.height);

	};

	_Buffer.prototype = {

		clear: function() {

			this.__ctx.clearRect(0, 0, this.width, this.height);

		},

		resize: function(width, height) {

			this.width  = width;
			this.height = height;

			this.__buffer.width  = this.width;
			this.__buffer.height = this.height;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.alpha      = 1.0;
		this.background = '#000000';
		this.id         = 'lychee-Renderer-' + _id++;
		this.width      = null;
		this.height     = null;
		this.offset     = { x: 0, y: 0 };

		this.__canvas           = global.document.createElement('canvas');
		this.__canvas.className = 'lychee-Renderer';
		this.__ctx              = this.__canvas.getContext('2d');

		if (_body !== null) {
			_body.appendChild(this.__canvas);
		}


		this.setAlpha(settings.alpha);
		this.setBackground(settings.background);
		this.setId(settings.id);
		this.setWidth(settings.width);
		this.setHeight(settings.height);


		settings = null;

	};


	Composite.prototype = {

		destroy: function() {

			let canvas = this.__canvas;
			if (canvas.parentNode !== null) {
				canvas.parentNode.removeChild(canvas);
			}

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let settings = {};


			if (this.alpha !== 1.0)                           settings.alpha      = this.alpha;
			if (this.background !== '#000000')                settings.background = this.background;
			if (this.id.substr(0, 16) !== 'lychee-Renderer-') settings.id         = this.id;
			if (this.width !== null)                          settings.width      = this.width;
			if (this.height !== null)                         settings.height     = this.height;


			return {
				'constructor': 'lychee.Renderer',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * SETTERS AND GETTERS
		 */

		setAlpha: function(alpha) {

			alpha = typeof alpha === 'number' ? alpha : null;


			if (alpha !== null) {

				if (alpha >= 0 && alpha <= 1) {
					this.alpha = alpha;
				}

			}

		},

		setBackground: function(color) {

			color = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : null;


			if (color !== null) {
				this.background = color;
				this.__canvas.style.backgroundColor = color;
			}

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {
				this.id = id;
				this.__canvas.id = id;
			}

		},

		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {
				this.width = width;
			} else {
				this.width = global.innerWidth;
			}


			this.__canvas.width       = this.width;
			this.__canvas.style.width = this.width + 'px';
			this.offset.x             = this.__canvas.getBoundingClientRect().left;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {
				this.height = height;
			} else {
				this.height = global.innerHeight;
			}


			this.__canvas.height       = this.height;
			this.__canvas.style.height = this.height + 'px';
			this.offset.y              = this.__canvas.getBoundingClientRect().top;

		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			buffer = buffer instanceof _Buffer ? buffer : null;


			if (buffer !== null) {

				buffer.clear();

			} else {

				let ctx = this.__ctx;

				ctx.fillStyle = this.background;
				ctx.fillRect(0, 0, this.width, this.height);

			}

		},

		flush: function() {

		},

		createBuffer: function(width, height) {
			return new _Buffer(width, height);
		},

		setBuffer: function(buffer) {

			buffer = buffer instanceof _Buffer ? buffer : null;


			if (buffer !== null) {
				this.__ctx = buffer.__ctx;
			} else {
				this.__ctx = this.__canvas.getContext('2d');
			}

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				start * _PI2,
				end   * _PI2
			);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
			} else {
				ctx.fillStyle   = color;
				ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
			}

		},

		drawBuffer: function(x1, y1, buffer, map) {

			buffer = buffer instanceof _Buffer ? buffer : null;
			map    = map instanceof Object     ? map    : null;


			if (buffer !== null) {

				let ctx    = this.__ctx;
				let width  = 0;
				let height = 0;
				let x      = 0;
				let y      = 0;
				let r      = 0;


				ctx.globalAlpha = this.alpha;

				if (map === null) {

					width  = buffer.width;
					height = buffer.height;

					ctx.drawImage(
						buffer.__buffer,
						x,
						y,
						width,
						height,
						x1,
						y1,
						width,
						height
					);

				} else {

					width  = map.w;
					height = map.h;
					x      = map.x;
					y      = map.y;
					r      = map.r || 0;

					if (r === 0) {

						ctx.drawImage(
							buffer.__buffer,
							x,
							y,
							width,
							height,
							x1,
							y1,
							width,
							height
						);

					} else {

						let cos = Math.cos(r * Math.PI / 180);
						let sin = Math.sin(r * Math.PI / 180);

						ctx.setTransform(
							cos,
							sin,
							-sin,
							cos,
							x1,
							y1
						);

						ctx.drawImage(
							buffer.__buffer,
							x,
							y,
							width,
							height,
							-1 / 2 * width,
							-1 / 2 * height,
							width,
							height
						);

						ctx.setTransform(
							1,
							0,
							0,
							1,
							0,
							0
						);

					}

				}

			}

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();

			ctx.arc(
				x,
				y,
				radius,
				0,
				_PI2
			);


			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			color     = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);

			ctx.lineWidth   = lineWidth;
			ctx.strokeStyle = color;
			ctx.stroke();

			ctx.closePath();

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;


			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x1, y1);

			if (background === false) {
				ctx.lineWidth   = lineWidth;
				ctx.strokeStyle = color;
				ctx.stroke();
			} else {
				ctx.fillStyle   = color;
				ctx.fill();
			}

			ctx.closePath();

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

			let l = arguments.length;

			if (points > 3) {

				let optargs = l - (points * 2) - 1;
				let color, background, lineWidth;

				if (optargs === 3) {

					color      = arguments[l - 3];
					background = arguments[l - 2];
					lineWidth  = arguments[l - 1];

				} else if (optargs === 2) {

					color      = arguments[l - 2];
					background = arguments[l - 1];

				} else if (optargs === 1) {

					color      = arguments[l - 1];

				}


				color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
				background = background === true;
				lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


				let ctx = this.__ctx;


				ctx.globalAlpha = this.alpha;
				ctx.beginPath();
				ctx.moveTo(x1, y1);

				for (let p = 1; p < points; p++) {

					ctx.lineTo(
						arguments[1 + p * 2],
						arguments[1 + p * 2 + 1]
					);

				}

				ctx.lineTo(x1, y1);

				if (background === false) {
					ctx.lineWidth   = lineWidth;
					ctx.strokeStyle = color;
					ctx.stroke();
				} else {
					ctx.fillStyle   = color;
					ctx.fill();
				}

				ctx.closePath();

			}

		},

		drawSprite: function(x1, y1, texture, map) {

			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;


			if (texture !== null && texture.buffer !== null) {

				let ctx    = this.__ctx;
				let width  = 0;
				let height = 0;
				let x      = 0;
				let y      = 0;
				let r      = 0;


				ctx.globalAlpha = this.alpha;

				if (map === null) {

					width  = texture.width;
					height = texture.height;

					ctx.drawImage(
						texture.buffer,
						x,
						y,
						width,
						height,
						x1,
						y1,
						width,
						height
					);

				} else {

					width  = map.w;
					height = map.h;
					x      = map.x;
					y      = map.y;
					r      = map.r || 0;

					if (r === 0) {

						ctx.drawImage(
							texture.buffer,
							x,
							y,
							width,
							height,
							x1,
							y1,
							width,
							height
						);

					} else {

						let cos = Math.cos(r * Math.PI / 180);
						let sin = Math.sin(r * Math.PI / 180);

						ctx.setTransform(
							cos,
							sin,
							-sin,
							cos,
							x1,
							y1
						);

						ctx.drawImage(
							texture.buffer,
							x,
							y,
							width,
							height,
							-1 / 2 * width,
							-1 / 2 * height,
							width,
							height
						);

						ctx.setTransform(
							1,
							0,
							0,
							1,
							0,
							0
						);

					}

				}

			}

		},

		drawText: function(x1, y1, text, font, center) {

			font   = font instanceof Font ? font : null;
			center = center === true;


			if (font !== null) {

				if (center === true) {

					let dim = font.measure(text);

					x1 -= dim.realwidth / 2;
					y1 -= (dim.realheight - font.baseline) / 2;

				}


				y1 -= font.baseline / 2;


				let margin  = 0;
				let texture = font.texture;
				if (texture !== null && texture.buffer !== null) {

					let ctx = this.__ctx;


					ctx.globalAlpha = this.alpha;

					for (let t = 0, l = text.length; t < l; t++) {

						let chr = font.measure(text[t]);

						ctx.drawImage(
							texture.buffer,
							chr.x,
							chr.y,
							chr.width,
							chr.height,
							x1 + margin - font.spacing,
							y1,
							chr.width,
							chr.height
						);

						margin += chr.realwidth + font.kerning;

					}

				}

			}

		}

	};


	return Composite;

});


lychee.define('Stash').tags({
	platform: 'html-nwjs'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	let   _id         = 0;
	const _Emitter    = lychee.import('lychee.event.Emitter');
	const _PERSISTENT = {
		data: {},
		read: function() {
			return null;
		},
		write: function(id, asset) {
			return false;
		}
	};
	const _TEMPORARY  = {
		data: {},
		read: function() {

			if (Object.keys(this.data).length > 0) {
				return this.data;
			}


			return null;

		},
		write: function(id, asset) {

			if (asset !== null) {
				this.data[id] = asset;
			} else {
				delete this.data[id];
			}

			return true;

		}
	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		const _ENCODING = {
			'Config':  'utf8',
			'Font':    'utf8',
			'Music':   'binary',
			'Sound':   'binary',
			'Texture': 'binary',
			'Stuff':   'utf8'
		};


		const _fs      = global.require('fs');
		const _path    = global.require('path');
		const _mkdir_p = function(path, mode) {

			if (mode === undefined) {
				mode = 0o777 & (~process.umask());
			}


			let is_directory = false;

			try {

				is_directory = _fs.lstatSync(path).isDirectory();

			} catch (err) {

				if (err.code === 'ENOENT') {

					if (_mkdir_p(_path.dirname(path), mode) === true) {

						try {
							_fs.mkdirSync(path, mode);
						} catch (err) {
						}

					}

					try {
						is_directory = _fs.lstatSync(path).isDirectory();
					} catch (err) {
					}

				}

			}


			return is_directory;

		};


		let unlink = 'unlinkSync' in _fs;
		let write  = 'writeFileSync' in _fs;
		if (unlink === true && write === true) {

			_PERSISTENT.write = function(id, asset) {

				let result = false;


				let path = lychee.environment.resolve(id);
				if (path.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {

					if (asset !== null) {

						let dir = path.split('/').slice(0, -1).join('/');
						if (dir.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {
							_mkdir_p(dir);
						}


						let data = lychee.serialize(asset);
						if (data !== null && data.blob !== null && typeof data.blob.buffer === 'string') {

							let encoding = _ENCODING[data.constructor] || _ENCODING['Stuff'];
							let index    = data.blob.buffer.indexOf('base64,') + 7;
							if (index > 7) {

								let buffer = new Buffer(data.blob.buffer.substr(index, data.blob.buffer.length - index), 'base64');

								try {
									_fs.writeFileSync(path, buffer, encoding);
									result = true;
								} catch (err) {
									result = false;
								}

							}

						}

					} else {

						try {
							_fs.unlinkSync(path);
							result = true;
						} catch (err) {
							result = false;
						}

					}

				}


				return result;

			};

		}


		if (lychee.debug === true) {

			let methods = [];

			if (write && unlink) methods.push('Persistent');
			if (_TEMPORARY)      methods.push('Temporary');


			if (methods.length === 0) {
				console.error('lychee.Stash: Supported methods are NONE');
			} else {
				console.info('lychee.Stash: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	const _validate_asset = function(asset) {

		if (asset instanceof Object && typeof asset.serialize === 'function') {
			return true;
		}

		return false;

	};

	const _on_batch_remove = function(stash, others) {

		let keys = Object.keys(others);

		for (let k = 0, kl = keys.length; k < kl; k++) {

			let key   = keys[k];
			let index = this.load.indexOf(key);
			if (index !== -1) {

				if (this.ready.indexOf(key) === -1) {
					this.ready.push(null);
					this.load.splice(index, 1);
				}

			}

		}


		if (this.load.length === 0) {
			stash.trigger('batch', [ 'remove', this.ready ]);
			stash.unbind('sync', _on_batch_remove);
		}

	};

	const _on_batch_write = function(stash, others) {

		let keys = Object.keys(others);

		for (let k = 0, kl = keys.length; k < kl; k++) {

			let key   = keys[k];
			let index = this.load.indexOf(key);
			if (index !== -1) {

				if (this.ready.indexOf(key) === -1) {
					this.ready.push(others[key]);
					this.load.splice(index, 1);
				}

			}

		}


		if (this.load.length === 0) {
			stash.trigger('batch', [ 'write', this.ready ]);
			stash.unbind('sync', _on_batch_write);
		}

	};

	const _read_stash = function(silent) {

		silent = silent === true;


		let blob = null;


		let type = this.type;
		if (type === Composite.TYPE.persistent) {

			blob = _PERSISTENT.read();

		} else if (type === Composite.TYPE.temporary) {

			blob = _TEMPORARY.read();

		}


		if (blob !== null) {

			if (Object.keys(this.__assets).length !== Object.keys(blob).length) {

				this.__assets = {};

				for (let id in blob) {
					this.__assets[id] = blob[id];
				}


				if (silent === false) {
					this.trigger('sync', [ this.__assets ]);
				}

			}


			return true;

		}


		return false;

	};

	const _write_stash = function(silent) {

		silent = silent === true;


		let operations = this.__operations;
		let filtered   = {};

		if (operations.length !== 0) {

			while (operations.length > 0) {

				let operation = operations.shift();
				if (operation.type === 'update') {

					filtered[operation.id] = operation.asset;

					if (this.__assets[operation.id] !== operation.asset) {
						this.__assets[operation.id] = operation.asset;
					}

				} else if (operation.type === 'remove') {

					filtered[operation.id] = null;

					if (this.__assets[operation.id] !== null) {
						this.__assets[operation.id] = null;
					}

				}

			}


			let type = this.type;
			if (type === Composite.TYPE.persistent) {

				for (let id in filtered) {
					_PERSISTENT.write(id, filtered[id]);
				}

			} else if (type === Composite.TYPE.temporary) {

				for (let id in filtered) {
					_TEMPORARY.write(id, filtered[id]);
				}

			}


			if (silent === false) {
				this.trigger('sync', [ this.__assets ]);
			}


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.id   = 'lychee-Stash-' + _id++;
		this.type = Composite.TYPE.persistent;


		this.__assets     = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setType(settings.type);


		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		_read_stash.call(this);


		settings = null;

	};


	Composite.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			let result = false;


			if (Object.keys(this.__assets).length > 0) {

				this.__operations.push({
					type: 'sync'
				});

			}


			if (this.__operations.length > 0) {
				result = _write_stash.call(this, silent);
			} else {
				result = _read_stash.call(this, silent);
			}


			return result;

		},

		deserialize: function(blob) {

			if (blob.assets instanceof Object) {

				this.__assets = {};

				for (let id in blob.assets) {
					this.__assets[id] = lychee.deserialize(blob.assets[id]);
				}

			}

		},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Stash';

			let settings = {};
			let blob     = (data['blob'] || {});


			if (this.id.substr(0, 13) !== 'lychee-Stash-') settings.id   = this.id;
			if (this.type !== Composite.TYPE.persistent)   settings.type = this.type;


			if (Object.keys(this.__assets).length > 0) {

				blob.assets = {};

				for (let id in this.__assets) {
					blob.assets[id] = lychee.serialize(this.__assets[id]);
				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		batch: function(action, ids, assets) {

			action = typeof action === 'string' ? action : null;
			ids    = ids instanceof Array       ? ids    : null;
			assets = assets instanceof Array    ? assets : null;


			if (action !== null) {

				let cache  = {
					load:  [].slice.call(ids),
					ready: []
				};


				let result = true;
				let that   = this;

				if (action === 'read') {

					for (let i = 0, il = ids.length; i < il; i++) {

						let asset = this.read(ids[i]);
						if (asset !== null) {

							asset.onload = function(result) {

								let index = cache.load.indexOf(this.url);
								if (index !== -1) {
									cache.ready.push(this);
									cache.load.splice(index, 1);
								}

								if (cache.load.length === 0) {
									that.trigger('batch', [ 'read', cache.ready ]);
								}

							};

							asset.load();

						} else {

							result = false;

						}

					}


					return result;

				} else if (action === 'remove') {

					this.bind('#sync', _on_batch_remove, cache);

					for (let i = 0, il = ids.length; i < il; i++) {

						if (this.remove(ids[i]) === false) {
							result = false;
						}

					}

					if (result === false) {
						this.unbind('sync', _on_batch_remove);
					}


					return result;

				} else if (action === 'write' && ids.length === assets.length) {

					this.bind('#sync', _on_batch_write, cache);

					for (let i = 0, il = ids.length; i < il; i++) {

						if (this.write(ids[i], assets[i]) === false) {
							result = false;
						}

					}

					if (result === false) {
						this.unbind('sync', _on_batch_write);
					}


					return result;

				}

			}


			return false;

		},

		read: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				let asset = new lychee.Asset(id, null, true);
				if (asset !== null) {

					this.__assets[id] = asset;

					return asset;

				}

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.__operations.push({
					type: 'remove',
					id:   id
				});


				_write_stash.call(this);


				return true;

			}


			return false;

		},

		write: function(id, asset) {

			id    = typeof id === 'string'          ? id    : null;
			asset = _validate_asset(asset) === true ? asset : null;


			if (id !== null && asset !== null) {

				this.__operations.push({
					type:  'update',
					id:    id,
					asset: asset
				});


				_write_stash.call(this);


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Storage').tags({
	platform: 'html-nwjs'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	let   _id         = 0;
	const _Emitter    = lychee.import('lychee.event.Emitter');
	const _JSON       = {
		encode: JSON.stringify,
		decode: JSON.parse
	};
	const _PERSISTENT = {
		data: {},
		read: function() {
			return null;
		},
		write: function() {
			return false;
		}
	};
	const _TEMPORARY  = {
		data: {},
		read: function() {

			if (Object.keys(this.data).length > 0) {
				return this.data;
			}


			return null;

		},
		write: function() {
			return true;
		}
	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		const _fs = global.require('fs');


		let read = 'readFileSync' in _fs;
		if (read === true) {

			_PERSISTENT.read = function() {

				let url = lychee.environment.resolve('./lychee.store');


				let raw = null;
				try {
					raw = _fs.readFileSync(url, 'utf8');
				} catch (err) {
					raw = null;
				}


				let buffer = null;
				try {
					buffer = JSON.parse(raw);
				} catch (err) {
					buffer = null;
				}


				if (buffer !== null) {

					for (let id in buffer) {
						_PERSISTENT.data[id] = buffer[id];
					}


					return true;

				}


				return false;

			};

		}


		let write = 'writeFileSync' in _fs;
		if (write === true) {

			_PERSISTENT.write = function() {

				let buffer = _JSON.encode(_PERSISTENT.data);
				let url    = lychee.environment.resolve('./lychee.store');


				let result = false;
				try {
					result = _fs.writeFileSync(url, buffer, 'utf8');
				} catch (err) {
					result = false;
				}


				return result;

			};

		}


		if (lychee.debug === true) {

			let methods = [];

			if (read && write) methods.push('Persistent');
			if (_TEMPORARY)    methods.push('Temporary');

			if (methods.length === 0) {
				console.error('lychee.Storage: Supported methods are NONE');
			} else {
				console.info('lychee.Storage: Supported methods are ' + methods.join(', '));
			}

		}


		_PERSISTENT.read();

	})();



	/*
	 * HELPERS
	 */

	const _read_storage = function(silent) {

		silent = silent === true;


		let id   = this.id;
		let blob = null;


		let type = this.type;
		if (type === Composite.TYPE.persistent) {
			blob = _PERSISTENT.data[id] || null;
		} else if (type === Composite.TYPE.temporary) {
			blob = _TEMPORARY.data[id]  || null;
		}


		if (blob !== null) {

			if (this.model === null) {

				if (blob['@model'] instanceof Object) {
					this.model = blob['@model'];
				}

			}


			if (Object.keys(this.__objects).length !== Object.keys(blob['@objects']).length) {

				if (blob['@objects'] instanceof Object) {

					this.__objects = {};

					for (let o in blob['@objects']) {
						this.__objects[o] = blob['@objects'][o];
					}


					if (silent === false) {
						this.trigger('sync', [ this.__objects ]);
					}


					return true;

				}

			}

		}


		return false;

	};

	const _write_storage = function(silent) {

		silent = silent === true;


		let operations = this.__operations;
		if (operations.length > 0) {

			while (operations.length > 0) {

				let operation = operations.shift();
				if (operation.type === 'update') {

					if (this.__objects[operation.id] !== operation.object) {
						this.__objects[operation.id] = operation.object;
					}

				} else if (operation.type === 'remove') {

					if (this.__objects[operation.id] !== undefined) {
						delete this.__objects[operation.id];
					}

				}

			}


			let id   = this.id;
			let blob = {
				'@model':   this.model,
				'@objects': this.__objects
			};


			let type = this.type;
			if (type === Composite.TYPE.persistent) {

				_PERSISTENT.data[id] = blob;
				_PERSISTENT.write();

			} else if (type === Composite.TYPE.temporary) {

				_TEMPORARY.data[id] = blob;

			}


			if (silent === false) {
				this.trigger('sync', [ this.__objects ]);
			}


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.id    = 'lychee-Storage-' + _id++;
		this.model = {};
		this.type  = Composite.TYPE.persistent;


		this.__objects    = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setModel(settings.model);
		this.setType(settings.type);


		_Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_storage.call(this);

	};


	Composite.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			let result = false;


			if (this.__operations.length > 0) {
				result = _write_storage.call(this, silent);
			} else {
				result = _read_storage.call(this, silent);
			}


			return result;

		},

		deserialize: function(blob) {

			if (blob.objects instanceof Object) {

				this.__objects = {};

				for (let o in blob.objects) {

					let object = blob.objects[o];

					if (lychee.interfaceof(this.model, object)) {
						this.__objects[o] = object;
					}

				}

			}

		},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Storage';

			let settings = {};
			let blob     = (data['blob'] || {});


			if (this.id.substr(0, 15) !== 'lychee-Storage-') settings.id    = this.id;
			if (Object.keys(this.model).length !== 0)        settings.model = this.model;
			if (this.type !== Composite.TYPE.persistent)     settings.type  = this.type;


			if (Object.keys(this.__objects).length > 0) {

				blob.objects = {};

				for (let o in this.__objects) {

					let object = this.__objects[o];
					if (object instanceof Object) {
						blob.objects[o] = _JSON.decode(_JSON.encode(object));
					}

				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		create: function() {
			return lychee.assignunlink({}, this.model);
		},

		filter: function(callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			let filtered = [];


			if (callback !== null) {

				for (let o in this.__objects) {

					let object = this.__objects[o];

					if (callback.call(scope, object, o) === true) {
						filtered.push(object);
					}

				}


			}


			return filtered;

		},

		read: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				let object = this.__objects[id] || null;
				if (object !== null) {
					return object;
				}

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				let object = this.__objects[id] || null;
				if (object !== null) {

					this.__operations.push({
						type:   'remove',
						id:     id,
						object: object
					});


					_write_storage.call(this);

					return true;

				}

			}


			return false;

		},

		write: function(id, object) {

			id     = typeof id === 'string'                    ? id     : null;
			object = lychee.diff(this.model, object) === false ? object : null;


			if (id !== null && object !== null) {

				this.__operations.push({
					type:   'update',
					id:     id,
					object: object
				});


				_write_storage.call(this);

				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setModel: function(model) {

			model = model instanceof Object ? model : null;


			if (model !== null) {

				this.model = _JSON.decode(_JSON.encode(model));

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Viewport').tags({
	platform: 'html'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof global.addEventListener === 'function'
		&& typeof global.innerWidth === 'number'
		&& typeof global.innerHeight === 'number'
		&& typeof global.document !== 'undefined'
		&& typeof global.document.querySelectorAll === 'function'
	) {

		return true;

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _Emitter   = lychee.import('lychee.event.Emitter');
	const _CLOCK     = {
		orientationchange: null,
		resize:            0
	};
	const _INSTANCES = [];



	/*
	 * EVENTS
	 */

	let _focusactive   = true;
	let _reshapeactive = false;
	let _reshapewidth  = global.innerWidth;
	let _reshapeheight = global.innerHeight;

	const _reshape_viewport = function() {

		if (_reshapeactive === true || (_reshapewidth === global.innerWidth && _reshapeheight === global.innerHeight)) {
			return false;
		}


		_reshapeactive = true;



		/*
		 * ISSUE in Mobile WebKit:
		 *
		 * An issue occurs if width of viewport is higher than
		 * the width of the viewport of future rotation state.
		 *
		 * This bugfix prevents the viewport to scale higher
		 * than 1.0, even if the meta tag is correctly setup.
		 */

		let elements = global.document.querySelectorAll('.lychee-Renderer');
		for (let e = 0, el = elements.length; e < el; e++) {

			let element = elements[e];

			element.style.width  = '1px';
			element.style.height = '1px';

		}



		/*
		 * ISSUE in Mobile Firefox and Mobile WebKit
		 *
		 * The reflow is too slow for an update, so we have
		 * to lock the heuristic to only be executed once,
		 * waiting for 500ms to let the reflow finish.
		 */

		setTimeout(function() {

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_reshape.call(_INSTANCES[i], global.innerWidth, global.innerHeight);
			}

			_reshapewidth  = global.innerWidth;
			_reshapeheight = global.innerHeight;
			_reshapeactive = false;

		}, 500);

	};

	const _listeners = {

		orientationchange: function() {

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_orientation.call(_INSTANCES[i], global.orientation);
			}

			_CLOCK.orientationchange = Date.now();
			_reshape_viewport();

		},

		resize: function() {

			if (_CLOCK.orientationchange === null || (_CLOCK.orientationchange !== null && _CLOCK.orientationchange > _CLOCK.resize)) {

				_CLOCK.resize = Date.now();
				_reshape_viewport();

			}

		},

		focus: function() {

			if (_focusactive === false) {

				for (let i = 0, l = _INSTANCES.length; i < l; i++) {
					_process_show.call(_INSTANCES[i]);
				}

				_focusactive = true;

			}

		},

		blur: function() {

			if (_focusactive === true) {

				for (let i = 0, l = _INSTANCES.length; i < l; i++) {
					_process_hide.call(_INSTANCES[i]);
				}

				_focusactive = false;

			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	let _enterFullscreen = null;
	let _leaveFullscreen = null;

	(function() {

		let resize      = 'onresize' in global;
		let orientation = 'onorientationchange' in global;
		let focus       = 'onfocus' in global;
		let blur        = 'onblur' in global;


		if (typeof global.addEventListener === 'function') {

			if (resize)      global.addEventListener('resize',            _listeners.resize,            true);
			if (orientation) global.addEventListener('orientationchange', _listeners.orientationchange, true);
			if (focus)       global.addEventListener('focus',             _listeners.focus,             true);
			if (blur)        global.addEventListener('blur',              _listeners.blur,              true);

		}


		if (global.document && global.document.documentElement) {

			let element = global.document.documentElement;

			if (typeof element.requestFullscreen === 'function' && typeof element.exitFullscreen === 'function') {

				_enterFullscreen = function() {
					element.requestFullscreen();
				};

				_leaveFullscreen = function() {
					element.exitFullscreen();
				};

			}


			if (_enterFullscreen === null || _leaveFullscreen === null) {

				let prefixes = [ 'moz', 'ms', 'webkit' ];
				let prefix   = null;

				for (let p = 0, pl = prefixes.length; p < pl; p++) {

					if (typeof element[prefixes[p] + 'RequestFullScreen'] === 'function' && typeof document[prefixes[p] + 'CancelFullScreen'] === 'function') {
						prefix = prefixes[p];
						break;
					}

				}


				if (prefix !== null) {

					_enterFullscreen = function() {
						element[prefix + 'RequestFullScreen']();
					};

					_leaveFullscreen = function() {
						global.document[prefix + 'CancelFullScreen']();
					};

				}

			}

		}


		if (lychee.debug === true) {

			let methods = [];

			if (resize)      methods.push('Resize');
			if (orientation) methods.push('Orientation');
			if (focus)       methods.push('Focus');
			if (blur)        methods.push('Blur');

			if (_enterFullscreen !== null && _leaveFullscreen !== null) {
				methods.push('Fullscreen');
			}

			if (methods.length === 0) {
				console.error('lychee.Viewport: Supported methods are NONE');
			} else {
				console.info('lychee.Viewport: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	const _process_show = function() {

		return this.trigger('show');

	};

	const _process_hide = function() {

		return this.trigger('hide');

	};

	const _process_orientation = function(orientation) {

		orientation = typeof orientation === 'number' ? orientation : null;

		if (orientation !== null) {
			this.__orientation = orientation;
		}

	};

	const _process_reshape = function(width, height) {

		if (width === this.width && height === this.height) {
			return false;
		}


		this.width  = width;
		this.height = height;


		let orientation = null;
		let rotation    = null;



		/*
		 *    TOP
		 *  _______
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * [X][X][X]
		 *
		 *  BOTTOM
		 */

		if (this.__orientation === 0) {

			if (width > height) {

				orientation = 'landscape';
				rotation    = 'landscape';

			} else {

				orientation = 'portrait';
				rotation    = 'portrait';

			}



		/*
		 *  BOTTOM
		 *
		 * [X][X][X]
		 * |       |
		 * |       |
		 * |       |
		 * |       |
		 * |_______|
		 *
		 *    TOP
		 */

		} else if (this.__orientation === 180) {

			if (width > height) {

				orientation = 'landscape';
				rotation    = 'landscape';

			} else {

				orientation = 'portrait';
				rotation    = 'portrait';

			}



		/*
		 *    ____________    B
		 * T |            [x] O
		 * O |            [x] T
		 * P |____________[x] T
		 *                    O
		 *                    M
		 */

		} else if (this.__orientation === 90) {

			if (width > height) {

				orientation = 'portrait';
				rotation    = 'landscape';

			} else {

				orientation = 'landscape';
				rotation    = 'portrait';

			}



		/*
		 * B    ____________
		 * O [x]            | T
		 * T [x]            | O
		 * T [x]____________| P
		 * O
		 * M
		 */

		} else if (this.__orientation === -90) {

			if (width > height) {

				orientation = 'portrait';
				rotation    = 'landscape';

			} else {

				orientation = 'landscape';
				rotation    = 'portrait';

			}

		}


		return this.trigger('reshape', [ orientation, rotation, width, height ]);

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.fullscreen = false;
		this.width      = global.innerWidth;
		this.height     = global.innerHeight;

		this.__orientation = typeof global.orientation === 'number' ? global.orientation : 0;


		_Emitter.call(this);

		_INSTANCES.push(this);


		this.setFullscreen(settings.fullscreen);



		/*
		 * INITIALIZATION
		 */

		setTimeout(function() {

			this.width  = 0;
			this.height = 0;

			_process_reshape.call(this, global.innerWidth, global.innerHeight);

		}.bind(this), 100);


		settings = null;

	};


	Composite.prototype = {

		destroy: function() {

			let found = false;

			for (let i = 0, il = _INSTANCES.length; i < il; i++) {

				if (_INSTANCES[i] === this) {
					_INSTANCES.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Viewport';

			let settings = {};


			if (this.fullscreen !== false) settings.fullscreen = this.fullscreen;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setFullscreen: function(fullscreen) {

			if (fullscreen === true && this.fullscreen === false) {

				if (_enterFullscreen !== null) {

					_enterFullscreen();
					this.fullscreen = true;

					return true;

				}

			} else if (fullscreen === false && this.fullscreen === true) {

				if (_leaveFullscreen !== null) {

					_leaveFullscreen();
					this.fullscreen = false;

					return true;

				}

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.Server').tags({
	platform: 'html-nwjs'
}).requires([
	'lychee.Storage',
	'lychee.codec.JSON',
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('net');
			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _net     = global.require('net');
	const _Emitter = lychee.import('lychee.event.Emitter');
	const _JSON    = lychee.import('lychee.codec.JSON');
	const _Remote  = lychee.import('lychee.net.Remote');
	const _Storage = lychee.import('lychee.Storage');
	const _storage = new _Storage({
		id:    'server',
		type:  _Storage.TYPE.persistent,
		model: {
			id:   '[::ffff]:1337',
			type: 'client',
			host: '::ffff',
			port: 1337
		}
	});



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.codec  = _JSON;
		this.host   = null;
		this.port   = 1337;
		this.remote = _Remote;
		this.type   = Composite.TYPE.WS;


		this.__isConnected = false;
		this.__server      = null;


		this.setCodec(settings.codec);
		this.setHost(settings.host);
		this.setPort(settings.port);
		this.setRemote(settings.remote);
		this.setType(settings.type);


		_Emitter.call(this);

		settings = null;


		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function(remote) {

			let id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;
			let obj = _storage.create();
			if (obj !== null) {

				obj.id   = id;
				obj.type = 'client';
				obj.host = remote.host;
				obj.port = remote.port;

				_storage.write(id, obj);

			}

		}, this);

		this.bind('disconnect', function(remote) {

			let id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;
			let obj = _storage.read(id);
			if (obj !== null) {
				_storage.remove(id);
			}

		}, this);

	};


	Composite.TYPE = {
		WS:   0,
		HTTP: 1,
		TCP:  2
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Server';

			let settings = {};


			if (this.codec !== _JSON)            settings.codec  = lychee.serialize(this.codec);
			if (this.host !== 'localhost')       settings.host   = this.host;
			if (this.port !== 1337)              settings.port   = this.port;
			if (this.remote !== _Remote)         settings.remote = lychee.serialize(this.remote);
			if (this.type !== Composite.TYPE.WS) settings.type   = this.type;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__isConnected === false) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				let that   = this;
				let server = new _net.Server({
					allowHalfOpen:  true,
					pauseOnConnect: true
				});


				server.on('connection', function(socket) {

					let host   = socket.remoteAddress || socket.server._connectionKey.split(':')[1];
					let port   = socket.remotePort    || socket.server._connectionKey.split(':')[2];
					let remote = new that.remote({
						codec: that.codec,
						host:  host,
						port:  port,
						type:  that.type
					});

					that.trigger('preconnect', [ remote ]);

					remote.bind('connect', function() {
						that.trigger('connect', [ this ]);
					});

					remote.bind('disconnect', function() {
						that.trigger('disconnect', [ this ]);
					});


					remote.connect(socket);

				});

				server.on('error', function() {
					this.close();
				});

				server.on('close', function() {
					that.__isConnected = false;
					that.__server      = null;
				});

				server.listen(this.port, this.host);


				this.__server      = server;
				this.__isConnected = true;


				return true;

			}


			return false;

		},

		disconnect: function() {

			let server = this.__server;
			if (server !== null) {
				server.close();
			}


			return true;

		},



		/*
		 * TUNNEL API
		 */

		setCodec: function(codec) {

			codec = lychee.interfaceof(_JSON, codec) ? codec : null;


			if (codec !== null) {

				let oldcodec = this.codec;
				if (oldcodec !== codec) {

					this.codec = codec;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		},

		setHost: function(host) {

			host = typeof host === 'string' ? host : null;


			if (host !== null) {

				this.host = host;

				return true;

			}


			return false;

		},

		setPort: function(port) {

			port = typeof port === 'number' ? (port | 0) : null;


			if (port !== null) {

				this.port = port;

				return true;

			}


			return false;

		},

		setRemote: function(remote) {

			remote = lychee.interfaceof(_Remote, remote) ? remote : null;


			if (remote !== null) {

				let oldremote = this.remote;
				if (oldremote !== remote) {

					this.remote = remote;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				let oldtype = this.type;
				if (oldtype !== type) {

					this.type = type;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.socket.HTTP').tags({
	platform: 'html-nwjs'
}).requires([
	'lychee.net.protocol.HTTP'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('net');

			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _net      = global.require('net');
	const _Emitter  = lychee.import('lychee.event.Emitter');
	const _Protocol = lychee.import('lychee.net.protocol.HTTP');



	/*
	 * HELPERS
	 */

	const _connect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection !== socket) {

			socket.on('data', function(raw) {

				// XXX: nwjs has global scope problems
				// XXX: Internal Buffer is not our global.Buffer interface

				let blob = new Buffer(raw.length);
				for (let b = 0; b < blob.length; b++) {
					blob[b] = raw[b];
				}


				let chunks = protocol.receive(blob);
				if (chunks.length > 0) {

					for (let c = 0, cl = chunks.length; c < cl; c++) {
						that.trigger('receive', [ chunks[c].payload, chunks[c].headers ]);
					}

				}

			});

			socket.on('error', function(err) {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('timeout', function() {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('close', function() {
				that.disconnect();
			});

			socket.on('end', function() {
				that.disconnect();
			});


			that.__connection = socket;
			that.__protocol   = protocol;

			that.trigger('connect');

		}

	};

	const _disconnect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection === socket) {

			socket.removeAllListeners('data');
			socket.removeAllListeners('error');
			socket.removeAllListeners('timeout');
			socket.removeAllListeners('close');
			socket.removeAllListeners('end');

			socket.destroy();
			protocol.close();


			that.__connection = null;
			that.__protocol   = null;

			that.trigger('disconnect');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.__connection = null;
		this.__protocol   = null;


		_Emitter.call(this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.socket.HTTP';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(host, port, connection) {

			host       = typeof host === 'string'       ? host       : null;
			port       = typeof port === 'number'       ? (port | 0) : null;
			connection = typeof connection === 'object' ? connection : null;


			let that     = this;
			// let url      = /:/g.test(host) ? ('http://[' + host + ']:' + port) : ('http://' + host + ':' + port);
			let protocol = null;


			if (host !== null && port !== null) {

				if (connection !== null) {

					protocol = new _Protocol(_Protocol.TYPE.remote);

					connection.allowHalfOpen = true;
					connection.setTimeout(0);
					connection.setNoDelay(true);
					connection.setKeepAlive(true, 0);
					connection.removeAllListeners('timeout');


					_connect_socket.call(that, connection, protocol);

					connection.resume();

				} else {

					protocol   = new _Protocol(_Protocol.TYPE.client);
					connection = new _net.Socket({
						readable: true,
						writable: true
					});


					connection.allowHalfOpen = true;
					connection.setTimeout(0);
					connection.setNoDelay(true);
					connection.setKeepAlive(true, 0);
					connection.removeAllListeners('timeout');


					_connect_socket.call(that, connection, protocol);

					connection.connect({
						host: host,
						port: port
					});

				}

			}

		},

		send: function(payload, headers, binary) {

			payload = payload instanceof Buffer ? payload : null;
			headers = headers instanceof Object ? headers : null;
			binary  = binary === true;


			if (payload !== null) {

				let connection = this.__connection;
				let protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					let chunk = protocol.send(payload, headers, binary);
					let enc   = binary === true ? 'binary' : 'utf8';

					if (chunk !== null) {
						// XXX: nwjs has global scope problems
						// XXX: Internal Buffer is not our global.Buffer interface
						connection.write(chunk.toString(enc), enc);
					}

				}

			}

		},

		disconnect: function() {

			let connection = this.__connection;
			let protocol   = this.__protocol;

			if (connection !== null && protocol !== null) {

				_disconnect_socket.call(this, connection, protocol);


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.socket.WS').tags({
	platform: 'html-nwjs'
}).requires([
	'lychee.crypto.SHA1',
	'lychee.net.protocol.WS'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof global.require === 'function'
		&& typeof global.setInterval === 'function'
	) {

		try {

			global.require('net');

			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const Buffer         = lychee.import('Buffer');
	const _net           = global.require('net');
	const _clearInterval = global.clearInterval;
	const _setInterval   = global.setInterval;
	const _Buffer        = global.require('buffer').Buffer;
	const _Emitter       = lychee.import('lychee.event.Emitter');
	const _Protocol      = lychee.import('lychee.net.protocol.WS');
	const _SHA1          = lychee.import('lychee.crypto.SHA1');



	/*
	 * HELPERS
	 */

	const _connect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection !== socket) {

			socket.on('data', function(raw) {

				// XXX: nwjs has global scope problems
				// XXX: Internal Buffer is not our global.Buffer interface

				let blob = new Buffer(raw.length);
				for (let b = 0; b < blob.length; b++) {
					blob[b] = raw[b];
				}


				let chunks = protocol.receive(blob);
				if (chunks.length > 0) {

					for (let c = 0, cl = chunks.length; c < cl; c++) {

						let chunk = chunks[c];
						if (chunk.payload[0] === 136) {

							that.send(chunk.payload, chunk.headers, true);
							that.disconnect();

							return;

						} else {

							that.trigger('receive', [ chunk.payload, chunk.headers ]);

						}

					}

				}

			});

			socket.on('error', function(err) {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('timeout', function() {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('close', function() {
				that.disconnect();
			});

			socket.on('end', function() {
				that.disconnect();
			});


			that.__connection = socket;
			that.__protocol   = protocol;

			that.trigger('connect');

		}

	};

	const _disconnect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection === socket) {

			socket.removeAllListeners('data');
			socket.removeAllListeners('error');
			socket.removeAllListeners('timeout');
			socket.removeAllListeners('close');
			socket.removeAllListeners('end');

			socket.destroy();
			protocol.close();


			that.__connection = null;
			that.__protocol   = null;

			that.trigger('disconnect');

		}

	};

	const _verify_client = function(headers, nonce) {

		let connection = (headers['connection'] || '').toLowerCase();
		let upgrade    = (headers['upgrade']    || '').toLowerCase();
		let protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {

			let accept = (headers['sec-websocket-accept'] || '');
			let expect = (function(nonce) {

				let sha1 = new _SHA1();
				sha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
				return sha1.digest().toString('base64');

			})(nonce.toString('base64'));


			if (accept === expect) {
				return accept;
			}

		}


		return null;

	};

	const _verify_remote = function(headers) {

		let connection = (headers['connection'] || '').toLowerCase();
		let upgrade    = (headers['upgrade']    || '').toLowerCase();
		let protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {

			let host   = headers['host']   || null;
			let nonce  = headers['sec-websocket-key'] || null;
			let origin = headers['origin'] || null;

			if (host !== null && nonce !== null && origin !== null) {

				let handshake = '';
				let accept    = (function(nonce) {

					let sha1 = new _SHA1();
					sha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
					return sha1.digest().toString('base64');

				})(nonce);


				// HEAD

				handshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\r\n';
				handshake += 'Upgrade: WebSocket\r\n';
				handshake += 'Connection: Upgrade\r\n';

				handshake += 'Sec-WebSocket-Version: '  + '13'       + '\r\n';
				handshake += 'Sec-WebSocket-Origin: '   + origin     + '\r\n';
				handshake += 'Sec-WebSocket-Protocol: ' + 'lycheejs' + '\r\n';
				handshake += 'Sec-WebSocket-Accept: '   + accept     + '\r\n';


				// BODY
				handshake += '\r\n';


				return handshake;

			}

		}


		return null;

	};

	const _upgrade_client = function(host, port, nonce) {

		// let that       = this;
		let handshake  = '';
		let identifier = lychee.ROOT.project;


		if (identifier.substr(0, lychee.ROOT.lychee.length) === lychee.ROOT.lychee) {
			identifier = lychee.ROOT.project.substr(lychee.ROOT.lychee.length + 1);
		}

		for (let n = 0; n < 16; n++) {
			nonce[n] = Math.round(Math.random() * 0xff);
		}



		// HEAD

		handshake += 'GET / HTTP/1.1\r\n';
		handshake += 'Host: ' + host + ':' + port + '\r\n';
		handshake += 'Upgrade: WebSocket\r\n';
		handshake += 'Connection: Upgrade\r\n';
		handshake += 'Origin: lycheejs://' + identifier + '\r\n';
		handshake += 'Sec-WebSocket-Key: ' + nonce.toString('base64') + '\r\n';
		handshake += 'Sec-WebSocket-Version: 13\r\n';
		handshake += 'Sec-WebSocket-Protocol: lycheejs\r\n';


		// BODY
		handshake += '\r\n';


		this.once('data', function(data) {

			let headers = {};
			let lines   = data.toString('utf8').split('\r\n');


			lines.forEach(function(line) {

				let index = line.indexOf(':');
				if (index !== -1) {

					let key = line.substr(0, index).trim().toLowerCase();
					let val = line.substr(index + 1, line.length - index - 1).trim();
					if (/connection|upgrade|sec-websocket-version|sec-websocket-origin|sec-websocket-protocol/g.test(key)) {
						headers[key] = val.toLowerCase();
					} else if (key === 'sec-websocket-accept') {
						headers[key] = val;
					}

				}

			});


			if (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {

				this.emit('upgrade', {
					headers: headers,
					socket:  this
				});

			} else {

				let err = new Error('connect ECONNREFUSED');
				err.code = 'ECONNREFUSED';

				this.emit('error', err);

			}

		}.bind(this));


		this.write(handshake, 'ascii');

	};

	const _upgrade_remote = function(data) {

		let lines   = data.toString('utf8').split('\r\n');
		let headers = {};


		lines.forEach(function(line) {

			let index = line.indexOf(':');
			if (index !== -1) {

				let key = line.substr(0, index).trim().toLowerCase();
				let val = line.substr(index + 1, line.length - index - 1).trim();
				if (/host|connection|upgrade|origin|sec-websocket-protocol/g.test(key)) {
					headers[key] = val.toLowerCase();
				} else if (key === 'sec-websocket-key') {
					headers[key] = val;
				}

			}

		});


		if (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {

			this.emit('upgrade', {
				headers: headers,
				socket:  this
			});

		} else {

			this.destroy();

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.__connection = null;
		this.__protocol   = null;


		_Emitter.call(this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.socket.WS';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(host, port, connection) {

			host       = typeof host === 'string'       ? host       : null;
			port       = typeof port === 'number'       ? (port | 0) : null;
			connection = typeof connection === 'object' ? connection : null;


			let that = this;
			// let url  = /:/g.test(host) ? ('ws://[' + host + ']:' + port) : ('ws://' + host + ':' + port);


			if (host !== null && port !== null) {

				if (connection !== null) {

					connection.once('data', _upgrade_remote.bind(connection));
					connection.resume();

					connection.once('error', function(err) {

						if (lychee.debug === true) {

							let code = err.code || '';
							if (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {
								console.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);
							}

						}

						that.trigger('error');
						that.disconnect();

					});

					connection.on('upgrade', function(event) {

						let protocol = new _Protocol(_Protocol.TYPE.remote);
						let socket   = event.socket || null;


						if (socket !== null) {

							let verification = _verify_remote.call(socket, event.headers);
							if (verification !== null) {

								socket.allowHalfOpen = true;
								socket.setTimeout(0);
								socket.setNoDelay(true);
								socket.setKeepAlive(true, 0);
								socket.removeAllListeners('timeout');
								socket.write(verification, 'ascii');


								_connect_socket.call(that, socket, protocol);

							} else {

								if (lychee.debug === true) {
									console.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);
								}


								socket.write('', 'ascii');
								socket.end();
								socket.destroy();

								that.trigger('error');
								that.disconnect();

							}

						}

					});

				} else {

					let nonce     = new Buffer(16);
					let connector = new _net.Socket({
						// fd:       null,
						readable: true,
						writable: true
					});


					connector.once('connect', _upgrade_client.bind(connector, host, port, nonce));

					connector.on('upgrade', function(event) {

						let protocol = new _Protocol(_Protocol.TYPE.client);
						let socket   = event.socket || null;


						if (socket !== null) {

							let verification = _verify_client(event.headers, nonce);
							if (verification !== null) {

								socket.setTimeout(0);
								socket.setNoDelay(true);
								socket.setKeepAlive(true, 0);
								socket.removeAllListeners('timeout');


								let interval_id = _setInterval(function() {

									if (socket.writable) {

										let chunk = protocol.ping();
										if (chunk !== null) {
											// XXX: nwjs has global scope problems
											// XXX: Internal Buffer is not our global.Buffer interface
											socket.write(_Buffer.from(chunk));
										}

									} else {

										_clearInterval(interval_id);
										interval_id = null;

									}

								}.bind(this), 60000);


								_connect_socket.call(that, socket, protocol);

							} else {

								if (lychee.debug === true) {
									console.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);
								}


								socket.end();
								socket.destroy();

								that.trigger('error');
								that.disconnect();

							}

						}

					});

					connector.once('error', function(err) {

						if (lychee.debug === true) {

							let code = err.code || '';
							if (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {
								console.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);
							}

						}

						that.trigger('error');
						that.disconnect();

						this.end();
						this.destroy();

					});

					connector.connect({
						host: host,
						port: port
					});

				}

			}

		},

		send: function(payload, headers, binary) {

			payload = payload instanceof Buffer ? payload : null;
			headers = headers instanceof Object ? headers : null;
			binary  = binary === true;


			if (payload !== null) {

				let connection = this.__connection;
				let protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					let chunk = protocol.send(payload, headers, binary);
					// let enc   = binary === true ? 'binary' : 'utf8';

					if (chunk !== null) {
						// XXX: nwjs has global scope problems
						// XXX: Internal Buffer is not our global.Buffer interface
						connection.write(_Buffer.from(chunk));
					}

				}

			}

		},

		disconnect: function() {

			let connection = this.__connection;
			let protocol   = this.__protocol;

			if (connection !== null && protocol !== null) {

				_disconnect_socket.call(this, connection, protocol);


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Download').tags({
	platform: 'html-nwjs'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (
		typeof global.require === 'function'
		&& typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
	) {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	// const Buffer  = lychee.import('Buffer');
	const _fs     = global.require('fs');
	const _Buffer = global.require('buffer').Buffer;
	const _Button = lychee.import('lychee.ui.entity.Button');



	/*
	 * HELPERS
	 */

	const _MIME_TYPE = {
		'Config':  { name: 'Entity', ext: 'json',    mime: 'application/json',         enc: 'utf8'   },
		'Font':    { name: 'Entity', ext: 'fnt',     mime: 'application/json',         enc: 'utf8'   },
		'Music':   {
			'mp3': { name: 'Entity', ext: 'msc.mp3', mime: 'audio/mp3',                enc: 'binary' },
			'ogg': { name: 'Entity', ext: 'msc.ogg', mime: 'application/ogg',          enc: 'binary' }
		},
		'Sound':   {
			'mp3': { name: 'Entity', ext: 'snd.mp3', mime: 'audio/mp3',                enc: 'binary' },
			'ogg': { name: 'Entity', ext: 'snd.ogg', mime: 'application/ogg',          enc: 'binary' }
		},
		'Texture': { name: 'Entity', ext: 'png',     mime: 'image/png',                enc: 'binary' },
		'Stuff':   { name: 'Entity', ext: 'stuff',   mime: 'application/octet-stream', enc: 'utf8'   }
	};

	const _download = function(asset) {

		let data = asset.serialize();
		let url  = data.arguments[0];
		let name = url.split('/').pop();
		let mime = _MIME_TYPE[data.constructor] || _MIME_TYPE['Stuff'];


		if (data.blob !== null) {

			if (/Music|Sound/.test(data.constructor)) {

				for (let ext in mime) {

					let element = global.document.createElement('input');

					element.setAttribute('type',     'file');
					element.setAttribute('nwsaveas', name + '.' + mime[ext].ext);

					element.onchange = function() {

						let blob = new _Buffer(data.blob.buffer[ext], 'base64');
						let path = this.value;

						_fs.writeFileSync(path, blob, mime[ext].enc);

					};

					element.click();

				}

			} else {

				if (url.substr(0, 5) === 'data:') {
					name = mime.name + '.' + mime.ext;
				}

				let element = global.document.createElement('input');

				element.setAttribute('type',     'file');
				element.setAttribute('nwsaveas', name);

				element.onchange = function() {

					let blob = new _Buffer(data.blob.buffer, 'base64');
					let path = this.value;

					_fs.writeFileSync(path, blob, mime.enc);

				};

				element.click();

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'DOWNLOAD'
		}, data);


		this.value = [];


		this.setValue(settings.value);

		delete settings.value;


		_Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			this.value.forEach(function(asset) {
				_download(asset);
			});

		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Download';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(asset) {

					if (asset instanceof global.Config)  return true;
					if (asset instanceof global.Font)    return true;
					if (asset instanceof global.Music)   return true;
					if (asset instanceof global.Sound)   return true;
					if (asset instanceof global.Texture) return true;
					if (asset instanceof global.Stuff)   return true;


					return false;

				});


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Helper').tags({
	platform: 'html-nwjs'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (
		typeof global.require === 'function'
		&& typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.location !== 'undefined'
		&& typeof global.location.href === 'string'
	) {

		try {

			global.require('child_process');

			return true;

		} catch (err) {

		}

	}


	return false;

}).attaches({
	"json": lychee.deserialize({"constructor":"Config","arguments":["/libraries/lychee/source/platform/html-nwjs/ui/entity/Helper.json"],"blob":{"buffer":"data:application/json;base64,ewoJIm1hcCI6IHsKCQkiYm9vdCI6IFsKCQkJewoJCQkJIngiOiAwLAoJCQkJInkiOiAwLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJImVkaXQiOiBbCgkJCXsKCQkJCSJ4IjogMzIsCgkJCQkieSI6IDAsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkiZmlsZSI6IFsKCQkJewoJCQkJIngiOiA2NCwKCQkJCSJ5IjogMCwKCQkJCSJ3IjogMzIsCgkJCQkiaCI6IDMyCgkJCX0KCQldLAoJCSJwcm9maWxlIjogWwoJCQl7CgkJCQkieCI6IDk2LAoJCQkJInkiOiAwLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInJlZnJlc2giOiBbCgkJCXsKCQkJCSJ4IjogMCwKCQkJCSJ5IjogMzIsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkic3RhcnQiOiBbCgkJCXsKCQkJCSJ4IjogMzIsCgkJCQkieSI6IDMyLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInN0b3AiOiBbCgkJCXsKCQkJCSJ4IjogNjQsCgkJCQkieSI6IDMyLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInVuYm9vdCI6IFsKCQkJewoJCQkJIngiOiA5NiwKCQkJCSJ5IjogMzIsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkid2ViIjogWwoJCQl7CgkJCQkieCI6IDAsCgkJCQkieSI6IDY0LAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0KCX0sCgkic3RhdGVzIjogewoJCSJib290IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJlZGl0IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJmaWxlIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJwcm9maWxlIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJyZWZyZXNoIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJzdGFydCI6IHsKCQkJImFuaW1hdGlvbiI6IGZhbHNlCgkJfSwKCQkic3RvcCI6IHsKCQkJImFuaW1hdGlvbiI6IGZhbHNlCgkJfSwKCQkidW5ib290IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJ3ZWIiOiB7CgkJCSJhbmltYXRpb24iOiBmYWxzZQoJCX0KCX0KfQ=="}}),
	"png": lychee.deserialize({"constructor":"Texture","arguments":["/libraries/lychee/source/platform/html-nwjs/ui/entity/Helper.png"],"blob":{"buffer":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAXcklEQVR4Xu2dB7R8V1XGvw9FsWEJIAioFAFBkCpSpUtHQCBSpRlqQOkhSE8oEoqKdBAjAgIqzcSGBiRGQBJFkaLYAEUsRCQgms/1m+z71n3z7sy9M29eZt5/7lnrreT/3sy95+zznd33PtY4tpoC3urVj4vXCIAtB8EIgBEAq6dAkq+RdAVJl5X0vZK+WdIFJX3C9puWfWOSC9r+6rzvD/nMsu/f1O8l+VpJV5N0cUkXqZ9zbP9S35xXxgGSfKukoyX9qKSbSeLf0+Ns212/nzvPJN8p6UWSfkzSI2y/uusLSY6V9DxJvybpsbb/rY8Ah/nvSS4t6URJt2/RO9JEtP+rpEv2HZh9A4ATJ+lnJD1B0rdL+rikd0n6kKSPSPp3SWdLelJtHtxg0EhyAUk/VYv8pnreNST9oqSfbhaX5BskvVzSfeq9V5f0nwWC1w162SH7UJLbSIKb/pck1vgHkj4l6QWSbi3p5rbf37esfQEgCZvyNkm3kvR2SU+x/eczTueLJT3Q9iAAJIGlsak/LOl9ko6R9NeSni3piZJOk3Q3SWz+b0hi058q6VmSflDSKyRdR9IfSXqIbb7bO5L8OOCS9PVzPvxs27xzLSPJd0n6C0l/Iumetr/ARJL8XB1GfvfGIZNbGgB18iHuD9XG/nJN4gK2z51+eZJXSbqj7YvNm1iSb5T0tNoEOAec5dW2YW2TkYSNf62k/5B0odIv7m37na3PwD0eVoDhM8+VdILtL/e8/9OS/rs4WddHryzpUpLusS4QJIED3h09yzY0gCYPlfRSScfb5pAMGvsBwHFF3PvYPjnJDSX9vKQfKFaNrP7j1obAIS5tGxY+cyRBdFxT0smg2TaybNdI8i2S3lCyj7/9uqSftP2ljs9eQtJLJHGyT7P9Iz3vB2hPtw0I94wkF5X0+5KuVFxmLqBaDwDMr7P9D4N2Zj6NeMYpthGPbP6FS9SebvtGM+b9fZIub/u3239fCgBJLlebzCTunIQT8ZeSULp+s5S175B0ZdufqUl+VNInbd+hZwNAMWiGhd1/+sSW7EM0XLI29tvYfEl/K+lBtt/Tfn4SRA5gupOk59t+/H4AUGsBBO+W9P0LbObXwbZtX2uB73QBEAvrf+twvLB1wF5WYvJh09p/khuXiP6ibfZqZywLAAh652JBn07yEEmYHFe3fVYSZPCZJXtfXggFHM+y/fQ+AiSBuyDLPwCYbH82CQomlsB9JQGmB9hGBnICblGnEZPzlZIeZ/vsJN8t6R2SriLpMbbRQ+aOJHM5QN/3Z/09CRzlqbaXonlrozH5MIWxclD4JiMJz8U64jAcYxs68Pu7SvrVEpMfs40IWx4ASUA92v0LmtOU5EFF+OuxKUmuJwkNFKXvNUkw31Cabmr7D4cQsSb++pLzzy/FDxsXWf5M21+ZOukopIAGUxCuw3eeXEri0bY5sX2bzynluafX/Pu+ssjfry8J+uwLALWpKNpsJrrQziirCV3sXnDD0o8Qy78lCeAcZfsG+wUArPl2ki5j+/M1IVjiX5X9+TtlFaAIIgI+nwRzBUvhEn1K2NSCmCyKJmwPGXoz2+gIM0fpIqdKQpn8H6wI2x8eslNl1XyxThjfXeUAXDiy9gWAOunQ+CZFz8keNKOccHDoe9R+wAkQqX8q6bO28RnsjLmTKecOZlYzLlMmGWbQz069GOUPloT5BkJhuR9JgtL3wTq1nYpVF5WTwM7fUgohG4hi+Gf4BWaBoDYfWQjLByjI2/eiMdv+5yG7eQhEQKMjIU6fMoN2nHb0g8/YPjEJ4EMEv9j28YMAkOSBJddx9LQHiLscMraPoEm+p1gp2vl1bOOc6R2l6IFiTDnMu3clwct4kiTMyF8oc4fTipxD4UQ0MGecIQ+3fUqSe5duwHvv1rZKZk1ikwGQBB0GEfcc2zjWBo0k6Gv4a3AO4TCazwHKzobVw0ox39rjfZzsvjcngQWBQrjM9W2zMb0jCV4s5PXf4Fa2jXY/GcWRTkC5LDn/SEmYQDhAsAaQ+5yMc1rfgSOxjqNKBveJkI1UApPAXfG4ons9dpqQs2Ig5UY/o+h1g7Y/hWfsEQG1AWw6svf208pW3w4muWqJgluWtw5F8JN932ttGPYqMg4/Nxv6tA6FDw8fjiU2l4HC+WDb6CE7o/wFxAbwIvK3W/SJgk3kAEmeUw4xWPijOzYfs/z3yh+C4vwxSXBF9gDg4NW8kW28h7tGFwD+pdgsrtbflYQz54wuJ8sUsdEPninpJyThmkQDf9k04oYAoWx3Nr9x/+6YfMUJcDqhWOISZXwCR0/bDZ0EpRMFiM8gHp5hu1ex2zQAJIGmyO2X2n54x+YTccWywkxmoxHZ/1eKMx8HGNDvH7to3wUAUIPMQANHsUMOE3C4rW188rtGbRabDXvCQYHX7blD5f08QJRfHi8fFgXiBMUT9y4RsL+rCBiAxQpBFEAgZB2oRx9g3Mn2tBib+dpNAkAS1ovfhLgG8Ywdd3gdBA4dm49nFF8Im3xbLDQ0/vKjfHjeIeyzAiAqwRiUL07SDTvYLKz1ipKwP5+M02bIKR/ymSSYm/j3EQkAEyAyJzYUhxCyDYcTbBGdBTcvyineP8QCnALlEytk0NgUACRByUPfeU15OKc3HyuJzSe8jmibq9vMWnwfAPDsnVkeNbxusBacGf/UPLAItpBWOmgnzlP6sFnx5CHz2VRYOa5m3serifCdafvosn85LYDgMSXGJt89bABIgpKHCESe4w7fFVwr66ph+7e0jcd0qdEJgArF4trl9HPqT09CuBXFEDaDQtFEoQ5Eay4W1wDgdl2evDYAOkTTA8o1eqgAkAQvHiYw7tv7dmw+7m02H6vmVrbhgkuPLh0AXzFeIxS5JxDpa532m0oimvRO20TXOKUHCQAsAZw/mHg4eLAIdrJ8ugCQhCARrJPkEEzJaw3xWUxxtJnRwGUpPTQWkORz5UjDBIbj7ozKAGLzcYnz90ksZD+jCwBoznch0mWbybDJb66Y/KlJ8C0TcGBTiLPjjFk5wVobwntI9EDB413PICOIbKApEYDr93GSiPYBSsQF0b+h4drJK5PgNEKv6c2mWZDwxAKuYbvtWd31iAp4kUH16OnAVUVc2XwcYbceku0zZH5dACCl60O2MecgCKlHOGZw7Z5UDh4ULsQDm3HzUkIGBXmGTKrrM0lIMkUZRTHE7ENOYuOfVSlonHpOP3kCj7dNYsfCIwlWBi5WNOtVDpTT59kmojlzJIFr4TlF9DaZPqwL+pL0yebv5Fnsd4JdAACBJFWiA2AKEmGD7V61Th2TQQkk4kay5v1sI6/Ol5EEawCTEH8/AwUJUxVN/1j0lfNlIgf0kiQcKMQs64HrEeXEEsAKu41tYhsrG10AwJYn+tYMzCz86DvevCS4dZHP5+vmNxMqjR93MFo/sXH8EK9dxum0Mkqu8EEVPkf3YvMZHMC72MY5t9LRBYBHlayFE3y0K5myUEpo85SVzmbBh1U28LmLuqsXfM1aPl7RUPIoAPibu1LjVjGxfcWmVzGB8RnrpcAIgPXSf+1vHwGw9i1Y7wRGAKyX/mt/+wiAtW/BeicwAmC99F/720cArH0L1juBlQIgCcEiqn86s08WWWplsl6egtCuWsNFnrWfzyYhqkgErj3wPp7c5CsmITJHmdZ0QSk1Bq84qDL1JFRZfcU2+RJLjZUAoCpz8MqRAo7XkPLwfY0kpKOR5UJghizfA401dE02CYGoSdi7Y+zk57Uqo7o+91DbRDJXPpLgGfyybdLflhr7AkBFqAi+UJBIcsYdFkkAnTXjOv2cHjJ/8PmT9Ei8gXKoQfn9S1Fj6ktJCLtSnPpI26SiT0YSUuPfaPsR9W/+S5T0oq1imc7vrmJerXmQogcAOChLjUEAqJIjUrCJDJIpTLwAQsCiKQql8IBByhaBJApHlq6CLRcvETH6AJALz38pEyepk0gd4eBdsfKlVt/zpREA520y2aacxCYTl+YDOylKSWD9BGbIZEEmkatHMInw8aRAcdHRAgAJKYR8mQdcgIRTkh4JAcNaDzTyt0kASEL2L5HZt9gm8RWa7OIASUiCoT0PiTN/P4TufTmB5JZTScJJJ/L31umHFrsmYvhe28dUIQKhZDKLn2SbnPaFRjWJoEkDcX1y43ZGVbkQUycaSZj0iQ3bXeglAz68KQBIQo4j6eEEhu5qm1TvLgDcsUQlpWHoTdBn7ugDQNP+hdyzmRkyScgbACjIwEnJWGUOIRvJa/uVvolMbTJhULJ/9gCgnk32D6KAVHQ+Rwbtq1ZtLWwCAJKQdMNa2QuabuxkXU9zgKINDTEoE0dcU47O92eOmQCo8jBSwai4oQpn7qA+wPakVq8ZSShLRnRQJUz+/qDRqtKlzp+yr86RhC4dtEuB7ZHHSHOEpdKju16wbgAkoTAGC4KGGIi86dTwTiWw8iWoJcCEpbZyZsLOPABAUKqZScleaiQhhYkyJXr8cFoHjSo2QaGcC4AW0EhfoxiEDCUIRn3CoELUeRNaJwBKlEI7OC9Z0bs2n3l3cYAWTRADtLKhVO+Ks/IJZqWFY3pRAErfnUnzp2VHNTSiUJSedbuaOsw52dQAAIBdXTB6NoscPtgdYodkFpJDX7+fLKE1AwDOxgm+SrtAtk2DJDTd+JJtFPA9IwkFO9QDvmhWa5xZAGg6ftDUaacIZBkQVM0+eWw3HprPVkWd6BKTRNRF3ls1DdTQo5fAIhELe4oihzxzXQAoFo6sf7dtMrBniUDM78xrBpmE0jqKZWjOscd0ngUANG8aLmEC7msUO2czaezY26OnWBvlX2TELgyA+j7rul9lDbOGQb2Jphe6RgDgWMPLt1Bd4wwuQBsZdLlrdnVKmQUAzCz64KFR7nskgZ2/cLqryBxkNwCgTdxOJ6xFJ1I+DJIr8R3QIo2U68FjjQAgroDid/FFlOcZAKBJB4W0VAjTW3HXmAUAHA4kh154PzK0eVMSZP+Js3rvdZw8Ch5R4pYGQHEeqmspHMUCQRHa00dwHhrWCABa6VASTuLtHuVvMILPUxQxmfGpdNJyFgAatrHwqenYTEqV6fIxWKGsTiAAALExt5BiBuppjcb36IlHrAJRsnAMYY0AaCqDLzRUcR7ATR9lG0/qIA4A68eXjzk1ccUuO5LgGsaSoNRsaL/eJgq3EAAqNkHQho7l+44irhEA9y8vJ61gqYJaelRRL022qCvY0994nh+gacDMxi1UX9eebRLsWJBMl69BoxWG3VMjN+PEU6PIqSFghLsUcxDTZ+7dAn2TWSMA6MUIgPcdSk4CTWiocamma2t73fMAQIs1So9pSsRDJqMig3iI9jSE7mD/TXeqhdzBrSLJTrY1BTAUPEKxBEsweeAaS9UFdsx/beHgqhGkrx+e1KVG9RQkTkPSCE2994y+WAAVthRh0uhp0nc/CXb5RWzD2meOil5RvowNTgeLwcpMtX2jHGomAKppBWYl1TMUtOInJ4lkZWNdHKDoTJEqzqDO3ghDFllt8ojD0Cm186aWPgDgTsSPTC8Awr6wEvoHULhI8kdnaVg5Y6gohkvQmmyhFLEWACj25HTvjGpTT3SsaZJIVTBl4L0NoIYQbepd6+QAOHnwxuIVvXYX++45gHRb4wCiQ9DVpfMA9iaElFcKPzsJIShxoPLaFYDBTYmJ0d4gCjWp50eJ5ORjgy40KseOrJtdAEhC0If3EwQi0ASHGBT3XmgC9eF1coDiArTBI+eBwlyadA0SbeUCJi2PcD4OoJl70AuAhnDVABr/AImfzfdOss1pnIzKDWDjafFKnH5XdHDoJrQAMEnFSoJVAggJ+mBSAox95x32zWfdACia0jgT3QZvKuvek5PRoj8cm+5oWG5wRPoHoQPMHIMB0HrJg+tmClgKvfcAxUpHi/BNU0S0elgiOgkNopa2ShaZ6CYAoEBARA+PJhyBDQUEWFf0aCD7Cn8H3BH/TdM6Dr9LL3dcCABJyETh8gHsevzrvS9YhOAtkJFeTUSPgScLfQL0L+TKXebd7e+0rJGuR52vWcFlfZHyxQmn3Uy7hwPzI0+T+AGK8TuGKt2LAgDNn9SvQX1/97MBlfNOg+g3LdLocT/v7Ppu3YWw65aNUm7f0GRA1zUycMYmObZ5FGz4lauu7S8lGWWcbi3sIa7uD9om5rLQWAgACz15/PChoMAIgEOxTQc3yREAB0fbQ/HkEQCHYpsObpIjAA6OtofiySMADsU2HdwkRwAcHG0PxZOXAkAS4u/YoHSvJAxLCTU9BfeVvHAoKHaETXIwAKpgk0xbGklzZ930bWKQBgcR0UOuN1nZxRFHGM03ajmDAJCEjedGajphkGXD5hMa5pp17hDAN0/xB4MQMBFCYgQEiyal5OPYTAr05QPgk6fGDB80xRa0IqFIkZTxt7YbJdTd9UQGCddSpYPbmHwBLm1c2EW5meQ68mY1LyWM0CIbSOyfCxj5fwov32+bq0h3dcqoYAUVQOSzoRcQxqRKlYueuWFk5y6/I4+Mh3dF8wDAiSc7lZspTktCiRLFCqSKTzJ8OlqlEJKkIJFs4hOSkJ3LpU8EdADRODaMArPqAujJD7unPIxTzGbDAb5gu5H1ewBQn6N7BwWL3CDOZ4jpU93DNfBk8YxjgyiwBwCVSQqrp4oG1s21QKQWEXKkV8AkObSLA9TvUP5I0b4Y7dEqh4/LpClMvNqQbOINos8RP5UuAGDivafu3YHVk5+OJs8NXqSHk1+GPOeHzBQ6g1CTz104+AfQGVAGSR6hxItSc5I6GHsuLz7iKbzhC+wCAOy6uambpAN+SEmaednRjDWSD8jJRwnk5i8qjmmaiOk4jg2hQBcAkOEft01+WcPquYCRbpkodfTv4Yd0Ze62QemjERQiA/ufH9KZ32ab7mHNM9AhjtpPx5ENodkRNY0uAFCQQRoTvfmazeOWKhQ7lMOdMW0FtD6PS/gDtu/Z+h3+BHoMNhc+H1GEPKyL2QWAUtjIYzvONp6+BgBU98AVqLodAgAyVz9lm9Kw5hkUcFClO91P97DS7oiYdxcHwK37knZPmSQ4eL5qGzt/CACICZxmGxdyAwB8CFQTjRxgg6DTBQA27wwuZG5tHtr+lWw3d/U1m7qrZ27r8xQx0BlsR+ErP8KoA2zQ5jOVLgDgrMGJQ3uSc8sHwOlF/tPqrVEAUQLZYMrFUBIbBRDzEOcRMQHavJ1T4WN0C0Bx7IbRYKun0wUACg9oDMmV5PSX4a7artFEBfERcHMnP9MD5w8KITVt3IhJx9GVVvBu9e6tYPFdACDkS30flSd4/TjhtEynNInOlbRcOYeWY1PRwIYz4ATiEmcKJZD3iA1MSgoc6Rg6hodXsHGresSsWACNiWlSdC/bbDg+fRRBGhbcvSXr9+gASXAj02F00hEkCfff0raFLuO0kh/HBlFgFgCI5+PFo1fPTWyfVSVSNBm6bNNwqSMaSFcRegdMmhQnod/dqeUWpufd4CYRG0SjI3oq88LBVKLiAMIs5B4AAIGH7xTbdK/oCgfjFbyuJJoTcH0M18xTwXrd5ir0I5qah3BxfRlB2P2YgGj8OIZg7/ybjlNvn9IBjqu0Me4KQPmD9aNIYvt/7hDSZium3JsTmOQK1aAAjkD7Vr5DthCdQGjEiFaPLjDhChU55L+0djl+0eaMW0H1DVpkLwCK1WMR4NVDMaQBwaxBejh9aamdJwo4jg2nwCAAtNeQBNlOazbu8KF1Cx04aUwwCfseRLOmDafhoZ7ewgA41KsdJ7+HAiMAthwUIwBGAGw5BbZ8+SMHGAGw5RTY8uWPHGAEwJZTYMuXP3KAEQBbToEtX/7IAUYAbDkFtnz5IwcYAbDlFNjy5Y8cYATAllNgy5c/coARAFtOgS1f/sgBRgBsOQW2fPkjBxgBsOUU2PLljxxgBMCWU2DLlz9ygBEAW06BLV/+yAFGAGw5BbZ8+SMHGAGw5RTY8uWPHGAEwJZTYMuXP3KAEQBbToEtX/7IAbYcAP8PmU3/F/4gW0oAAAAASUVORK5CYII="}})
}).exports(function(lychee, global, attachments) {

	const _child_process = global.require('child_process');
	const _Button        = lychee.import('lychee.ui.entity.Button');
	const _CONFIG        = attachments["json"].buffer;
	const _ROOT          = lychee.ROOT.lychee || '/opt/lycheejs';
	const _TEXTURE       = attachments["png"];



	/*
	 * HELPERS
	 */

	const _is_value = function(value) {

		value = typeof value === 'string' ? value : null;


		if (value !== null) {

			let action   = value.split('=')[0] || '';
			let resource = value.split('=')[1] || '';
			let data     = value.split('=')[2] || '';


			if (action === 'boot' && resource !== '') {

				return true;

			} else if (action === 'profile' && resource !== '' && data !== '') {

				return true;

			} else if (action === 'unboot') {

				return true;

			} else if (/start|stop|edit|file|web/g.test(action) && resource !== '') {

				return true;

			} else if (action === 'refresh') {

				return true;

			}

		}


		return false;

	};

	const _help = function(value) {

		let action = value.split('=')[0];
		let helper = null;


		if (action === 'refresh') {

			helper      = global.document.createElement('a');
			helper.href = './' + global.location.href.split('/').pop();
			helper.click();

		} else {

			try {

				let helper = _child_process.execFile(_ROOT + '/bin/helper.sh', [
					'lycheejs://' + value
				], {
					cwd: _ROOT
				}, function(error, stdout, stderr) {

					stderr = (stderr.trim() || '').toString();

					if (error !== null && error.signal !== 'SIGTERM') {

						helper = null;

					} else if (stderr !== '') {

						if (lychee.debug === true) {

							stderr.trim().split('\n').forEach(function(line) {
								console.error('lychee.ui.entity.Helper: "' + line.trim() + '"');
							});

						}

					}

				});

				helper.stdout.on('data', function(lines) {});
				helper.stderr.on('data', function(lines) {});

				helper.on('error', function() {
					this.kill('SIGTERM');
				});

				helper.on('exit', function(code) {});

			} catch (err) {

				helper = null;

			}

		}


		return helper !== null;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'HELPER'
		}, data);


		this.__action = null;


		_Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('change', function(value) {
			return _help(value);
		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Helper';


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			let action   = this.__action;
			let alpha    = this.alpha;
			let font     = this.font;
			let label    = this.label;
			let position = this.position;
			let x        = position.x + offsetX;
			let y        = position.y + offsetY;
			let hwidth   = this.width  / 2;
			let hheight  = this.height / 2;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				'#545454',
				true
			);


			let pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);

			}


			if (action !== null) {

				let map = _CONFIG.map[action] || null;
				if (map !== null) {

					if (this.width > 96) {

						renderer.drawSprite(
							x - hwidth,
							y - hheight,
							_TEXTURE,
							map[0]
						);

						renderer.drawText(
							x,
							y,
							label,
							font,
							true
						);

					} else {

						renderer.drawSprite(
							x - map[0].w / 2,
							y - hheight,
							_TEXTURE,
							map[0]
						);

					}

				} else if (label !== null && font !== null) {

					renderer.drawText(
						x,
						y,
						label,
						font,
						true
					);

				}

			} else if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
				);

			}


			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = _is_value(value) === true ? value : null;


			if (value !== null) {

				this.value    = value;
				this.__action = value.split('=')[0] || null;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Upload').tags({
	platform: 'html'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (
		typeof global.addEventListener === 'function'
		&& typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.FileReader !== 'undefined'
		&& typeof global.FileReader.prototype.readAsDataURL === 'function'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _Button    = lychee.import('lychee.ui.entity.Button');
	const _INSTANCES = [];
	const _WRAPPERS  = [];



	/*
	 * FEATURE DETECTION
	 */

	(function(document) {

		let focus = 'onfocus' in document;
		if (focus === true && typeof document.addEventListener === 'function') {

			document.addEventListener('focus', function() {

				for (let w = 0, wl = _WRAPPERS.length; w < wl; w++) {

					let wrapper = _WRAPPERS[w];
					if (wrapper._visible === true) {
						wrapper.oncancel();
					}

				}

			}, true);

		}

	})(global.document || {});



	/*
	 * HELPERS
	 */

	const _wrap = function(instance) {

		let allowed = [ 'json', 'fnt', 'ogg', 'mp3', 'png', 'js', 'tpl', 'md' ];
		let element = global.document.createElement('input');


		let type = instance.type;
		if (type === Composite.TYPE.all) {
			allowed = [ '*' ];
		} else if (type === Composite.TYPE.config) {
			allowed = [ 'json' ];
		} else if (type === Composite.TYPE.font) {
			allowed = [ 'fnt' ];
		} else if (type === Composite.TYPE.music) {
			allowed = [ 'mp3', 'ogg' ];
		} else if (type === Composite.TYPE.sound) {
			allowed = [ 'mp3', 'ogg' ];
		} else if (type === Composite.TYPE.texture) {
			allowed = [ 'png' ];
		} else if (type === Composite.TYPE.stuff) {
			allowed = [ '*' ];
		}


		element._visible = false;
		element.setAttribute('accept',   allowed.map(function(v) {
			return '.' + v;
		}).join(','));
		element.setAttribute('type',     'file');
		element.setAttribute('multiple', '');

		element.onclick  = function() {
			element._visible = true;
		};

		element.oncancel = function() {
			element._visible = false;
			element.value    = '';
			instance.trigger('change', [ null ]);
		};

		element.onchange = function() {

			if (element._visible === false) {
				return;
			} else {
				element._visible = false;
			}


			let val    = [];
			let change = false;


			[].slice.call(this.files).forEach(function(file) {

				change = true;

				let reader = new global.FileReader();

				reader.onload = function() {

					// TODO: If file.name is msc.ogg or msc.mp3 use both buffers
					// TODO: If file.name is snd.ogg or snd.mp3 use both buffers

					let asset = new lychee.Asset('/tmp/' + file.name, null, true);
					if (asset !== null) {

						asset.deserialize({
							buffer: reader.result
						});

						val.push(asset);

					}

				};

				reader.readAsDataURL(file);

			});


			if (change === true) {

				setTimeout(function() {

					let result = instance.setValue(val);
					if (result === true) {
						instance.trigger('change', [ val ]);
					} else {
						instance.trigger('change', [ null ]);
					}

				}, 500);

			} else {

				instance.trigger('change', [ null ]);

			}

		};


		return element;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'UPLOAD'
		}, data);


		this.type  = Composite.TYPE.asset;
		this.value = [];


		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.type;
		delete settings.value;


		_Button.call(this, settings);

		settings = null;


		_INSTANCES.push(this);
		_WRAPPERS.push(_wrap(this));



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			let wrapper = _WRAPPERS[_INSTANCES.indexOf(this)] || null;
			if (wrapper !== null) {

				// XXX: Removing this causes endless loop
				setTimeout(function() {
					wrapper.click();
				}, 250);

			}

		}, this);

	};


	Composite.TYPE = {
		'all':     0,
		'config':  1,
		'font':    2,
		'music':   3,
		'sound':   4,
		'texture': 5,
		'stuff':   6
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Upload';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(asset) {

					if (asset instanceof global.Config)  return true;
					if (asset instanceof global.Font)    return true;
					if (asset instanceof global.Music)   return true;
					if (asset instanceof global.Sound)   return true;
					if (asset instanceof global.Texture) return true;
					if (asset instanceof global.Stuff)   return true;


					return false;

				});


				return true;

			}


			return false;

		}

	};


	return Composite;

});

