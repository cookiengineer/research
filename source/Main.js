
lychee.define('app.Main').requires([
	'app.interface.Bot',
	'app.net.Client',
	'app.net.Server',
	'app.plugin.Reddit',
	'app.state.Browse',
	'app.state.Dialog',
	'app.state.Help',
//	'app.state.Archive',
//	'app.state.Backup',
//	'app.state.Browse',
	'app.state.Search',
	'app.state.Settings',
	'lychee.Input'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	const _app  = lychee.import('app');
	const _Bot  = lychee.import('app.interface.Bot');
	const _Main = lychee.import('lychee.app.Main');
	const _WM   = lychee.import('WM');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			client:   null,
			server:   null,

			input:    null,
			jukebox:  null,
			renderer: null,
			viewport: null,

			// Custom Settings
			tethering: false,
			stealth:   true,
			cache:     '~/Research'

		}, data);


		this.bot     = new _Bot();
		this.plugins = {};


		_Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			this.settings.appserver = this.settings.server;
			this.settings.server    = null;

			this.settings.appclient = this.settings.client;
			this.settings.client    = null;


			oncomplete(true);

		}, this, true);

		this.bind('init', function() {

			let appserver = this.settings.appserver || null;
			if (appserver !== null) {
				this.server = new _app.net.Server(appserver);
			}

			let appclient = this.settings.appclient || null;
			if (appclient !== null) {
				this.client = new _app.net.Client(appclient);
			}

			let loop = this.loop;
			if (loop !== null) {
				loop.unbind('render');
				loop.unbind('update');
			}


			this.setPlugin('reddit', new _app.plugin.Reddit(this));


			this.setState('dialog',   new _app.state.Dialog(this));
			this.setState('browse',   new _app.state.Browse(this));
			this.setState('help',     new _app.state.Help(this));
			this.setState('search',   new _app.state.Search(this));
			this.setState('settings', new _app.state.Settings(this));

			this.changeState('dialog');

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Main.prototype.serialize.call(this);
			data['constructor'] = 'app.Main';


			let settings = data['arguments'][0] || {};
			let blob     = data['blob'] || {};


			if (this.settings.appclient !== null) settings.client = this.defaults.client;
			if (this.settings.appserver !== null) settings.server = this.defaults.server;


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		command: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			if (sentence !== null) {

				let bot = this.bot;
				if (bot !== null) {

					let suggestions = bot.command(sentence.split(' ').map(function(word) {
						return word.replace(/(\?|\!|\.)/g, '').trim();
					}).filter(function(word) {
						return word !== '';
					}).join(' '));

					if (suggestions !== null) {

						let result = false;

						for (let s = 0, sl = suggestions.length; s < sl; s++) {

							let suggestion  = suggestions[s];
							let intent      = suggestion.intent;

							let action = intent.action || null;
							if (action !== null) {

								let state = this.__states[action] || null;
								if (state !== null) {

									if (state !== this.state) {

										result = this.changeState(action, intent);

										break;

									} else if (state === this.state) {

										result = this.state.update(intent);

										break;

									}

								}

							}

						}

						return result;

					}

				}

			}


			return false;

		},

		changeState: function(id, data, silent) {

			id     = typeof id === 'string' ? id   : null;
			data   = data !== undefined     ? data : null;
			silent = silent === true;


			if (id !== null) {

				let result = _Main.prototype.changeState.call(this, id, data);
				if (result === true && silent === false) {

					if (_WM !== null) {
						_WM.changeState(id, data);
					}

				}

			}

		},

		setPlugin: function(id, plugin) {

			id     = typeof id === 'string'   ? id     : null;
			plugin = plugin instanceof Object ? plugin : null;


			if (id !== null) {

				this.plugins[id] = plugin;

				return true;

			}


			return false;

		}

	};


	return Composite;

});

