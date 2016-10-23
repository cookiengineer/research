
lychee.define('app.net.Server').requires([
	'app.net.remote.Archive',
	'app.net.remote.Control'
]).includes([
	'lychee.net.Server'
]).exports(function(lychee, global, attachments) {

	const _Archive = lychee.import('app.net.remote.Archive');
	const _Control = lychee.import('app.net.remote.Control');
	const _Server  = lychee.import('lychee.net.Server');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
		}, data);


		_Server.call(this, settings);


		this.codec = {
			encode: (data) => new Buffer(JSON.stringify(data), 'utf8'),
			decode: (data) => JSON.parse(data.toString('utf8'))
		};



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

