
lychee.define('app.Main').requires([
	'app.interface.Bot',
	// 'app.net.Client',
	// 'app.net.Server',
	'app.net.Scraper',
	'app.plugin.Reddit',
	'app.state.Browse',
	'app.state.Dialog',
	'app.state.Help',
	// 'app.state.Archive',
	// 'app.state.Backup',
	// 'app.state.Browse',
	'app.state.Settings',
	'lychee.Input'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	const _app     = lychee.import('app');
	const _Bot     = lychee.import('app.interface.Bot');
	const _Main    = lychee.import('lychee.app.Main');
	const _Scraper = lychee.import('app.net.Scraper');
	const _WM      = lychee.import('WM');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({
			client:   null,
			server:   null,

			input:    null,
			jukebox:  null,
			renderer: null,
			viewport: null,

			// Custom Settings
			tethering:   false,
			stealth:     true,
			connections: 8,
			cache:       '~/Research'

		}, data);


		this.bot     = new _Bot();
		this.scraper = new _Scraper(this);
		this.plugins = {};


		_Main.call(this, states);

		states = null;



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

			// let appserver = this.settings.appserver || null;
			// if (appserver !== null) {
			// 	this.server = new _app.net.Server(appserver);
			// }

			// let appclient = this.settings.appclient || null;
			// if (appclient !== null) {
			// 	this.client = new _app.net.Client(appclient);
			// }

			let loop = this.loop;
			if (loop !== null) {
				loop.unbind('render');
				loop.unbind('update');
			}


			this.setPlugin('reddit', new _app.plugin.Reddit(this));


			this.setState('dialog',   new _app.state.Dialog(this));
			this.setState('browse',   new _app.state.Browse(this));
			this.setState('help',     new _app.state.Help(this));
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


			if (this.bot !== null)     blob.bot     = lychee.serialize(this.bot);
			if (this.scraper !== null) blob.scraper = lychee.serialize(this.scraper);


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
						return word.replace(/(\?|!|\.)/g, '').trim();
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

				return result;

			}


			return false;

		},

		findPlugin: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				let found = null;

				for (let p in this.plugins) {

					if (p === 'generic') continue;

					let plugin = this.plugins[p];
					if (plugin.can(url) === true) {
						found = p;
						break;
					}

				}

				return found;

			}


			return null;

		},

		getPlugin: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && this.plugins[id] !== undefined) {

				return this.plugins[id];

			}


			return null;

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

