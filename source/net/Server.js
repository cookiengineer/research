
lychee.define('app.net.Server').requires([
	'app.net.remote.Archive',
	'app.net.remote.Control',
	'lychee.codec.JSON'
]).includes([
	'lychee.net.Server'
]).exports(function(lychee, global, attachments) {

	const _Archive = lychee.import('app.net.remote.Archive');
	const _Control = lychee.import('app.net.remote.Control');
	const _Server  = lychee.import('lychee.net.Server');
	const _JSON    = lychee.import('lychee.codec.JSON');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			codec: _JSON
		}, data);


		_Server.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function(remote) {

			console.log('app.net.Server: Remote connected (' + remote.host + ':' + remote.port + ')');

			remote.addService(new _Archive(remote));
			remote.addService(new _Control(remote));

		}, this);

		this.bind('disconnect', function(remote) {

			console.log('app.net.Server: Remote disconnected (' + remote.host + ':' + remote.port + ')');

		}, this);


		this.connect();

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Server.prototype.serialize.call(this);
			data['constructor'] = 'app.net.Server';


			return data;

		}

	};


	return Composite;

});

