
lychee.define('app.net.Client').requires([
	'app.net.client.Archive',
	'app.net.client.Control'
]).includes([
	'lychee.net.Client'
]).exports(function(lychee, global, attachments) {

	const _Client  = lychee.import('lychee.net.Client');
	const _Archive = lychee.import('app.net.client.Archive');
	const _Control = lychee.import('app.net.client.Control');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			reconnect: 10000
		}, data);


		_Client.call(this, settings);

		settings = null;


		this.codec = {
			encode: (data) => new Buffer(JSON.stringify(data), 'utf8'),
			decode: (data) => JSON.parse(data.toString('utf8'))
		};



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {

			this.addService(new _Archive(this));
			this.addService(new _Control(this));

			if (lychee.debug === true) {
				console.log('app.net.Client: Remote connected');
			}

		}, this);

		this.bind('disconnect', function(code) {

			if (lychee.debug === true) {
				console.log('app.net.Client: Remote disconnected (' + code + ')');
			}

		}, this);


		this.connect();

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Client.prototype.serialize.call(this);
			data['constructor'] = 'app.net.Client';


			return data;

		}

	};


	return Composite;

});

