
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State     = lychee.import('lychee.app.State');
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-browse'];
	const _main      = global.document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _on_browse = function(results) {

		let articles = [];

		if (results.length > 0) {

			results.forEach(entry => {

				if (typeof entry.html === 'string') {
					// TODO: Remove legacy $.render() method
					articles.push($.render('article', entry.html));
				}

			});

		}


		if (articles.length > 0) {

			this.element.fireEventListener('render', {
				articles: articles
			});

		} else {

			this.element.fireEventListener('error', {
				code:    500,
				header:  'Network Error',
				message: 'Could not retrieve any matching data.'
			});

		}

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

		this.element = _COMPONENT.create();

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

			this.element.fireEventListener('enter', null);
			this.element.addEventListener('command', this.__listener, true);


			_browse.call(this, intent);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			this.element.removeEventListener('command', this.__listener, true);
			this.element.fireEventListener('leave', null);

			this.__listener = null;

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
