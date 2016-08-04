
lychee.define('app.net.Remote').requires([
	'app.plugin.Imgur',
	'app.plugin.Reddit',
	'app.plugin.Generic',
	'lychee.codec.JSON'
]).includes([
	'lychee.net.Tunnel'
]).exports(function(lychee, global, attachments) {

	const _Tunnel  = lychee.import('lychee.net.Tunnel');
	const _JSON    = lychee.import('lychee.codec.JSON');
	const _PLUGINS = [
		lychee.import('app.plugin.Imgur'),
		lychee.import('app.plugin.Reddit'),
		lychee.import('app.plugin.Generic')
	].filter(plugin => plugin !== null);



	/*
	 * HELPERS
	 */

	const _on_receive = function(remote, payload, headers) {

		for (let p = 0, pl = _PLUGINS.length; p < pl; p++) {

			let plugin = _PLUGINS[p];
			if (plugin.can(headers) === true) {

				let result = plugin.process(remote, headers);
				if (result === true) {
					break;
				} else {
					console.warn(plugin.displayName + ': Not supported ("' + headers.url + '")');
				}

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			codec: _JSON,
			type:  _Tunnel.TYPE.HTTP
		}, data);


		_Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('#receive', _on_receive, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'app.net.Remote';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		send: function(data, headers) {

			headers = headers instanceof Object ? headers : {};


			if (data instanceof Object) {

				headers['access-control-allow-origin'] = '*';
				headers['content-control']             = 'no-transform';
				headers['content-type']                = 'application/json; charset=utf-8';


				let event = headers['event'] || null;
				if (event === 'error') {
					headers['status'] = '400 Bad Request';
				}


				if (/@plug|@unplug/g.test(headers.method) === false) {
					return _Tunnel.prototype.send.call(this, data, headers);
				}

			} else {

				let payload = null;

				if (typeof data === 'string') {
					payload = new Buffer(data, 'utf8');
				} else if (data instanceof Buffer) {
					payload = data;
				}


				if (payload instanceof Buffer) {

					this.trigger('send', [ payload, headers ]);

					return true;

				}

			}


			return false;

		},

		sendImage: function(payload, headers) {

			headers = headers instanceof Object ? headers : {};


			if (payload instanceof Buffer) {

				headers['access-control-allow-origin'] = '*';
				headers['content-control']             = 'no-transform';

				this.trigger('send', [ payload, headers ]);


				return true;

			}


			return false;

		},

		sendJSON: function(data, headers) {

			headers = headers instanceof Object ? headers : {};


			if (data instanceof Object) {

				let payload = new Buffer(JSON.stringify(data), 'utf8');

				headers['access-control-allow-origin'] = '*';
				headers['content-control']             = 'no-transform';
				headers['content-type']                = 'application/json; charset=utf-8';

				this.trigger('send', [ payload, headers ]);


				return true;

			}


			return false;

		}

	};


	return Composite;

});

