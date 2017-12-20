
lychee.define('app.state.Browse').requires([
	'app.interface.Intent'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Intent    = lychee.import('app.interface.Intent');
	const _State     = lychee.import('lychee.app.State');
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-browse'];
	const _main      = global.document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _on_browse = function(data) {

		if (data.length > 0) {

			this.element.fireEventListener('render', data);

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

	const Composite = function(main) {

		this.element = _COMPONENT.create();

		this.__listener = null;


		_main.appendChild(this.element);
		_State.call(this, main);

	};


	Composite.prototype = {

		// deserialize: function(blob) {},

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

			oncomplete = oncomplete instanceof Function ? oncomplete : null;
			intent     = intent instanceof _Intent      ? intent     : null;


			this.__listener = function(e) {
				this.main.command(e.detail);
			}.bind(this);

			this.element.fireEventListener('enter', null);
			this.element.addEventListener('command', this.__listener, true);


			_browse.call(this, intent);


			return _State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;


			this.element.removeEventListener('command', this.__listener, true);
			this.element.fireEventListener('leave', null);

			this.__listener = null;


			return _State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
