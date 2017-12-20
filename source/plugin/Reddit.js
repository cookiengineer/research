
lychee.define('app.plugin.Reddit').requires([
	'app.interface.Intent'
]).exports(function(lychee, global, attachments) {

	const _Intent = lychee.import('app.interface.Intent');
	const _BLOB   = attachments["json"].buffer;
	const _URLS   = [
		'https://reddit.com/m/',
		'http://reddit.com/m/',
		'https://reddit.com/r/',
		'http://reddit.com/r/',
		'https://reddit.com/u/',
		'http://reddit.com/u/',
		'https://www.reddit.com/m/',
		'http://www.reddit.com/m/',
		'https://www.reddit.com/r/',
		'http://www.reddit.com/r/',
		'https://www.reddit.com/u/',
		'http://www.reddit.com/u/'
	];



	/*
	 * HELPERS
	 */

	const _queries = function(data) {

		let queries = [];

		if (typeof data.url === 'string') {

			queries.push({
				title:  data.url,
				url:    data.url,
				method: 'GET',
				params: {}
			});

		} else {

			let topics  = data.topic  || [];
			let inputs  = data.input  || [];
			let persons = data.person || [];

			if (topics.length > 0) {

				topics.forEach(topic => {

					let url = 'https://www.reddit.com/r/' + topic.word;

					if (inputs.length > 0) {

						queries.push({
							title:  '/r/' + topic.word,
							url:    url + '/search.json',
							method: 'GET',
							params: {
								q:           '"' + inputs.map(input => input.word).join('+') + '"',
								restrict_sr: 'on',
								sort:        'top',
								t:           'all'
							}
						});

					} else {

						queries.push({
							title:  '/r/' + topic.word,
							url:    url + '.json',
							method: 'GET',
							params: {}
						});

					}


				});

			} else if (persons.length > 0) {

				persons.map(person => {
					person.word = person.word.startsWith('@') ? person.word.substr(1) : person.word;
					return person;
				}).forEach(person => {

					queries.push({
						title:  '/u/' + person.word + '\'s links',
						url:    'https://www.reddit.com/user/' + person.word + '/submitted.json',
						method: 'GET',
						params: {
							limit: 100,
							t:     'all'
						}
					});

					queries.push({
						title:  '/u/' + person.word + '\'s comments',
						url:    'https://www.reddit.com/user/' + person.word + '/comments.json',
						method: 'GET',
						params: {
							limit: 100,
							t:     'all'
						}
					});

				});

			} else {

				let url = 'https://www.reddit.com/r/all';

				if (inputs.length > 0) {

					queries.push({
						title:  '/r/all',
						url:    url + '/search.json',
						method: 'GET',
						params: {
							q:    '"' + inputs.map(input => input.word).join('+') + '"',
							sort: 'top',
							t:    'all'
						}
					});

				}

			}

		}


		return queries;

	};

	const _parse = function(data) {

		let file = data.query.url.split('/').pop().split('?')[0];
		if (file.endsWith('.json')) {

			let json = null;

			try {
				json = JSON.parse(data.result);
			} catch (err) {
				json = null;
			}

			if (json !== null) {
				data.result = json;
			}

		}

		return data;

	};

	const _filter = function(data) {

		let filtered = [];
		let children = JSON.query(data.result, 'data > children');

		if (children !== null) {

			children.map(function(entry) {

				let kind = entry.kind || null;
				if (kind === 't1') {

					return {
						type:        'comment',
						title:       'Comment',
						url:         null,
						author:      (entry.data.author         || '').trim(),
						description: (entry.data.body           || '').trim(),
						relevance:   (entry.data.score          || 0),
						time:        (entry.data.created_utc    || null),
						detail:      (entry.data.link_permalink || null),
						preview:     null
					};

				} else if (kind === 't3') {

					let img = null;
					let url = entry.data.thumbnail || '';

					if (url.startsWith('https://') || url.startsWith('http://')) {

						img = {
							url:    url,
							width:  entry.data.thumbnail_width  || 128,
							height: entry.data.thumbnail_height || 128
						};

					}

					return {
						type:        'link',
						title:       (entry.data.title       || '').trim(),
						url:         (entry.data.url         || null),
						author:      (entry.data.author      || '').trim(),
						description: (entry.data.selftext    || '').trim(),
						relevance:   (entry.data.score       || 0),
						time:        (entry.data.created_utc || null),
						detail:      (entry.data.permalink   || null),
						preview:     img
					};

				}

			}).filter(function(entry) {

				if (entry.url !== null) {

					let found = filtered.find(other => other.url === entry.url);
					if (found === undefined) {
						filtered.push(entry);
					}

				} else {

					filtered.push(entry);

				}

			});

		}

		data.filtered = filtered;

		return data;

	};

	const _render = function(data) {

		let rendered = [];

		data.filtered.forEach(entry => {

			let chunk = [];

			if (entry.type === 'link') {

				let url         = entry.url         || null;
				let description = entry.description || '(no description)';
				let detail      = entry.detail      || null;
				let preview     = entry.preview     || null;

				chunk.push('<b>');

				if (preview !== null) {
					chunk.push('\t<img src="' + preview.url + '" width="' + preview.width + '" height="' + preview.height + '">');
				}

				if (url !== null) {
					chunk.push('\t<a href="' + entry.url + '">' + entry.title + '</a>');
				} else if (detail !== null) {
					chunk.push('\t<a href="' + entry.detail + '">' + entry.title + '</a>');
				} else {
					chunk.push('\t' + entry.title);
				}

				chunk.push('</b>');

				chunk.push('<p>');
				chunk.push('\t' + description);
				chunk.push('</p>');

				chunk.push('<div>');
				chunk.push('\t<small>relevance: ' + entry.relevance + '</small>');
				chunk.push('\t<small>author: <a href="https://reddit.com/u/' + entry.author + '">' + entry.author + '</a></small>');
				chunk.push('</div>');

			}

			rendered.push(chunk.join('\n'));

		});


		data.rendered = rendered;

		return rendered;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		this.main    = main         || null;
		this.bot     = main.bot     || null;
		this.scraper = main.scraper || null;


		this.deserialize(_BLOB);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.intents instanceof Array) {

				let bot = this.bot || null;
				if (bot !== null) {

					for (let i = 0, il = blob.intents.length; i < il; i++) {
						bot.addIntent(new _Intent(blob.intents[i]));
					}

				}

			}


		},

		serialize: function() {

			return {
				'constructor': 'app.plugin.Reddit',
				'arguments':   []
			};

		},



		/*
		 * PLUGIN API
		 */

		can: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				let result = false;

				for (let u = 0, ul = _URLS.length; u < ul; u++) {

					if (url.startsWith(_URLS[u])) {
						result = true;
						break;
					}

				}

				return result;

			}


			return false;

		},

		browse: function(data) {

			data = data instanceof Object ? data : {};


			let scraper = this.scraper;
			let promise = Promise.all(_queries(data).map(function(query) {
				return scraper.query(query);
			}));

			promise.then(results => results.map(_parse));
			promise.then(results => results.map(_filter));
			promise.then(results => results.map(_render));


			return promise;

		},

		search: function(data) {

			data = data instanceof Object ? data : {};


			let scraper = this.scraper;
			let promise = Promise.all(_queries(data).map(function(query) {
				return scraper.query(query);
			}));

			promise.then(results => results.map(_parse));
			promise.then(results => results.map(_filter));
			promise.then(results => results.map(_render));


			return promise;

		}

	};


	return Composite;

});

