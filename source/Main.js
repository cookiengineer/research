
lychee.define('app.Main').requires([
	'app.net.Remote',
	'lychee.net.Server'
]).includes([
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _Emitter = lychee.import('lychee.event.Emitter');
	const _Remote  = lychee.import('app.net.Remote');
	const _Server  = lychee.import('lychee.net.Server');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		this.settings = Object.assign({}, data);


		this.server = null;


		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('init', function() {

			let settings = this.settings;

			this.server = new _Server({
				host:   settings.host,
				port:   settings.port,
				remote: _Remote,
				type:   _Server.TYPE.HTTP
			});

			this.server.connect();

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * MAIN API
		 */

		init: function() {

			lychee.debug = true;

			this.trigger('init');

		},

		destroy: function(code) {

			code = typeof code === 'number' ? code : 0;


			this.server.disconnect();
			this.trigger('destroy', [ code ]);

		}

	};


	return Composite;

});

