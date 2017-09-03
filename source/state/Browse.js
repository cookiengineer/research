
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State     = lychee.import('lychee.app.State');
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-browse'];
	const _main      = global.document.querySelector('main');



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

		console.log('on browse', articles);

		if (articles.length === 0) {
			articles.push($.render('article', _get_500()));
		}


		// Array.from(_state.querySelectorAll('article')).forEach(other => other.parentNode.removeChild(other));

		// _STATE.queries('article').forEach(other => _STATE.remove(other));
		// articles.forEach(article => _STATE.add(article));


		// if (_FOOTER !== null) {
		// 	_STATE.remove(_FOOTER);
		// 	_STATE.add(_FOOTER);
		// }

	};

	const _browse = function(intent) {

		let data   = intent._result;
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

		this.element    = _COMPONENT.create();
		this.__listener = null;

		_main.appendChild(this.element);

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

			_browse.call(this, intent);

		},

		enter: function(oncomplete, intent) {

			this.__listener = function(e) {
				this.main.command(e.detail);
			}.bind(this);

			this.element.fireEventListener('reset', null);
			this.element.addEventListener('command', this.__listener, true);


			_browse.call(this, intent);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			this.element.removeEventListener('command', this.__listener, true);

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
