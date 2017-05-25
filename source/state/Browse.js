
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State   = lychee.import('lychee.app.State');
	const _STATE   = $.state('browse', attachments["html"], attachments["css"]);
	const _ARTICLE = _STATE.query('article');
	const _INPUT   = _STATE.query('header input');



	/*
	 * HELPERS
	 */

	const _get_404 = function(entry) {

		let html = [];

		html.push('<h3>' + entry.query.url + '</h3>');
		html.push('<p>');
		html.push('\tNo results');
		html.push('</p>');

		return html.join('\n');

	};

	const _on_browse = function(array) {

		let html = [];

		array.forEach(entry => {

			html.push('<article>');
			html.push(entry.html || _get_404(entry));
			html.push('</article>');

		});

		_ARTICLE.value(html.join('\n'));

	};

	const _browse = function(data) {

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

			_STATE.enter();
			_INPUT.value(intent.sentence);
			_INPUT.bind('change', this.main.command, this.main);

			_browse.call(this, intent._result);


			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_INPUT.unbind('change');
			_INPUT.value('');
			_STATE.leave();


			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
