
lychee.define('app.net.client.Archive').includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	const _Service = lychee.import('lychee.net.Service');



	/*
	 * HELPERS
	 */

	const _on_pong = function(data) {

		data.pung = Date.now();

		let ping = (data.pong - data.ping).toFixed(0);
		let pong = (data.pung - data.pong).toFixed(0);


		this.trigger('statistics', [ ping, pong ]);

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(client) {

		_Service.call(this, 'archive', client, _Service.TYPE.client);


		// this.bind('pong', _on_pong, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Service.prototype.serialize.call(this);
			data['constructor'] = 'app.net.client.Archive';
			data['arguments']   = [ '#MAIN.client' ];


			return data;

		},



		/*
		 * CUSTOM API
		 */

		ping: function() {

			if (this.tunnel !== null) {

				this.tunnel.send({
					ping: Date.now()
				}, {
					id:    this.id,
					event: 'ping'
				});

				return true;

			}


			return false;

		}

	};


	return Composite;

});

