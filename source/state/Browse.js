
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State = lychee.import('lychee.app.State');
	const _STATE = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['browse'] || null;



	/*
	 * HELPERS
	 */

	const _get_500 = function(entry) {

		let html = [];

		html.push('<h3>No results</h3>');
		html.push('<p>');
		html.push('\tNo results matched your query.');
		html.push('</p>');
		html.push('<p>');
		html.push('\tTry a different query.');
		html.push('</p>');

		return html.join('\n');

	};

	const _on_browse = function(results) {

		let articles = [];

		if (results.length > 0) {

			results.forEach(entry => {

				if (typeof entry.html === 'string') {
					articles.push($.render('article', entry.html));
				}

			});

		}

		if (articles.length === 0) {
			articles.push($.render('article', _get_500()));
		}


		_STATE.queries('article').forEach(other => _STATE.remove(other));
		articles.forEach(article => _STATE.add(article));


		// if (_FOOTER !== null) {
		// 	_STATE.remove(_FOOTER);
		// 	_STATE.add(_FOOTER);
		// }

	};

	const _browse = function(data) {

		console.info('browse', data);


		let main   = this.main;
		let plugin = main.getPlugin(data.plugin || 'generic');
		if (plugin !== null) {

			plugin.browse(data).then(_on_browse.bind(this));

		} else if (typeof data.url === 'string') {

			plugin = main.getPlugin(main.findPlugin(data.url) || 'generic');

			if (plugin !== null) {
				plugin.browse(data).then(_on_browse.bind(this));
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		_State.call(this, main);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Browse';


			return data;

		},

		update: function(intent) {

			_browse.call(this, intent._result);

		},

		enter: function(oncomplete, intent) {

			global.__STATE = _STATE;
			console.log(_STATE);

			// _STATE.enter();

			// let input = _HEADER.query('input');
			// if (input !== null) {
			// 	input.value(intent.sentence);
			// 	input.bind('change', this.main.command, this.main);
			// }

			_browse.call(this, intent._result);


			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			// let input = _HEADER.query('input');
			// if (input !== null) {
			// 	input.unbind('change');
			// 	input.value('');
			// }

			// _STATE.leave();


			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
