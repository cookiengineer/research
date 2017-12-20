
lychee.define('app.state.Settings').requires([
	'app.interface.Intent'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Intent    = lychee.import('app.interface.Intent');
	const _State     = lychee.import('lychee.app.State');
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-settings'];
	const _main      = global.document.querySelector('main');
	const _fs        = global.require('fs');
	const _APPDATA   = lychee.import('nw').App.dataPath || lychee.ROOT.project;



	/*
	 * FEATURE DETECTION
	 */

	// (function(footer) {

	// 	let link = footer.query('a');
	// 	if (link !== null) {

	// 		link.bind('click', function(value) {

	// 			let main = global.MAIN || null;
	// 			if (main !== null) {

	// 				main.changeState('browse', {
	// 					plugin: 'generic',
	// 					url:    value
	// 				});

	// 			}

	// 		}, this);

	// 	}

	// })(_FOOTER);



	/*
	 * HELPERS
	 */

	const _on_memory = function() {
		console.warn('Clearing Cache and Knowledge now...');
	};

	const _on_settings = function(settings) {

		// TODO: If this.settings.cache !== settings.cache, but
		// this.settings.cache has files, then move folder contents...

		this.settings.tethering   = settings.tethering;
		this.settings.stealth     = settings.stealth;
		this.settings.connections = settings.connections;
		this.settings.cache       = settings.cache;

		_save_settings.call(this);

	};

	const _read_settings = function() {

		let data     = null;
		let settings = this.settings;

		try {
			data = JSON.parse(_fs.readFileSync(_APPDATA + '/research.json', 'utf8'));
		} catch (err) {
		}

		if (data !== null) {

			settings.tethering   = typeof data.tethering === 'boolean'  ? data.tethering   : settings.tethering;
			settings.stealth     = typeof data.stealth === 'boolean'    ? data.stealth     : settings.stealth;
			settings.connections = typeof data.connections === 'number' ? data.connections : settings.connections;
			settings.cache       = typeof data.cache === 'string'       ? data.cache       : settings.cache;

		}

	};

	const _save_settings = function() {

		let settings = this.settings;
		let data     = {
			tethering:   settings.tethering,
			stealth:     settings.stealth,
			connections: settings.connections,
			cache:       settings.cache
		};

		try {
			_fs.writeFileSync(_APPDATA + '/research.json', JSON.stringify(data, null, '\t'), 'utf8');
		} catch (err) {
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		this.settings = main.settings;
		this.element  = _COMPONENT.create();

		this.__listener = {
			memory:   null,
			settings: null
		};


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
			data['constructor'] = 'app.state.Settings';


			return data;

		},

		enter: function(oncomplete, intent) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;
			intent     = intent instanceof _Intent      ? intent     : null;


			_read_settings.call(this);

			this.__listener.memory = function(e) {
				_on_memory.call(this);
			}.bind(this);

			this.__listener.settings = function(e) {
				_on_settings.call(this, e.detail);
			}.bind(this);

			this.element.fireEventListener('enter', this.settings);

			this.element.addEventListener('settings', this.__listener.settings, true);
			this.element.addEventListener('memory',   this.__listener.memory,   true);


			return _State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;


			_save_settings.call(this);

			this.element.removeEventListener('memory',   this.__listener.memory,   true);
			this.element.removeEventListener('settings', this.__listener.settings, true);

			this.element.fireEventListener('leave', null);

			this.__listener.memory   = null;
			this.__listener.settings = null;


			return _State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});

