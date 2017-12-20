
lychee.define('app.interface.Intent').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _push_word = function(name, word, weight) {

		name   = typeof name === 'string'   ? name   : null;
		word   = typeof word === 'string'   ? word   : null;
		weight = typeof weight === 'number' ? weight : 0.5;


		if (name !== null && word !== null) {

			if (this[name] === undefined) {
				this[name] = [];
			}

			let found = this[name].find(function(value) {
				return value.word === word;
			}) || null;

			if (found === null) {

				this[name].push({
					word:   word,
					weight: weight
				});

			}

		}

	};

	const _parse_result = function() {

		if (this.format === null || this.sentence === null) {
			return;
		}


		let data   = Object.assign({}, this.data);
		let format = this.format.split(' ');
		let words  = this.sentence.split(' ');
		let offset = 0;

		for (let w = 0, wl = words.length; w < wl; w++) {

			let temp = format[w + offset];
			let word = words[w];

			if (temp === undefined) {

				// XXX: Nothing to parse

			} else if (temp === word) {

				// XXX: Nothing to parse

			} else if (temp.startsWith('<') && temp.endsWith('>')) {

				let name = temp.split(/<|>/g)[1] || null;
				if (name !== null) {
					_push_word.call(data, name, word, 0.5);
				}


				let next_temp = format[w + offset + 1];
				if (next_temp !== undefined) {

					if (next_temp.includes('<') === false && next_temp.includes('>') === false) {

						for (let w2 = w + 1; w2 < wl; w2++) {

							let next_word = words[w2];
							if (next_word === next_temp) {

								break;

							} else {

								_push_word.call(data, name, next_word, 0.5);

								offset--;
								w++;

							}

						}

					}

				} else if (words.length > format.length) {

					for (let w2 = w + 1; w2 < wl; w2++) {
						_push_word.call(data, name, words[w2], 0.5);
					}

					break;

				}

			} else if (temp.includes('<') && temp.includes('>')) {

				if (temp.endsWith('>')) {

					let prefix = temp.substr(0, temp.indexOf('<'));
					if (prefix === word.substr(0, prefix.length)) {

						let name = temp.substr(temp.indexOf('<') + 1, temp.indexOf('>') - temp.indexOf('<') - 1) || null;
						if (name !== null) {
							_push_word.call(data, name, word.substr(prefix.length), 0.5);
						}

					}

				} else if (temp.startsWith('<')) {

					let suffix = temp.substr(temp.indexOf('>') + 1);
					if (suffix === word.substr(-1 * suffix.length)) {

						let name = temp.substr(temp.indexOf('<') + 1, temp.indexOf('>') - temp.indexOf('<') - 1) || null;
						if (name !== null) {
							_push_word.call(data, name, word.substr(0, word.length - suffix.length), 0.5);
						}

					}

				}

			}

		}


		this._result = data;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let settings = Object.assign({}, data);


		this.action   = null;
		this.data     = {};
		this.format   = null;
		this.sentence = '';

		this._result  = {};


		this.setAction(settings.action);
		this.setData(settings.data);
		this.setFormat(settings.format);
		this.setSentence(settings.sentence);

		settings = null;

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let settings = {};
			let blob     = {};


			if (this.action !== null)   settings.action   = this.action;
			if (this.data !== null)     settings.data     = Object.assign({}, this.data);
			if (this.format !== null)   settings.format   = this.format;
			if (this.sentence !== null) settings.sentence = this.sentence;


			return {
				'constructor': 'app.interface.Intent',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		analyze: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			let probability = 0.0;


			if (sentence !== null) {

				let count  = 0;
				let format = this.format.split(' ');
				let words  = sentence.split(' ');
				let offset = 0;

				for (let w = 0, wl = words.length; w < wl; w++) {

					let temp = format[w + offset];
					let word = words[w];

					if (temp === undefined) {

						// TODO: What to do when sentence has too much words?
						// console.error('not sure what to do', format, words);

					} else if (temp === word) {

						count++;

					} else if (temp.startsWith('<') && temp.endsWith('>')) {

						count++;


						let next_temp = format[w + offset + 1];
						if (next_temp !== undefined) {

							if (next_temp.includes('<') === false && next_temp.includes('>') === false) {

								for (let w2 = w + 1; w2 < wl; w2++) {

									let next_word = words[w2];
									if (next_word === next_temp) {

										break;

									} else {

										offset--;
										count += 0.5;
										w++;

									}

								}

							}

						} else {

							for (let w2 = w + 1; w2 < wl; w2++) {
								count += 0.5;
							}

						}

					} else if (temp.includes('<') && temp.includes('>')) {

						if (temp.endsWith('>')) {

							let prefix = temp.substr(0, temp.indexOf('<'));
							if (prefix === word.substr(0, prefix.length)) {
								count++;
							}

						} else if (temp.startsWith('<')) {

							let suffix = temp.substr(temp.indexOf('>') + 1);
							if (suffix === word.substr(-1 * suffix.length)) {
								count++;
							}

						}

					}

				}


				if (count > 0) {
					probability = count / words.length;
				}

			}


			return probability;

		},

		clone: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			if (sentence !== null) {

				return new Composite({
					action:   this.action,
					data:     this.data,
					format:   this.format,
					sentence: sentence
				});

			}


			return null;

		},

		setAction: function(action) {

			action = typeof action === 'string' ? action : null;


			if (action !== null) {

				this.action = action;

				return true;

			}


			return false;

		},

		setData: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				this.data = data;
				_parse_result.call(this);

				return true;

			}


			return false;

		},

		setFormat: function(format) {

			format = typeof format === 'string' ? format : null;


			if (format !== null) {

				this.format = format;

				return true;

			}


			return false;

		},

		setSentence: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			if (sentence !== null) {

				this.sentence = sentence;
				_parse_result.call(this);

				return true;

			}


			return false;

		}

	};


	return Composite;

});

