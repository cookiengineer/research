
lychee.define('app.state.Search').requires([
	'app.interface.Intent'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Intent  = lychee.import('app.interface.Intent');
	const _State   = lychee.import('lychee.app.State');
	const _BLOB    = attachments["json"].buffer;
	const _STATE   = $.state('search', attachments["html"], attachments["css"]);
	const _ARTICLE = _STATE.query('article');
	const _INPUT   = _STATE.query('header input');



	/*
	 * HELPERS
	 */

	const _on_search = function(data) {

		console.log('on search', data);

	};

	const _search = function(data) {

		let main   = this.main;
		let plugin = main.getPlugin(data.plugin || 'generic');
		if (plugin !== null) {

			plugin.search(data).then(_on_search.bind(this));

		} else {

			plugin = main.getPlugin('generic');

			if (plugin !== null) {
				plugin.search(data).then(_on_search.bind(this));
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		this.bot = main.bot || null;


		_State.call(this, main);

		this.deserialize(_BLOB);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Search';


			return data;

		},

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

		update: function(intent) {

			_search.call(this, intent._result);

		},

		enter: function(oncomplete, intent) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;
			intent     = intent instanceof _Intent      ? intent     : null;


			_STATE.enter();
			_INPUT.value(intent.sentence);
			_INPUT.bind('change', this.main.command, this.main);

			_search.call(this, intent._result);


			return _State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;


			_INPUT.unbind('change');
			_INPUT.value('');
			_STATE.leave();


			return _State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});

