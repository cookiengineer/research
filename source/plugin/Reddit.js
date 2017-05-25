
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
						title:  '/u/' + person.word,
						url:    'https://www.reddit.com/u/' + person.word,
						method: 'GET',
						params: {}
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

			children.forEach(function(entry) {

				filtered.push({
					title:       (entry.data.title    || '').trim(),
					author:      (entry.data.author   || '').trim(),
					description: (entry.data.selftext || '').trim(),
					relevance:   entry.data.score     || 0,
					time:        entry.data.utc       || null,
					url:         entry.data.url       || null,
					detail:      entry.data.permalink || null
				});

			});

		}

		data.result = filtered;

		return data;

	};

	const _render = function(data) {

		let html = [];

		html.push('<h3>' + data.query.title + '</h3>');
		html.push('<ol>');

		data.result.forEach(entry => {

			let chunk = [];

			chunk.push('<li>');
			chunk.push('<b>');

			if (entry.url !== null) {
				chunk.push('\t<a href="' + entry.url + '">' + entry.title + '</a>');
			} else if (entry.detail !== null) {
				chunk.push('\t<a href="' + entry.detail + '">' + entry.title + '</a>');
			} else {
				chunk.push('\t' + entry.title);
			}
			chunk.push('</b>');

			chunk.push('<p>');
			chunk.push('\t' + (entry.description || '(no description)'));
			chunk.push('</p>');

			chunk.push('<div>');
			chunk.push('\t<small>relevance: ' + entry.relevance + '</small>');
			chunk.push('\t<small>author: <a href="https://www.reddit.com/u/' + entry.author + '">' + entry.author + '</a></small>');
			chunk.push('</div>');

			chunk.push('</li>');

			html.push(chunk.join('\n'));

		});

		html.push('</ol>');


		data.html = html.join('\n');

		return data;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.main    = main     || null;
		this.bot     = main.bot || null;
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

			let result = false;

			for (let u = 0, ul = _URLS.length; u < ul; u++) {

				if (url.startsWith(_URLS[u])) {
					result = true;
					break;
				}

			}

			return result;

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

