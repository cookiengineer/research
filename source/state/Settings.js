
lychee.define('app.state.Settings').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _fs       = global.require('fs');
	const _APPDATA  = lychee.import('nw').App.dataPath || lychee.ROOT.project;
	const _STATE    = $.state('settings', attachments["html"], attachments["css"]);
	const _ARTICLE  = _STATE.query('article');
	const _FOOTER   = _STATE.query('footer');
	const _State    = lychee.import('lychee.app.State');
	const _ELEMENTS = {
		tethering: [
			_STATE.query('#settings-tethering input'),
			_STATE.query('#settings-tethering p')
		],
		stealth: [
			_STATE.query('#settings-stealth input'),
			_STATE.query('#settings-stealth p')
		],
		connections: [
			_STATE.query('#settings-connections input'),
			_STATE.query('#settings-connections label.button:nth-of-type(1)'),
			_STATE.query('#settings-connections label.button:nth-of-type(2)')
		],
		cache: [
			_STATE.query('#settings-cache-folder input[type="text"]'),
			_STATE.query('#settings-cache-folder input[type="file"]')
		],
		cache_erase: [
			_STATE.query('#settings-cache-clear input'),
			_STATE.query('#settings-cache-clear button')
		]
	};



	/*
	 * FEATURE DETECTION
	 */

	(function(footer) {

		let link = footer.query('a');
		if (link !== null) {

			link.bind('click', function(value) {

				let main = global.MAIN || null;
				if (main !== null) {

					main.changeState('browse', {
						plugin: 'generic',
						url:    value
					});

				}

			}, this);

		}

	})(_FOOTER);



	/*
	 * HELPERS
	 */

	const _bind_elements = function() {

		let settings = this.settings;

		_ELEMENTS.tethering[0].bind('change', function(value) {
			settings.tethering = value;
			_ELEMENTS.tethering[1].state(value ? 'active' : 'inactive');
		});

		_ELEMENTS.stealth[0].bind('change', function(value) {
			settings.stealth = value;
			_ELEMENTS.stealth[1].state(value ? 'active' : 'inactive');
		});

		_ELEMENTS.connections[0].bind('change', function(value) {
			_ELEMENTS.connections[0].value(value);
			settings.connections = value;
		});

		_ELEMENTS.connections[1].bind('click', function() {

			let value  = _ELEMENTS.connections[0].value() - 1;
			let result = _ELEMENTS.connections[0].value(value);
			if (result === true) {
				settings.connections = value;
			}

		});

		_ELEMENTS.connections[2].bind('click', function() {

			let value  = _ELEMENTS.connections[0].value() + 1;
			let result = _ELEMENTS.connections[0].value(value);
			if (result === true) {
				settings.connections = value;
			}

		});

		_ELEMENTS.cache[0].bind('change', function(value) {

			if (value.startsWith('~') || value.startsWith('/')) {

				let check = value.split('/').filter(v => (v !== '.' && v !== '..')).join('/');
				if (check === value) {
					settings.cache = value;
				} else {
					_ELEMENTS.cache[0].value('~/Research');
					settings.cache = '~/Research';
				}

			}

		});

		_ELEMENTS.cache[1].bind('change', function(value) {

			if (value.startsWith('/home/')) {
				value = '~/' + value.split('/').slice(3).join('/');
			}

			_ELEMENTS.cache[0].value(value);
			settings.cache = value;

		});

		_ELEMENTS.cache_erase[1].attr('disabled', true);
		_ELEMENTS.cache_erase[0].bind('change', function(value) {

			if (value === 'Dashwood') {
				_ELEMENTS.cache_erase[1].attr('disabled', false);
			} else {
				_ELEMENTS.cache_erase[0].value('');
				_ELEMENTS.cache_erase[1].attr('disabled', true);
			}

		});

		_ELEMENTS.cache_erase[1].bind('click', function() {
			console.log('ERASE MEMORY NAO');
		});

	};

	const _unbind_elements = function() {

		_ELEMENTS.tethering[0].unbind();
		_ELEMENTS.stealth[0].unbind();
		_ELEMENTS.connections[0].unbind();
		_ELEMENTS.connections[1].unbind();
		_ELEMENTS.connections[2].unbind();
		_ELEMENTS.cache[0].unbind();
		_ELEMENTS.cache[1].unbind();
		_ELEMENTS.cache_erase[0].unbind();
		_ELEMENTS.cache_erase[1].unbind();

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

	let Composite = function(main) {

		this.settings = main.settings;


		_State.call(this, main);
		_read_settings.call(this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Settings';


			return data;

		},

		enter: function(oncomplete, data) {

			_read_settings.call(this);
			_bind_elements.call(this);
			_STATE.enter();


			let settings = this.settings;

			_ELEMENTS.tethering[0].value(settings.tethering);
			_ELEMENTS.tethering[1].state(settings.tethering ? 'active' : 'inactive');
			_ELEMENTS.stealth[0].value(settings.stealth);
			_ELEMENTS.stealth[1].state(settings.stealth ? 'active' : 'inactive');
			_ELEMENTS.connections[0].value(settings.connections);
			_ELEMENTS.cache[0].value(settings.cache);
			_ELEMENTS.cache_erase[0].value('');
			_ELEMENTS.cache_erase[1].attr('disabled', true);


			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_unbind_elements.call(this);
			_save_settings.call(this);
			_STATE.leave();


			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});

