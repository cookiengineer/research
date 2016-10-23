
lychee.define('app.net.remote.Control').requires([
	'app.net.Scraper'
]).includes([
	'lychee.net.Service'
]).exports(function(lychee, global, attachments) {

	const _Service = lychee.import('lychee.net.Service');
	const _SCRAPER = lychee.import('app.net.Scraper');



	/*
	 * HELPERS
	 */

	const _on_ping = function(data) {

		if (this.tunnel !== null) {

			this.tunnel.send({
				ping: data.ping,
				pong: Date.now()
			}, {
				id:    this.id,
				event: 'pong'
			});

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(remote) {

		_Service.call(this, 'control', remote, _Service.TYPE.remote);


		// this.bind('ping', _on_ping, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Service.prototype.serialize.call(this);
			data['constructor'] = 'app.net.remote.Control';
			data['arguments']   = [ null ];


			return data;

		},



		/*
		 * CUSTOM API
		 */

		browse: function(data) {

			_SCRAPER.scrape(data, function(result) {

				let tunnel = this.tunnel || null;
				if (tunnel !== null && result !== null) {

					tunnel.send(result, {
						id:    this.id,
						event: 'browse'
					});

				}

			}, this);

		}

	};


	return Composite;

});

