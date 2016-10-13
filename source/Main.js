
lychee.define('app.Main').requires([
//	'app.state.Archive',
//	'app.state.Backup',
	'app.state.Browse',
//	'app.state.News',
//	'app.state.Search',
	'lychee.net.Server',
	'lychee.Input'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	const _app    = lychee.import('app');
	const _Main   = lychee.import('lychee.app.Main');
	const _Server = lychee.import('lychee.net.Server');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			client:   null,
			server:   null,

			input:    null,
			jukebox:  null,
			loop:     null,
			renderer: null,
			viewport: null
		}, data);


		_Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {

			this.settings.appclient = this.settings.client;
			this.settings.client    = null;

			this.settings.appserver = this.settings.server;
			this.settings.server    = null;


			// TODO: Integrate an App Cache for Website Index

			// this.cache = new _app.Cache(this);

			// this.cache.bind('complete', function() {
			// 	oncomplete(true);
			// }, this);


			oncomplete(true);

		}, this, true);

		this.bind('init', function() {

			let appclient = this.settings.appclient || null;
			if (appclient !== null) {
				this.client = new _app.net.Client(appclient);
			}

			let appserver = this.settings.appserver || null;
			if (appserver !== null) {
				this.server = new _app.net.Server(appserver);
			}


			this.setState('browse', new _app.state.Browse(this));


			this.changeState('browse');

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

		}

	};


	return Composite;

});

